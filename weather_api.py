import requests

API_KEY = "7478721f5608353c1827f07db83b1bfd"

def get_weather(city):
    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    response = requests.get(url, params=params)

    print("Status:", response.status_code)
    print("Response:", response.text)

    if response.status_code != 200:
        return None

    data = response.json()

    return {
        "temp": data["main"]["temp"],
        "humidity": data["main"]["humidity"]
    }