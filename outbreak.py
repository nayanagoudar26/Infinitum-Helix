from collections import defaultdict

disease_data = defaultdict(lambda: defaultdict(int))
THRESHOLD = 3

def update_cases(city, disease):
    disease_data[city][disease] += 1

def check_outbreak(city, disease):
    count = disease_data[city][disease]

    if count >= THRESHOLD:
        return True, count
    return False, count