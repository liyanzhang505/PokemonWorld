import sqlite3
import requests
import json  # Import the json module to handle JSON serialization and deserialization

# Create a connection to the SQLite database
conn = sqlite3.connect('pokemon.db')
c = conn.cursor()

# Create a table to store Pokemon data with evolution chain as a JSON string
c.execute('''
CREATE TABLE IF NOT EXISTS pokemon (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    weight REAL,
    height REAL,
    abilities TEXT,
    gender TEXT, 
    types TEXT,
    weaknesses TEXT,
    stats TEXT,
    image_url TEXT,
    evolutions TEXT
)
''')

def save_pokemon_data_in_db(pokemon_data):
    for pokemon in pokemon_data:
        # Convert id to a 4-digit string with leading zeros
        pokemon_id_str = str(pokemon['id']).zfill(4)

        # Convert lists (abilities, types, weaknesses) to comma-separated strings
        abilities = ', '.join(pokemon['abilities'])
        types = ', '.join(pokemon['types'])
        weaknesses = ', '.join(pokemon['weaknesses'])

        # Convert stats dictionary to a string
        stats = ', '.join([f"{key}: {value}" for key, value in pokemon['stats'].items()])

        # Convert the entire evolution chain to a JSON string
        evolutions_json = json.dumps(pokemon['evolutions'])

        # Convert gender list to JSON string
        gender_json = json.dumps(pokemon['gender'])

        # Insert data into the SQLite database
        c.execute('''
        INSERT OR REPLACE INTO pokemon (id, name, category, weight, height, abilities, gender, types, weaknesses, stats, image_url, evolutions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            pokemon_id_str,
            pokemon['name'],
            pokemon.get('category', 'Unknown'),
            pokemon['weight'],
            pokemon['height'],
            abilities,
            gender_json,  # Store gender as a JSON string
            types,
            weaknesses,
            stats,
            pokemon['image_url'],
            evolutions_json  # Store evolution chain as a JSON string
        ))

    # Commit the transaction
    conn.commit()

