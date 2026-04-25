import sqlite3

# Create connection
conn = sqlite3.connect("disease_data.db", check_same_thread=False)
cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    disease TEXT,
    alert TEXT,
    temperature REAL,
    humidity REAL,
    rainfall REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()