import sqlite3

def save_ewaste_submission(name, description, image_url):
    try:
        conn = sqlite3.connect('ewaste.db')  # Connect to SQLite database
        cursor = conn.cursor()

        # Create the ewaste table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ewaste (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT
            )
        ''')

        # Insert the e-waste data into the table
        cursor.execute('''
            INSERT INTO ewaste (name, description, image_url)
            VALUES (?, ?, ?)
        ''', (name, description, image_url))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Error saving e-waste data:", e)
        return False
