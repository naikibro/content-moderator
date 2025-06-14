# Content Moderator Service

A standalone service for content moderation that provides both text and image analysis capabilities. The service uses machine learning models to detect inappropriate content and provide moderation scores.

## Features

- Text content moderation using Hugging Face's toxic-bert model
- Image content moderation using NSFW.js for detecting inappropriate images
- RESTful API endpoints for both text and image moderation
- Swagger/OpenAPI documentation
- Docker support for easy deployment

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Hugging Face API token (for text moderation)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Content Moderator Service
CONTENT_MODERATOR_PORT=4002
CONTENT_MODERATOR_CONTAINER_NAME=content-moderator
CONTENT_MODERATOR_DOCUMENTATION_TITLE="Content Moderator API"

# Hugging Face
HUGGINGFACE_HUB_TOKEN=your_huggingface_token_here
```

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd content-moderator
```

2. Install dependencies:

```bash
cd services/content-moderator
npm install
```

3. Start the service using Docker Compose:

```bash
docker-compose up -d
```

The service will be available at `http://localhost:4002`

## API Documentation

Once the service is running, you can access the Swagger documentation at:
`http://localhost:4002/api`

## Development

### Running Tests

```bash
cd services/content-moderator
npm run test
```

### Building the Service

```bash
cd services/content-moderator
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
