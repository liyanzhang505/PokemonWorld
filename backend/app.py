from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# Allow cross region access
CORS(app)

# Mock Data
MOCK_POKEMON_DETAILS = {'id': 1, 'name': 'bulbasaur', 'category': 'Seed Pokémon', 'weight': 6.9, 'height': 0.7, 'abilities': ['overgrow'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 45, 'attack': 49, 'defense': 49, 'special-attack': 65, 'special-defense': 65, 'speed': 45}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']}
MOCK_POKEMON_DETAILS_FOR_SEARCH = {'id': 2, 'name': 'ivysaur', 'category': 'Seed Pokémon', 'weight': 13.0, 'height': 1.0, 'abilities': ['overgrow'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 60, 'attack': 62, 'defense': 63, 'special-attack': 80, 'special-defense': 80, 'speed': 60}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']}
MOCK_POKEMON_LIST = {'page': 1, 'page_size': 20, 'total_pages': 100, 'data': [
{'id': 1, 'name': 'bulbasaur', 'category': 'Seed Pokémon', 'weight': 6.9, 'height': 0.7, 'abilities': ['overgrow'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 45, 'attack': 49, 'defense': 49, 'special-attack': 65, 'special-defense': 65, 'speed': 45}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']}
,{'id': 2, 'name': 'ivysaur', 'category': 'Seed Pokémon', 'weight': 13.0, 'height': 1.0, 'abilities': ['overgrow'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 60, 'attack': 62, 'defense': 63, 'special-attack': 80, 'special-defense': 80, 'speed': 60}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']}
,{'id': 3, 'name': 'venusaur', 'category': 'Seed Pokémon', 'weight': 100.0, 'height': 2.0, 'abilities': ['overgrow', 'chlorophyll'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 80, 'attack': 82, 'defense': 83, 'special-attack': 100, 'special-defense': 100, 'speed': 80}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']}
,{'id': 4, 'name': 'charmander', 'category': 'Lizard Pokémon', 'weight': 8.5, 'height': 0.6, 'abilities': ['blaze', 'solar-power'], 'gender': ['Male', 'Female'], 'types': ['fire'], 'weaknesses': ['rock', 'ground', 'water'], 'stats': {'hp': 39, 'attack': 52, 'defense': 43, 'special-attack': 60, 'special-defense': 50, 'speed': 65}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', 'evolutions': ['charmander', 'charmeleon', 'charizard']}
,{'id': 5, 'name': 'charmeleon', 'category': 'Flame Pokémon', 'weight': 19.0, 'height': 1.1, 'abilities': ['blaze', 'solar-power'], 'gender': ['Male', 'Female'], 'types': ['fire'], 'weaknesses': ['rock', 'ground', 'water'], 'stats': {'hp': 58, 'attack': 64, 'defense': 58, 'special-attack': 80, 'special-defense': 65, 'speed': 80}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', 'evolutions': ['charmander', 'charmeleon', 'charizard']}
,{'id': 6, 'name': 'charizard', 'category': 'Flame Pokémon', 'weight': 90.5, 'height': 1.7, 'abilities': ['blaze', 'solar-power'], 'gender': ['Male', 'Female'], 'types': ['fire', 'flying'], 'weaknesses': ['rock', 'ice', 'water', 'electric', 'ground'], 'stats': {'hp': 78, 'attack': 84, 'defense': 78, 'special-attack': 109, 'special-defense': 85, 'speed': 100}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', 'evolutions': ['charmander', 'charmeleon', 'charizard']}
,{'id': 7, 'name': 'squirtle', 'category': 'Tiny Turtle Pokémon', 'weight': 9.0, 'height': 0.5, 'abilities': ['torrent', 'rain-dish'], 'gender': ['Male', 'Female'], 'types': ['water'], 'weaknesses': ['electric', 'grass'], 'stats': {'hp': 44, 'attack': 48, 'defense': 65, 'special-attack': 50, 'special-defense': 64, 'speed': 43}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', 'evolutions': ['squirtle', 'wartortle', 'blastoise']}
,{'id': 8, 'name': 'wartortle', 'category': 'Turtle Pokémon', 'weight': 22.5, 'height': 1.0, 'abilities': ['torrent', 'rain-dish'], 'gender': ['Male', 'Female'], 'types': ['water'], 'weaknesses': ['electric', 'grass'], 'stats': {'hp': 59, 'attack': 63, 'defense': 80, 'special-attack': 65, 'special-defense': 80, 'speed': 58}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png', 'evolutions': ['squirtle', 'wartortle', 'blastoise']}
,{'id': 9, 'name': 'blastoise', 'category': 'Shellfish Pokémon', 'weight': 85.5, 'height': 1.6, 'abilities': ['torrent', 'rain-dish'], 'gender': ['Male', 'Female'], 'types': ['water'], 'weaknesses': ['electric', 'grass'], 'stats': {'hp': 79, 'attack': 83, 'defense': 100, 'special-attack': 85, 'special-defense': 105, 'speed': 78}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', 'evolutions': ['squirtle', 'wartortle', 'blastoise']}
,{'id': 10, 'name': 'caterpie', 'category': 'Worm Pokémon', 'weight': 2.9, 'height': 0.3, 'abilities': ['shield-dust', 'run-away'], 'gender': ['Male', 'Female'], 'types': ['bug'], 'weaknesses': ['flying', 'rock', 'fire'], 'stats': {'hp': 45, 'attack': 30, 'defense': 35, 'special-attack': 20, 'special-defense': 20, 'speed': 45}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png', 'evolutions': ['caterpie', 'metapod', 'butterfree']}
,{'id': 11, 'name': 'metapod', 'category': 'Cocoon Pokémon', 'weight': 9.9, 'height': 0.7, 'abilities': ['shed-skin'], 'gender': ['Male', 'Female'], 'types': ['bug'], 'weaknesses': ['flying', 'rock', 'fire'], 'stats': {'hp': 50, 'attack': 20, 'defense': 55, 'special-attack': 25, 'special-defense': 25, 'speed': 30}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png', 'evolutions': ['caterpie', 'metapod', 'butterfree']}
,{'id': 12, 'name': 'butterfree', 'category': 'Butterfly Pokémon', 'weight': 32.0, 'height': 1.1, 'abilities': ['compound-eyes', 'tinted-lens'], 'gender': ['Male', 'Female'], 'types': ['bug', 'flying'], 'weaknesses': ['rock', 'ice', 'electric', 'flying', 'fire'], 'stats': {'hp': 60, 'attack': 45, 'defense': 50, 'special-attack': 90, 'special-defense': 80, 'speed': 70}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png', 'evolutions': ['caterpie', 'metapod', 'butterfree']}
,{'id': 13, 'name': 'weedle', 'category': 'Hairy Bug Pokémon', 'weight': 3.2, 'height': 0.3, 'abilities': ['shield-dust', 'run-away'], 'gender': ['Male', 'Female'], 'types': ['bug', 'poison'], 'weaknesses': ['rock', 'psychic', 'fire', 'flying', 'ground'], 'stats': {'hp': 40, 'attack': 35, 'defense': 30, 'special-attack': 20, 'special-defense': 20, 'speed': 50}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png', 'evolutions': ['weedle', 'kakuna', 'beedrill']}
,{'id': 14, 'name': 'kakuna', 'category': 'Cocoon Pokémon', 'weight': 10.0, 'height': 0.6, 'abilities': ['shed-skin'], 'gender': ['Male', 'Female'], 'types': ['bug', 'poison'], 'weaknesses': ['rock', 'psychic', 'fire', 'flying', 'ground'], 'stats': {'hp': 45, 'attack': 25, 'defense': 50, 'special-attack': 25, 'special-defense': 25, 'speed': 35}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png', 'evolutions': ['weedle', 'kakuna', 'beedrill']}
,{'id': 15, 'name': 'beedrill', 'category': 'Poison Bee Pokémon', 'weight': 29.5, 'height': 1.0, 'abilities': ['swarm', 'sniper'], 'gender': ['Male', 'Female'], 'types': ['bug', 'poison'], 'weaknesses': ['rock', 'psychic', 'fire', 'flying', 'ground'], 'stats': {'hp': 65, 'attack': 90, 'defense': 40, 'special-attack': 45, 'special-defense': 80, 'speed': 75}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png', 'evolutions': ['weedle', 'kakuna', 'beedrill']}
,{'id': 16, 'name': 'pidgey', 'category': 'Tiny Bird Pokémon', 'weight': 1.8, 'height': 0.3, 'abilities': ['keen-eye', 'tangled-feet', 'big-pecks'], 'gender': ['Male', 'Female'], 'types': ['normal', 'flying'], 'weaknesses': ['electric', 'rock', 'fighting', 'ice'], 'stats': {'hp': 40, 'attack': 45, 'defense': 40, 'special-attack': 35, 'special-defense': 35, 'speed': 56}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png', 'evolutions': ['pidgey', 'pidgeotto', 'pidgeot']}
,{'id': 17, 'name': 'pidgeotto', 'category': 'Bird Pokémon', 'weight': 30.0, 'height': 1.1, 'abilities': ['keen-eye', 'tangled-feet', 'big-pecks'], 'gender': ['Male', 'Female'], 'types': ['normal', 'flying'], 'weaknesses': ['electric', 'rock', 'fighting', 'ice'], 'stats': {'hp': 63, 'attack': 60, 'defense': 55, 'special-attack': 50, 'special-defense': 50, 'speed': 71}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png', 'evolutions': ['pidgey', 'pidgeotto', 'pidgeot']}
,{'id': 18, 'name': 'pidgeot', 'category': 'Bird Pokémon', 'weight': 39.5, 'height': 1.5, 'abilities': ['keen-eye', 'tangled-feet', 'big-pecks'], 'gender': ['Male', 'Female'], 'types': ['normal', 'flying'], 'weaknesses': ['electric', 'rock', 'fighting', 'ice'], 'stats': {'hp': 83, 'attack': 80, 'defense': 75, 'special-attack': 70, 'special-defense': 70, 'speed': 101}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png', 'evolutions': ['pidgey', 'pidgeotto', 'pidgeot']}
,{'id': 19, 'name': 'rattata', 'category': 'Mouse Pokémon', 'weight': 3.5, 'height': 0.3, 'abilities': ['run-away', 'guts', 'hustle'], 'gender': ['Male', 'Female'], 'types': ['normal'], 'weaknesses': ['fighting'], 'stats': {'hp': 30, 'attack': 56, 'defense': 35, 'special-attack': 25, 'special-defense': 35, 'speed': 72}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', 'evolutions': ['rattata', 'raticate']}
]}
MOCK_POKEMON_LIST_FOR_ORDER = {'page': 1, 'page_size': 20, 'total_pages': 100, 'data': [
{'id': 2, 'name': 'ivysaur', 'category': 'Seed Pokémon', 'weight': 13.0, 'height': 1.0, 'abilities': ['overgrow'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 60, 'attack': 62, 'defense': 63, 'special-attack': 80, 'special-defense': 80, 'speed': 60}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']},
{'id': 1, 'name': 'bulbasaur', 'category': 'Seed Pokémon', 'weight': 6.9, 'height': 0.7, 'abilities': ['overgrow'], 'gender': ['Male', 'Female'], 'types': ['grass', 'poison'], 'weaknesses': ['poison', 'ground', 'bug', 'psychic', 'ice', 'flying', 'fire'], 'stats': {'hp': 45, 'attack': 49, 'defense': 49, 'special-attack': 65, 'special-defense': 65, 'speed': 45}, 'image_url': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 'evolutions': ['bulbasaur', 'ivysaur', 'venusaur']}
]}

# List pokemons
@app.route('/pokemon/list', methods=['GET'])
def get_pokemon_list():
    # Get page, page_size and order attributes.
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))
    order = request.args.get('order', 'id')
    direction = request.args.get('direction', 'asc')
    print(f'get /pokemon/list page: {page}, page_size:{page_size}, order:{order}, direction: {direction}')

    # Return mocked data
    if order == 'id':
        return jsonify(MOCK_POKEMON_LIST)
    else:
        return jsonify(MOCK_POKEMON_LIST_FOR_ORDER)


# Get details by pokemon id
@app.route('/pokemon/details/<int:pokemon_id>', methods=['GET'])
def get_pokemon_details(pokemon_id):
    return jsonify(MOCK_POKEMON_DETAILS)


# Search pokemon by id or name
@app.route('/pokemon/search', methods=['GET'])
def search_pokemon():
    keyword = request.args.get('keyword', '').lower()
    if not keyword:
        return jsonify({'error': 'Keyword is required'}), 400
    return jsonify(MOCK_POKEMON_DETAILS_FOR_SEARCH)


if __name__ == '__main__':
    app.run(port=8080)
