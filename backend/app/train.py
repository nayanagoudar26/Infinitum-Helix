import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Get current directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Dataset path
data_path = os.path.join(script_dir, "..", "data", "sample_disease_data.csv")

print("📂 Loading data from:", data_path)

# Load dataset
df = pd.read_csv(data_path)

# Split features and target
X = df.drop("disease", axis=1)
y = df["disease"]

# Train model
model = RandomForestClassifier()
model.fit(X, y)

print("✅ Model trained")

# Save model using JOBLIB (IMPORTANT)
model_path = os.path.join(script_dir, "model.pkl")
joblib.dump(model, model_path)

print("💾 Model saved at:", model_path)