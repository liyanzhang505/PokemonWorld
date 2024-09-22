import sqlite3
import json
from fetch_data import get_pokemon
from save_data import save_pokemon_data_in_db

# Function to read Pokemon data from the SQLite database
def read_pokemon_data_from_db():
    # Connect to the SQLite database
    conn = sqlite3.connect('pokemon.db')
    c = conn.cursor()

    # Query to fetch all Pokemon data
    c.execute(
        'SELECT id, name, category, weight, height, abilities, gender, types, weaknesses, stats, image_url, evolutions FROM pokemon')

    # Fetch all rows from the query
    rows = c.fetchall()

    # List to save the retrieved Pokemon data
    pokemon_data = []

    # Iterate through each row and process the data
    for row in rows:
        pokemon_id = row[0]
        name = row[1]
        category = row[2]
        weight = row[3]
        height = row[4]
        abilities = row[5].split(', ')  # Convert comma-separated string back to list
        gender = json.loads(row[6])  # Deserialize the gender JSON string back to a list
        types = row[7].split(', ')  # Convert comma-separated string back to list
        weaknesses = row[8].split(', ')  # Convert comma-separated string back to list
        stats = dict(item.split(': ') for item in row[9].split(', '))  # Convert stats back to a dictionary
        image_url = row[10]

        # Deserialize the evolution chain JSON string back to a list of dictionaries
        evolutions = json.loads(row[11])

        # Rebuild the Pokemon data dictionary
        pokemon = {
            'id': pokemon_id,
            'name': name,
            'category': category,
            'weight': weight,
            'height': height,
            'abilities': abilities,
            'gender': gender,
            'types': types,
            'weaknesses': weaknesses,
            'stats': {key: int(value) for key, value in stats.items()},  # Convert stat values back to integers
            'image_url': image_url,
            'evolutions': evolutions
        }

        # Append to the list of Pokemon data
        pokemon_data.append(pokemon)

    # Close the database connection
    conn.close()

    return pokemon_data


# Fetch the Pokemon data
pokemon_data = get_pokemon(0, 20)

# Save the Pokemon data in the SQLite database
save_pokemon_data_in_db(pokemon_data)

# Read the Pokemon data from the database
pokemon_data = read_pokemon_data_from_db()

# Print each Pokemon's data
for pokemon in pokemon_data:
    print(json.dumps(pokemon, indent=4))
