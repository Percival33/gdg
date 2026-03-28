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
        places = []
        for r in results[:5]:
            geo = r.get("geometry", {}).get("location", {})
            places.append({
                "name": r.get("name"),
                "address": r.get("formatted_address"),
                "rating": r.get("rating"),
                "lat": geo.get("lat"),
                "lng": geo.get("lng"),
                "place_id": r.get("place_id")
            })
        return {"places": places}
    except Exception as e:
        return {"error": str(e)}

def set_navigation_destination(place_name: str, place_address: str, lat: float, lng: float, place_id: str = "") -> dict:
    """
    Ustawia wybrane miejsce jako cel nawigacji dla użytkownika.
    Użyj tej funkcji gdy użytkownik potwierdzi, że chce iść do konkretnego miejsca.
    
    Args:
        place_name: Nazwa miejsca (np. "Cukiernia Słodki Zakątek").
        place_address: Adres miejsca.
        lat: Szerokość geograficzna miejsca.
        lng: Długość geograficzna miejsca.
        place_id: ID miejsca w Google Maps (opcjonalne).
    """
    # Zapisujemy destynację w session - będzie dostępna dla endpointu
    return {
        "status": "success",
        "message": f"Ustawiono nawigację do: {place_name}",
        "destination": {
            "name": place_name,
            "address": place_address,
            "lat": lat,
            "lng": lng,
            "place_id": place_id
        }
    }

chat_sessions = {}
session_destinations = {}  # Przechowuje wybrane destynacje dla każdej sesji

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
            tools=[search_nearby_places, set_navigation_destination],
            system_instruction="""Jesteś pomocnym asystentem i doradcą kulinarnym. 
            
Kiedy użytkownik pyta o jedzenie:
1. Użyj 'search_nearby_places' do znalezienia miejsc w pobliżu
2. Zaproponuj konkretne miejsca z cenami (np. ciastko za 15 zł, lody za 12 zł)
3. Gdy użytkownik potwierdzi wybór miejsca (np. "okej, to jest najlepsze", "chcę tam iść"), 
   MUSISZ użyć funkcji 'set_navigation_destination' z danymi tego miejsca (nazwa, adres, lat, lng, place_id)
4. Po ustawieniu nawigacji poinformuj użytkownika, że może kliknąć przycisk "Go!" aby rozpocząć nawigację

Pamiętaj: ZAWSZE wywołaj set_navigation_destination gdy użytkownik potwierdzi wybór miejsca!"""
        )
        chat_sessions[session_id] = client.chats.create(model=model, config=config)

    try:
        response = chat_sessions[session_id].send_message(context_message)
        
        # Sprawdź czy w odpowiedzi model wywołał funkcję set_navigation_destination
        navigation_url = None
        response_text = response.text
        
        # Przeszukaj function calls w odpowiedzi
        if hasattr(response, 'candidates') and response.candidates:
            for candidate in response.candidates:
                if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                    for part in candidate.content.parts:
                        if hasattr(part, 'function_call') and part.function_call:
                            if part.function_call.name == 'set_navigation_destination':
                                args = part.function_call.args
                                destination = {
                                    "name": args.get("place_name", ""),
                                    "address": args.get("place_address", ""),
                                    "lat": args.get("lat", 0),
                                    "lng": args.get("lng", 0),
                                    "place_id": args.get("place_id", "")
                                }
                                session_destinations[session_id] = destination
                                
                                # Generuj URL nawigacji jeśli mamy lokalizację użytkownika
                                if lat and lng:
                                    navigation_url = f"https://www.google.com/maps/dir/?api=1&origin={lat},{lng}&destination={destination['lat']},{destination['lng']}&travelmode=walking"
        
        return jsonify({
            "response": response_text, 
            "session_id": session_id,
            "navigation_url": navigation_url,
            "destination": session_destinations.get(session_id)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/navigate", methods=["POST"])
def navigate():
    """
    Endpoint do pobierania linku nawigacji dla wybranego miejsca w sesji.
    """
    data = request.json
    session_id = data.get("session_id", "")
    lat = data.get("lat")
    lng = data.get("lng")
    
    if not session_id:
        return jsonify({"error": "Brak session_id"}), 400
    
    if session_id not in session_destinations:
        return jsonify({"error": "Nie wybrano jeszcze miejsca docelowego"}), 404
    
    destination = session_destinations[session_id]
    
    if not lat or not lng:
        return jsonify({"error": "Brak lokalizacji użytkownika"}), 400
    
    # Generuj URL nawigacji Google Maps
    navigation_url = f"https://www.google.com/maps/dir/?api=1&origin={lat},{lng}&destination={destination['lat']},{destination['lng']}&travelmode=walking"
    
    return jsonify({
        "navigation_url": navigation_url,
        "destination": destination
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
