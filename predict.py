import pickle
import numpy as np
from weather_api import get_weather

# Load model and feature order
model = pickle.load(open("models/disease_model.pkl", "rb"))
FEATURE_ORDER = pickle.load(open("models/features.pkl", "rb"))

def predict_disease(symptoms, city):

    weather = get_weather(city)

    if weather is None:
        return {"error": "Weather not found"}

    # Initialize all features to 0
    input_data = {feature: 0 for feature in FEATURE_ORDER}

    # Add symptoms
    for key in symptoms:
        if key in input_data:
            input_data[key] = symptoms[key]

    # Add weather
    input_data["temp"] = weather["temp"]
    input_data["humidity"] = weather["humidity"]

    # Convert to array
    data = np.array([input_data[f] for f in FEATURE_ORDER]).reshape(1, -1)

    prediction = model.predict(data)[0]
    probability = max(model.predict_proba(data)[0])

    # Risk logic
    if probability > 0.7:
        risk = "HIGH"
    elif probability > 0.4:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "disease": prediction,
        "risk": risk,
        "confidence": float(probability),
        "weather": weather
    }


# 🔥 TEST
if __name__ == "__main__":
    symptoms = {
        "itching": 1,
        "skin_rash": 1
    }

    city = "Bangalore"

    result = predict_disease(symptoms, city)
    print(result)