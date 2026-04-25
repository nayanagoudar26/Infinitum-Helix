from app.database import conn, cursor
import requests
import os
import joblib
import smtplib
from email.mime.text import MIMEText

# =========================
# WEATHER FUNCTION
# =========================
def get_weather(city="Bangalore"):
    api_key = os.getenv("OPENWEATHER_API_KEY")

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    response = requests.get(url)
    data = response.json()

    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    rainfall = data.get("rain", {}).get("1h", 0)

    return temp, humidity, rainfall


# =========================
# LOAD MODEL
# =========================
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "model.pkl")

print(f"🚀 Loading model from: {model_path}")
model = joblib.load(model_path)
print("✅ Model loaded successfully")


# =========================
# EMAIL FUNCTION
# =========================
def send_email_alert(disease, alert, receiver):
    try:
        print("📨 Sending email alert...")

        sender = os.getenv("EMAIL_USER")
        password = os.getenv("EMAIL_PASS")   # App password

        message = MIMEText(f"""
ALERT: {alert}

Disease Detected: {disease}

Please take precautions immediately.
""")

        message["Subject"] = "🚨 Disease Alert System"
        message["From"] = sender
        message["To"] = receiver

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, receiver, message.as_string())
        server.quit()

        print("📧 Email sent successfully")

    except Exception as e:
        print("❌ Email error:", e)


# =========================
# PREDICT FUNCTION
# =========================
def predict_disease(data: dict):
    try:
        print("🔥 FUNCTION CALLED")

        # Extract email and city
        email = data.get("email", None)
        city = data.get("city", "Bangalore")

        print("📧 Email:", email)
        print("📍 City:", city)

        # Get weather data
        temp, humidity, rainfall = get_weather(city)
        print("🌦 Weather:", temp, humidity, rainfall)

        # Remove email & city from input
        features = {k: v for k, v in data.items() if k not in ["email", "city"]}

        # Add weather data
        features["temp"] = temp
        features["humidity"] = humidity
        features["rainfall"] = rainfall

        # Convert to model input
        input_data = [list(features.values())]

        # Predict
        prediction = model.predict(input_data)[0]

        # Alert logic
        if prediction == "COVID-19":
            alert = "HIGH RISK ⚠️"
        else:
            alert = "LOW RISK ✅"

        # ✅ SAVE TO DATABASE (correct position)
        cursor.execute("""
                       INSERT INTO records (city, disease, alert, temperature, humidity, rainfall)
                       VALUES (?, ?, ?, ?, ?, ?)
                       """, (city, str(prediction), alert, temp, humidity, rainfall))
        conn.commit()
        cursor.execute("""
                       SELECT COUNT(*) FROM records
                       WHERE city = ? AND disease = ?
                       """,(city, str(prediction)))
        count = cursor.fetchone()[0]
        print(f"📊 Cases in {city} for {prediction}: {count}")
        # ✅ ADD HERE (OUTBREAK LOGIC)
        if count >= 5:
            outbreak = f"⚠️ Outbreak detected in {city} for {prediction}"
        else:
            outbreak = "No outbreak"
        # Send email
        if email:
            send_email_alert(prediction, alert, email)

        return {
    "disease": prediction,
    "alert": alert,
    "weather": {
        "temp": temp,
        "humidity": humidity,
        "rainfall": rainfall
    },
    "outbreak": outbreak
} 

    except Exception as e:
        print("❌ ERROR:", e)
        return {"error": str(e)}