from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from app.moderation import moderate_content, moderate_image

app = FastAPI(
    title="Content Moderation API",
    description="API for text content moderation",
    version="1.0"
)

class ModerationRequest(BaseModel):
    text: str = None
    imageBase64: str = None

@app.post("/moderate")
async def moderate(request: ModerationRequest):
    return await moderate_content(request.text, request.imageBase64)

# @app.post("/moderate/image")
# async def moderate_image_endpoint(file: UploadFile = File(...)):
#     return await moderate_image(file) 