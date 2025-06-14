from app.text_moderation import analyze_text
from app.scoring import compute_score

async def moderate_content(text: str = None, imageBase64: str = None):
    details = {}
    text_result = None

    if text:
        text_result = await analyze_text(text)
        details.update(text_result['details'])

    score = compute_score(details)
    return {
        "details": details,
        "score": score,
        "allowed_for_all_audience": score > 0.8
    }

async def moderate_image(file):
    return {"error": "Image moderation is not supported in this deployment."} 