import os
import uuid
import requests

import google.auth
from google.auth.transport.requests import Request
from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types

app = Flask(__name__)

_, project = google.auth.default(request=Request())

model = os.environ.get("MODEL", "gemini-3.1-flash-lite-preview")
location = os.environ.get("VERTEX_LOCATION", "global")

client = genai.Client(vertexai=True, project=project, location=location)

def search_nearby_places(query: str, location: str, radius: int = 1500) -> dict:
    """
    Wyszukuje pobliskie miejsca, restauracje i sklepy za pomocą Google Maps API.
    Użyj tej funkcji, gdy użytkownik pyta o jedzenie lub miejsca w pobliżu.
    
    Args:
        query: Rodzaj jedzenia lub miejsca (np. "cukiernia", "kebab", "lody").
        location: Obecna lokalizacja w formacie "szerokość,długość" (np. "52.2,21.0").
        radius: Promień wyszukiwania w metrach.
    """
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        return {"error": "Brak klucza GOOGLE_MAPS_API_KEY skonfigurowanego w środowisku."}

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": query,
        "location": location,
        "radius": radius,
        "key": api_key,
        "language": "pl"
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        results = response.json().get("results", [])
        # Ograniczamy do 5 wyników, żeby nie zużyć za dużo tokenów na odpowiedź
        return {"places": [{"name": r.get("name"), "address": r.get("formatted_address"), "rating": r.get("rating")} for r in results[:5]]}
    except Exception as e:
        return {"error": str(e)}

chat_sessions = {}

@app.route("/")
def index():
    return render_template("index.html", model=model)


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    session_id = data.get("session_id", "")
    lat = data.get("lat")
    lng = data.get("lng")

    if not user_message.strip():
        return jsonify({"error": "Empty message"}), 400

    if not session_id:
        session_id = str(uuid.uuid4())
        
    # Jeśli z frontendu przyszła lokalizacja, wstrzykujemy ją w ukryciu do promptu,
    # aby model wiedział gdzie znajduje się użytkownik.
    context_message = user_message
    if lat and lng:
        context_message = f"[System: Użytkownik jest w lokalizacji lat:{lat}, lng:{lng}] {user_message}"

    if session_id not in chat_sessions:
        config = types.GenerateContentConfig(
            tools=[search_nearby_places],
            system_instruction="Jesteś pomocnym asystentem i doradcą kulinarnym. Kiedy użytkownik pyta o jedzenie, użyj narzędzia 'search_nearby_places' do znalezienia miejsc w pobliżu. Google Maps nie zwraca menu – na podstawie nazwy miejsca (np. Piekarnia, Cukiernia) oraz budżetu użytkownika zaproponuj co może zjeść i rozsądnie oszacuj cenę (np. ciastko za 15 zł, lody za 12 zł, bułka za 8 zł)."
        )
        chat_sessions[session_id] = client.chats.create(model=model, config=config)

    try:
        response = chat_sessions[session_id].send_message(context_message)
        return jsonify({"response": response.text, "session_id": session_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
