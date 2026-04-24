import requests

# 🔑 Replace with your API key
API_KEY = "7478721f5608353c1827f07db83b1bfd"

def get_weather(city):
    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    response = requests.get(url, params=params)

    # Debug prints (you can remove later)
    print("Status:", response.status_code)
    print("Response:", response.text)

    # If API fails
    if response.status_code != 200:
        return None

    data = response.json()

    return {
        "temp": data["main"]["temp"],
        "humidity": data["main"]["humidity"]
    }


# 🔥 TEST (optional)
if __name__ == "__main__":
    city = "Bangalore"
    weather = get_weather(city)
    print(weather)