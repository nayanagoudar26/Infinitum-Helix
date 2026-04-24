import pickle
import numpy as np
import pandas as pd
import json

from weather_api import get_weather
from outbreak import update_cases, check_outbreak


# Load model + features
model = pickle.load(open("models/disease_model.pkl", "rb"))
features = pickle.load(open("models/features.pkl", "rb"))


def prepare_input(symptoms, weather):
    input_dict = {f: 0 for f in features}

    # Fill symptoms
    for s in symptoms:
        if s in input_dict:
            input_dict[s] = symptoms[s]

    # Add weather
    if "temp" in input_dict:
        input_dict["temp"] = weather["temp"]

    if "humidity" in input_dict:
        input_dict["humidity"] = weather["humidity"]

    df = pd.DataFrame([input_dict])
    return df


def predict_disease(symptoms, city):
    # 🌦 Get weather
    weather = get_weather(city)

    # Prepare input
    data = prepare_input(symptoms, weather)
    print("DATA SHAPE:", data.shape)

    # Prediction
    prediction = model.predict(data)[0]

    # 🔥 SAFE PROBABILITY FIX
    proba = model.predict_proba(data)
    print("RAW PROBA:", proba)

    try:
        if isinstance(proba, np.ndarray):
            probability = float(np.max(proba))

        elif isinstance(proba, list):
            probability = float(max([np.max(p) for p in proba]))

        else:
            probability = 0.0

    except Exception as e:
        print("Probability error:", e)
        probability = 0.0

    print("FINAL PROBABILITY:", probability)

    # Risk level
    if probability > 0.7:
        risk = "High"
    elif probability > 0.4:
        risk = "Medium"
    else:
        risk = "Low"

    # Outbreak tracking
    update_cases(city, prediction)
    is_outbreak, count = check_outbreak(city, prediction)

    # Final result
    result = {
        "disease": prediction,
        "risk": risk,
        "confidence": probability,
        "weather": weather
    }

    # Alert
    if is_outbreak:
        result["alert"] = f"⚠️ {prediction} cases rising in {city} ({count} cases)"
    else:
        result["alert"] = "No outbreak detected"

    # 💡 Smart suggestion (NEW)
    if weather["humidity"] > 70:
        result["suggestion"] = "High humidity → risk of fungal infections"
    elif weather["temp"] > 35:
        result["suggestion"] = "High temperature → risk of heat-related illness"
    else:
        result["suggestion"] = "Normal conditions"

    return result


# 🧪 TEST RUN
if __name__ == "__main__":
    symptoms = {
        "itching": 1,
        "skin_rash": 1
    }

    city = "Bangalore"

    result = predict_disease(symptoms, city)

    # ✅ CLEAN PRINT (THIS IS WHAT YOU ASKED)
    print("\nFINAL RESULT:")
    print(json.dumps(result, indent=4))