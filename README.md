# Pokémon World
If you want to quickly experience the project, please visit my website: [http://13.239.117.149:3001](http://13.239.117.149:3001).

This project is a web-based Pokémon encyclopedia designed to showcase detailed information about various Pokémon. The website allows users to browse a paginated list of Pokémon, view detailed stats, evolutions, and much more. The project is built with a Flask-based backend that provides an API for the React frontend, with SQLite being used to store and serve data retrieved and cleaned from an open-source Pokémon API.
![Pokémon Screenshot](./readme_show.png)

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Tutorial](#setup-tutorial)
- [Developer Information](#developer-information)

## Tech Stack

The project is built using the following technologies:

### Backend:
- **Flask**: Flask is used to develop a RESTful API that serves Pokémon data to the frontend. The API allows for listing, searching, sorting, filtering, and retrieving detailed Pokémon information.
- **SQLite**: SQLite is used as the database to store Pokémon data that is fetched and cleaned from an open-source Pokémon API. This lightweight database provides fast and efficient data storage and retrieval.

### Frontend:
- **React**: React is used to build a dynamic and responsive frontend. It interacts with the Flask backend to display Pokémon data.
- **Material-UI (MUI)**: Material-UI is used for building modern, customizable UI components for a better user experience.


## Features

### List Page:
- **Pagination**: The list page supports paginated viewing of Pokémon, with 20 Pokémon displayed per page.
- **Searching**: Users can search Pokémon by ID or name.
- **Sorting**: Users can sort the Pokémon list by:
    - **ID**: Sort by Pokémon ID.
    - **Name**: Sort alphabetically by Pokémon name.
    - **Weight**: Sort by Pokémon weight.
    - **Height**: Sort by Pokémon height.
    - **Sorting Order**: Supports both ascending and descending order sorting for each attribute.

### Detail Page:
- **Navigate Between Pokémon**: Users can use left and right arrows to navigate between Pokémon without returning to the list page.
- **Evolution Chain**: The detail page shows a Pokémon's evolution chain, with clickable images that allow users to navigate to each evolution stage.
- **Details**: The page displays the following Pokémon details:
    - **Category**: Pokémon's category (e.g., "Seed Pokémon").
    - **Type**: The Pokémon's type (e.g., Grass, Fire).
    - **Weaknesses**: A list of types the Pokémon is weak against.
    - **Stats**: Displays key stats such as HP, attack, defense, special attack, special defense, and speed.

## Setup Tutorial

### Backend Setup:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/liyanzhang505/PokemonWorld.git

2. **Install Python and Required Dependencies**:
   Ensure you have Python 3 installed. You'll also need to install the required Python packages: Flask, Flask-CORS, and SQLite3.

   To install these dependencies, run the following commands:

   ```bash
   pip install flask flask-cors sqlite3

3. **Data Preparation**:
   The Pokémon data is fetched from an open-source API and cleaned before being stored in `pokemon.db`. Follow these steps to process the data:

    - Navigate to the backend directory:

      ```bash
      cd PokemonWorld/backend
      ```

    - Run the following command to fetch and prepare the data:

      ```bash
      python data_prepare.py
      ```

    - This will download and clean the data, then write it into `pokemon.db`. Please be patient as this process may take some time.

4. **Run the Web Service**:
   Once the data is prepared, you can start the Flask web service by running the following command:

   ```bash
   python app.py
   ```

5. **Test the Web Service**:
   To verify that the web service is running correctly, open a browser and navigate to the following API endpoint:
   ```bash
   http://localhost:8080/pokemon/list
   ```
    - If the service is working correctly, you should see a JSON response listing the Pokémon.

### Frontend Setup (React):

1. **Install Dependencies**:
    - Navigate to the `frontend` directory:
      ```bash
      cd backend
      ```
    - Install required dependencies using npm
      ```bash
      npm install
      ```
2. **Start the Web Service**:
   Once the dependencies are installed, start the React development server by running:
   ```bash
   npm start
   ```

3. **Test the Website**:
   Open a browser and navigate to the following URL to verify that the website is running:
   ```bash
   http://localhost:3001
   ```
## Developer Information
- **Name**: [Callum Li]
- **Email**: [callumli987@gmail.com]


   

