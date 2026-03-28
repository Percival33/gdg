# Multi-stage Dockerfile to build the Vite frontend and run the Flask API

# Frontend build stage
FROM node:22-alpine AS frontend-build
WORKDIR /app/web-app
COPY web-app/package*.json ./
RUN npm ci
COPY web-app/ .
RUN npm run build

# Backend runtime stage
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install Python dependencies
COPY chatbot/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY chatbot/ /app/chatbot/

# Copy built frontend into Flask static folder
COPY --from=frontend-build /app/web-app/dist/ /app/chatbot/static/

# Move index.html into templates so Flask can render it
RUN mkdir -p /app/chatbot/templates \
    && if [ -f /app/chatbot/static/index.html ]; then cp /app/chatbot/static/index.html /app/chatbot/templates/index.html; fi

EXPOSE 8080
WORKDIR /app/chatbot
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
