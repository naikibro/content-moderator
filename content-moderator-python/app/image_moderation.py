from nsfw_detector import predict
import tempfile
import base64

model = predict.load_model()

async def analyze_image(image_base64: str):
    with tempfile.NamedTemporaryFile(suffix=".jpg") as temp:
        temp.write(base64.b64decode(image_base64))
        temp.flush()
        result = predict.classify(model, temp.name)
    # Example: result = {'image.jpg': {'neutral': 0.9, 'porn': 0.1, ...}}
    details = next(iter(result.values()))
    return {"details": details} 