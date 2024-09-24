# Backend for Pokémon Encyclopedia

This backend serves as the API for the Pokémon Encyclopedia project. The backend exposes two primary API endpoints for retrieving Pokémon data.

## Tech Stack

- **Flask**: Python microframework for building web APIs.
- **SQLite**: Lightweight database for storing and retrieving Pokémon data.

## Configuration

The backend configuration allows for setting up environment variables such as:

- **`DB_PATH`**: Path to the SQLite database containing the Pokémon data.
- **`HOST`**: The host address where the Flask server will run. And the default host is localhost, if deploy web application on a cloud server, it should bind to 0.0.0.0.
- **`PORT`**: The port on which the Flask server will listen, and the default port is 8080.

These can be configured in the `config.py` file.

## How to Setup

- Ensure you have have Python 3.7+ installed on your system
- Install the Required Dependencies:
   ```bash
   pip install flask flask-cors
- Do Data Preparation:
    - The Pokémon data is fetched from an open-source API and cleaned before being stored in `pokemon.db`. Follow these steps to process the data:
  
    - Run the following command to fetch and prepare the data:

      ```bash
      python data_prepare.py
      ```

    - This will download and clean the data, then write it into `pokemon.db`. Please be patient as this process may take some time.

  - Run the Web Service:
     - Once the data is prepared, you can start the Flask web service by running the following command:
     ```bash
     python app.py
     ```

## Available API Endpoints

### 1. `/pokemon/list`

This API provides a paginated list of Pokémon along with optional sorting and search capabilities.

#### **Endpoint**: 
- GET /pokemon/list?page={page}&page_size={page_size}&order={field}&direction={asc|desc}&keyword={keyword}

#### **Parameters**:

- `page`: The current page of results (default is 1).
- `page_size`: Number of Pokémon to return per page (default is 20).
- `order`: Field to sort by (e.g., `id`, `name`, `weight`, `height`).
- `direction`: Sorting direction (`asc` for ascending, `desc` for descending).
- `keyword`: (Optional) Search keyword to filter Pokémon by name or ID.

#### **Example Request**:
- GET /pokemon/list?page=2&page_size=10&order=name&direction=asc&keyword=char

#### **Response**:
The response contains the requested list of Pokémon with the following fields:
- `id`: The Pokémon's ID.
- `name`: The Pokémon's name.
- `image_url`: URL to the Pokémon's image.

```json
{
  "data": [
    {
      "id": 1,
      "name": "Bulbasaur",
      "image_url": "https://example.com/bulbasaur.png"
    },
    ...
  ],
  "page": 2,
  "page_size": 10,
  "total_pages": 50
}
```

### 2. `/pokemon/details/{id}`
This API returns detailed information about a specific Pokémon based on its ID.
#### **Endpoint**: 
```
GET /pokemon/details/{id}
```

#### **Parameters**:
- `id`: The unique id of the Pokemon.

#### **Example Request**:
- GET /pokemon/1

#### **Response**:
The response contains detailed information about the specified Pokémon, including stats, abilities, types, weaknesses, and evolution chain.

```json
{
    "abilities": [
        "overgrow"
    ],
    "category": "Seed Pok\u00e9mon",
    "evolutions": [
        {
            "id": "0001",
            "image_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            "name": "bulbasaur"
        },
        {
            "id": "0002",
            "image_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            "name": "ivysaur"
        },
        {
            "id": "0003",
            "image_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
            "name": "venusaur"
        }
    ],
    "gender": [
        "male",
        "female"
    ],
    "height": 0.7,
    "id": "0001",
    "image_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    "name": "bulbasaur",
    "stats": {
        "attack": 49,
        "defense": 49,
        "hp": 45,
        "special-attack": 65,
        "special-defense": 65,
        "speed": 45
    },
    "types": [
        "grass",
        "poison"
    ],
    "weaknesses": [
        "ice",
        "flying",
        "psychic",
        "fire"
    ],
    "weight": 6.9
}
```





