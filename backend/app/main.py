from fastapi import FastAPI
from app.predict import predict_disease
from pydantic import BaseModel

class SymptomData(BaseModel):
    fever: int
    cough: int
    fatigue: int
    headache: int
    breathing_difficulty: int
    vomiting: int
    diarrhea: int
    rash: int
    joint_pain: int
    chills: int

    email: str
    city: str
app = FastAPI()


@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}


@app.post("/predict")
def predict(data: SymptomData):
    return predict_disease(data.dict())