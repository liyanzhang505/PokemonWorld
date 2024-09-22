from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import sys
import os
import json

app = Flask(__name__)
CORS(app)  # Allow cross-origin access

DB_PATH = 'pokemon.db'

# Connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This allows us to get results as dictionaries
    return conn

# Query the database and convert to a list of dicts
# @one: return one row or multiple rows.
def query_db(query, args=(), one=False):
    conn = get_db_connection()
    cur = conn.execute(query, args)
    rv = cur.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# Check if the database exists and contains any data
def check_db_for_data():
    # Check if the database file exists
    if not os.path.exists(DB_PATH):
        print(f"The database file '{DB_PATH}' does not exist. Please run the `data_prepare.py` script to create and populate the database.")
        sys.exit(1)  # Exit the program if the database doesn't exist

    # Check if the database contains Pokemon data
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM pokemon")
    count = cursor.fetchone()[0]
    conn.close()

    # If the count is 0, the database is empty
    if count == 0:
        print("The database is empty. Please run the `data_prepare.py` script to populate the database.")
        sys.exit(1)  # Exit the program with a status code of 1 if no data is found

# List pokemons (with optional keyword search)
@app.route('/pokemon/list', methods=['GET'])
def get_pokemon_list():
    # Get page, page_size, order, direction, and keyword attributes from the request
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))
    order = request.args.get('order', 'id')
    direction = request.args.get('direction', 'asc')
    keyword = request.args.get('keyword', '')

    offset = (page - 1) * page_size

    # Base query
    query = f"SELECT id, name, image_url FROM pokemon ORDER BY {order} {direction} LIMIT ? OFFSET ?"
    args = (page_size, offset)

    # If keyword is provided, search by id or name
    if keyword:
        query = f"SELECT id, name, image_url FROM pokemon WHERE id LIKE ? OR name LIKE ? ORDER BY {order} {direction} LIMIT ? OFFSET ?"
        args = (f'%{keyword}%', f'%{keyword}%', page_size, offset)

    # Query the database
    pokemon_list = query_db(query, args)

    # Fetch total number of Pokemon for pagination
    total_count_query = "SELECT COUNT(*) FROM pokemon"
    if keyword:
        total_count_query = "SELECT COUNT(*) FROM pokemon WHERE id LIKE ? OR name LIKE ?"
        total_count_args = (f'%{keyword}%', f'%{keyword}%')
        total_count = query_db(total_count_query, total_count_args, one=True)['COUNT(*)']
    else:
        total_count = query_db(total_count_query, one=True)['COUNT(*)']

    # Calculate total pages
    total_pages = (total_count + page_size - 1) // page_size  # Ceiling division

    # Convert results into a list of dictionaries
    pokemon_list = [dict(row) for row in pokemon_list]

    # Return the paginated Pokemon list along with metadata
    return jsonify({
        'page': page,
        'page_size': page_size,
        'total_pages': total_pages,
        'data': pokemon_list
    })

# Get Pokemon details by id (4-digit string ID)
@app.route('/pokemon/details/<string:pokemon_id>', methods=['GET'])
def get_pokemon_details(pokemon_id):
    # Ensure the id is a 4-digit string with leading zeros
    pokemon_id = pokemon_id.zfill(4)

    # Query to get the Pokemon details from the database
    pokemon = query_db("SELECT * FROM pokemon WHERE id = ?", (pokemon_id,), one=True)

    if not pokemon:
        return jsonify({'error': 'Pokemon not found'}), 404

    # Convert the database row into a dictionary and parse JSON fields
    pokemon = dict(pokemon)
    pokemon['abilities'] = pokemon['abilities'].split(', ')
    pokemon['types'] = pokemon['types'].split(', ')
    pokemon['weaknesses'] = pokemon['weaknesses'].split(', ')
    pokemon['stats'] = {stat.split(': ')[0]: int(stat.split(': ')[1]) for stat in pokemon['stats'].split(', ')}
    pokemon['gender'] = json.loads(pokemon['gender'])  # Convert the gender field from JSON
    pokemon['evolutions'] = json.loads(pokemon['evolutions'])  # Convert the evolutions field from JSON

    return jsonify(pokemon)

if __name__ == '__main__':
    # Check if the database exists and has data before starting the server
    check_db_for_data()

    # Start the Flask application
    app.run(port=8080)
