import pandas as pd
import numpy as np
import pickle

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

print("🔥 TRAINING STARTED")

# load dataset
df = pd.read_csv("data/disease.csv")

X = df.drop("prognosis", axis=1)
y = df["prognosis"]

# add weather columns
X["temp"] = np.random.randint(25, 35, size=len(X))
X["humidity"] = np.random.randint(50, 90, size=len(X))

# split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# force numeric
X_train = X_train.astype(np.float32)
X_test = X_test.astype(np.float32)

# train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# save
pickle.dump(model, open("models/disease_model.pkl", "wb"))
pickle.dump(X.columns.tolist(), open("models/features.pkl", "wb"))

print("✅ Model trained successfully")
print("🔥 TRAINING FINISHED")