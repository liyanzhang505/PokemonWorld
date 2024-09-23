import requests

# Dictionary to store Pokemon data by name for quick lookup
pokemon_data_by_name = {}


def get_pokemon_details(pokemon_url):
    response = requests.get(pokemon_url)
    if response.status_code != 200:
        print(f"Error fetching details for {pokemon_url}")
        return None
    return response.json()


def get_pokemon_species(pokemon_species_url):
    response = requests.get(pokemon_species_url)
    if response.status_code != 200:
        print(f"Error fetching species details for {pokemon_species_url}")
        return None
    return response.json()


def get_pokemon_weaknesses(type_urls):
    weaknesses = set()
    resistances = set()

    for type_url in type_urls:
        response = requests.get(type_url)
        if response.status_code == 200:
            data = response.json()

            for weakness in data['damage_relations']['double_damage_from']:
                weaknesses.add(weakness['name'])

            for resistance in data['damage_relations']['half_damage_from']:
                resistances.add(resistance['name'])
            for immunity in data['damage_relations']['no_damage_from']:
                resistances.add(immunity['name'])

    final_weaknesses = weaknesses - resistances
    return list(final_weaknesses)


# Optimized function to retrieve evolution chain using pokemon_data_by_name
def get_evolution_chain(evolution_url):
    response = requests.get(evolution_url)
    if response.status_code != 200:
        print(f"Error fetching evolution chain from {evolution_url}")
        return None

    data = response.json()
    evolutions = []

    # Traverse the evolution chain and match names to id and image_url from pokemon_data_by_name
    def traverse_evolutions(chain):
        species_name = chain['species']['name']

        # Lookup id and image_url from the stored pokemon_data_by_name dictionary
        if species_name in pokemon_data_by_name:
            pokemon_info = pokemon_data_by_name[species_name]
            evolutions.append({
                'id': str(pokemon_info['id']).zfill(4),  # Convert ID to 4-digit string
                'name': species_name,
                'image_url': pokemon_info['image_url']
            })

        for evolves_to in chain['evolves_to']:
            traverse_evolutions(evolves_to)

    traverse_evolutions(data['chain'])
    return evolutions


def get_pokemon(offset=0, limit=2000):
    base_url = "https://pokeapi.co/api/v2/pokemon"
    all_pokemon_data = []

    response = requests.get(f"{base_url}?limit={limit}&offset={offset}")
    if response.status_code != 200:
        print("Error fetching Pokemon list")
        return None

    data = response.json()
    pokemon_list = data['results']

    # Fetch Pokemon data and store in pokemon_data_by_name for quick lookup
    for pokemon in pokemon_list:
        pokemon_details = get_pokemon_details(pokemon['url'])

        if not pokemon_details:
            continue

        pokemon_species_details = get_pokemon_species(pokemon_details['species']['url'])

        # Basic Pokemon information
        pokemon_id = pokemon_details['id']
        if pokemon_id > 10000:
            continue
        name = pokemon_details['name']
        height = pokemon_details['height'] / 10.0  # Convert to meters
        weight = pokemon_details['weight'] / 10.0  # Convert to kilograms

        # Filter abilities to exclude hidden ones
        abilities = [ability['ability']['name'] for ability in pokemon_details['abilities'] if not ability['is_hidden']]

        # Pokemon types
        types = [ptype['type']['name'] for ptype in pokemon_details['types']]

        # Get weaknesses based on type
        type_urls = [ptype['type']['url'] for ptype in pokemon_details['types']]
        weaknesses = get_pokemon_weaknesses(type_urls)

        # Pokemon stats
        stats = {}
        for stat in pokemon_details['stats']:
            stat_name = stat['stat']['name']
            stat_value = stat['base_stat']
            stats[stat_name] = stat_value

        # Fetch higher-resolution image from the official artwork sprites
        image_url = pokemon_details['sprites']['other']['official-artwork']['front_default']

        # Pokemon category and gender ratio
        if pokemon_species_details:
            category = None
            if pokemon_species_details and 'genera' in pokemon_species_details:
                for genus in pokemon_species_details['genera']:
                    if genus['language']['name'] == 'en':
                        category = genus['genus']
                        break

            # Adjusted gender handling
            gender_rate = pokemon_species_details['gender_rate']
            if gender_rate == -1:
                gender = ['genderless']  # Genderless Pokemon
            elif gender_rate == 0:
                gender = ['male']  # Male-only Pokemon
            elif gender_rate == 8:
                gender = ['female']  # Female-only Pokemon
            else:
                gender = ['male', 'female']  # Pokemon that have both genders
        else:
            category = "Unknown"
            gender = ['genderless']  # Default to genderless if data is missing

        # Store Pokemon data by name for later lookup in evolution chain
        pokemon_data_by_name[name] = {
            'id': pokemon_id,
            'name': name,
            'image_url': image_url
        }

        # Save the data for printing later
        all_pokemon_data.append({
            'id': pokemon_id,
            'name': name,
            'category': category,
            'weight': weight,
            'height': height,
            'abilities': abilities,
            'gender': gender,
            'types': types,
            'weaknesses': weaknesses,
            'stats': stats,
            'image_url': image_url
        })

        print({
            'id': pokemon_id,
            'name': name,
            'category': category,
            'weight': weight,
            'height': height,
            'abilities': abilities,
            'gender': gender,
            'types': types,
            'weaknesses': weaknesses,
            'stats': stats,
            'image_url': image_url
        })

    print('------Starting get evolution chain, please wait------')
    # All Pokemon data is fetched, update the evolution chains by looking up in pokemon_data_by_name
    for pokemon in all_pokemon_data:
        species_name = pokemon['name']
        pokemon_species_details = get_pokemon_species(f"https://pokeapi.co/api/v2/pokemon-species/{pokemon['id']}")
        if pokemon_species_details:
            evolution_chain_url = pokemon_species_details['evolution_chain']['url']
            evolutions = get_evolution_chain(evolution_chain_url)
            pokemon['evolutions'] = evolutions  # Update evolution chain with id and image_url
            print(f'name:{species_name}, evolutions:{evolutions}')
        else:
            pokemon['evolutions'] = []

    return all_pokemon_data
