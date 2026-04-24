import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import random
import numpy as np

print("🔥 TRAINING STARTED")

# Load dataset
df = pd.read_csv("data/disease.csv")

# Rename column safely
df = df.rename(columns={"prognosis": "disease"})

# Target
y = df["disease"]

# Features
X = df.drop("disease", axis=1)

# 🔥 CLEAN FEATURES
X = X.apply(pd.to_numeric, errors='coerce')  # convert to numeric
X = X.replace([np.inf, -np.inf], 0)          # remove inf
X = X.fillna(0)                              # remove NaN

# Add weather columns
X["temp"] = [random.randint(25, 35) for _ in range(len(X))]
X["humidity"] = [random.randint(50, 90) for _ in range(len(X))]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Clean X
X_train = np.nan_to_num(X_train)
X_test = np.nan_to_num(X_test)

# 🔥 FORCE NUMERIC
X_train = np.array(X_train, dtype=np.float32)
X_test = np.array(X_test, dtype=np.float32)

# 🔥 CLEAN TARGET
y_train = y_train.astype(str)
y_test = y_test.astype(str)

# Debug
print("NaN in X:", np.isnan(X_train).sum())

# Model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
# 🔥 FORCE PURE NUMERIC ARRAY (FINAL FIX)
X_train = np.array(X_train, dtype=np.float32)
X_test = np.array(X_test, dtype=np.float32)
model.fit(X_train, y_train)

# Save model
pickle.dump(model, open("models/disease_model.pkl", "wb"))

# Save feature order
pickle.dump(list(X.columns), open("models/features.pkl", "wb"))

print("✅ Model trained successfully")
print("🔥 TRAINING FINISHED")