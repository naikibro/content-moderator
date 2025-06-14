# Content Moderation Microservice

A NestJS-based microservice for content moderation that uses local AI models to detect inappropriate content in text and images.

## Features

- Text moderation using DistilBERT model
- Image moderation using NSFW.js
- Local AI processing (no external API calls)
- RESTful API endpoints
- Score-based moderation (0-1 scale)

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run start:dev
```

## API Endpoints

### Text Moderation

```http
POST /moderate/text
Content-Type: application/json

{
  "text": "Your text to moderate"
}
```

Response:

```json
{
  "score": 0.95,
  "categories": {
    "safe": 0.95,
    "unsafe": 0.05
  }
}
```

### Image Moderation

```http
POST /moderate/image
Content-Type: multipart/form-data

image: [binary file]
```

Response:

```json
{
  "score": 0.85,
  "categories": {
    "drawing": 0.1,
    "hentai": 0.0,
    "neutral": 0.85,
    "porn": 0.0,
    "sexy": 0.05
  }
}
```

## Score Interpretation

- Score closer to 1: Content is safe for all audiences
- Score closer to 0: Content may be inappropriate

## Technologies Used

- NestJS
- @xenova/transformers (Text moderation)
- nsfwjs (Image moderation)
- TypeScript
