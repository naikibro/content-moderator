from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

tokenizer = AutoTokenizer.from_pretrained('textdetox/xlmr-large-toxicity-classifier-v2')
model = AutoModelForSequenceClassification.from_pretrained('textdetox/xlmr-large-toxicity-classifier-v2')

async def analyze_text(text: str):
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    scores = torch.softmax(outputs.logits, dim=1).tolist()[0]
    return {
        "details": {
            "neutral": scores[0],
            "toxic": scores[1]
        }
    } 