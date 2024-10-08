from pre_data_process.fetch_data import get_pokemon
from pre_data_process.save_data import save_pokemon_data_in_db
from config import DB_PATH

# Fetch the Pokemon data
pokemon_data = get_pokemon(0, 1100)

print('Saving data...')

# Save the fetched Pokemon data in the database
save_pokemon_data_in_db(pokemon_data, DB_PATH)

print('Save data successfully!')
