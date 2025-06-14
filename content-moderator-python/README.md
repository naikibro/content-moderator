# 🧠 Content Moderation Microservice (Python)

A microservice for text and image content moderation, built with **FastAPI** and using **open-source AI models** locally.

## ✅ Features

- Detects inappropriate content in text (toxic, hate, etc.) and images (NSFW, etc.)
- Multilingual text moderation (using Hugging Face models)
- Local image moderation (using nsfw-detector)
- REST API with OpenAPI/Swagger docs
- No paid external APIs required

## ⚙️ Stack

| Component | Tool                                                                         |
| --------- | ---------------------------------------------------------------------------- |
| API       | FastAPI (Python)                                                             |
| Text AI   | Hugging Face Transformers (e.g. textdetox/xlmr-large-toxicity-classifier-v2) |
| Image AI  | nsfw-detector                                                                |

## 🚀 Quickstart

```bash
# Clone the repo
cd content-moderator-python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the API
uvicorn app.main:app --reload
```

- OpenAPI docs: http://localhost:8000/docs

## API Endpoints

- `POST /moderate` — Moderate text and/or image (base64)
- `POST /moderate/image` — Moderate image (file upload)

## Environment

- Python 3.8+
- CPU or GPU (optional for faster inference)

## License

MIT
