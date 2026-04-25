import requests
import random
import time

url = "http://127.0.0.1:8000/predict"

cities = ["Bangalore", "Delhi", "Mumbai"]

for i in range(20):
    data = {
        "fever": random.randint(0,1),
        "cough": random.randint(0,1),
        "fatigue": random.randint(0,1),
        "headache": random.randint(0,1),
        "breathing_difficulty": random.randint(0,1),
        "vomiting": random.randint(0,1),
        "diarrhea": random.randint(0,1),
        "rash": random.randint(0,1),
        "joint_pain": random.randint(0,1),
        "chills": random.randint(0,1),
        "email": f"user{i}@gmail.com",
        "city": random.choice(cities)
    }

    res = requests.post(url, json=data)
    print(res.json())

    time.sleep(1)