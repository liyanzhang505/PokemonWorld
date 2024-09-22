import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PokemonListResponse, Pokemon } from '../types';

// SearchBar component definition
// This component handles user input for searching Pokémon by name or ID.
function SearchBar({ onSearch, style }: { onSearch: (keyword: string) => void; style?: React.CSSProperties }) {
    const [keyword, setKeyword] = useState('');

    // Trigger the onSearch callback with the current keyword when the search button is clicked
    const handleSearch = () => {
        onSearch(keyword);
    };

    return (
        <div className="input-group" style={style}>
            <input
                type="text"
                className="form-control"
                placeholder="Search Pokemon by name or id"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} // Update the keyword state with user input
                style={{ height: '56px' }} // Set the height of the search input to 56px
            />
            <div className="input-group-append">
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSearch} // Calls handleSearch when the button is clicked
                    style={{ height: '56px' }} // Set the height of the search button to 56px
                >
                    Search
                </button>
            </div>
        </div>
    );
}

// PokemonList component
// This component displays a paginated list of Pokémon with sorting and searching functionality.
function PokemonList() {
    // States to store various dynamic data like Pokémon list, page, sort order, etc.
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);  // List of Pokémon to display
    const [loading, setLoading] = useState(true);  // Loading state for data fetching
    const [page, setPage] = useState(1);  // Current page
    const [pageSize] = useState(20);  // Number of Pokémon to display per page
    const [totalPages, setTotalPages] = useState(1);  // Total number of pages
    const [sortField, setSortField] = useState('id');  // Current sort field
    const [sortOrder, setSortOrder] = useState('asc');  // Current sort order ('asc' or 'desc')
    const [searchKeyword, setSearchKeyword] = useState('');  // Keyword used for search
    const [currentPageGroup, setCurrentPageGroup] = useState(1);  // Keeps track of current page group
    const pagesPerGroup = 10;  // Maximum of 10 pages per group for pagination controls

    // Effect hook to fetch Pokémon list whenever page, sort field, sort order, or search keyword changes
    useEffect(() => {
        fetchPokemonList();  // Call the function to fetch the Pokémon data
    }, [page, sortField, sortOrder, searchKeyword]);  // Dependency array ensures this runs when these variables change

    // Function to fetch Pokémon data from the backend API
    const fetchPokemonList = async () => {
        try {
            const response = await axios.get<PokemonListResponse>(
                `http://127.0.0.1:8080/pokemon/list?page=${page}&page_size=${pageSize}&order=${sortField}&
                direction=${sortOrder}&keyword=${searchKeyword}` // Use page, sorting, and search keyword to construct the request URL
            );
            setPokemonList(response.data.data);  // Set the fetched Pokémon list in the state
            setTotalPages(response.data.total_pages);  // Update the total number of pages
            setLoading(false);  // Set loading to false after data is fetched
        } catch (error) {
            console.error('Error fetching Pokemon list:', error);  // Log errors if the request fails
        }
    };

    // Function to handle page changes, sets the new page and triggers data loading
    const handlePageChange = (newPage: number) => {
        setPage(newPage);  // Update the current page
        setLoading(true);  // Set loading to true while fetching new data
    };

    // Handle search input and reset to the first page after a new search is made
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);  // Update the search keyword
        setPage(1);  // Reset to the first page after search
    };

    // Calculate the pagination range for the current group of pages
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;  // Calculate the starting page in the current group
    const endPage = Math.min(currentPageGroup * pagesPerGroup, totalPages);  // Calculate the ending page in the group, ensuring it does not exceed the total pages

    return (
        <div>
            <h1 className="mb-4">Pokemon List</h1>

            {/* Sort options and search bar in the same row */}
            <div className="d-flex justify-content-between align-items-end my-3">
                <div className="d-flex">
                    {/* Sort by dropdown */}
                    <FormControl variant="outlined" className="mr-3" style={{ minWidth: 150, height: '56px' }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as string)}  // Update the sorting field
                            label="Sort By"
                            style={{ height: '56px' }}  // Set dropdown height
                        >
                            {/* Dropdown options for sorting by ID, Name, or Weight */}
                            <MenuItem value="id">ID</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="weight">Weight</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Sort order dropdown */}
                    <FormControl variant="outlined" className="mr-3" style={{ minWidth: 150, height: '56px' }}>
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as string)}  // Update the sort order
                            label="Order"
                            style={{ height: '56px' }}  // Set dropdown height
                        >
                            {/* Dropdown options for ascending or descending order */}
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Search bar */}
                <div className="flex-grow-1 ml-3">
                    <SearchBar onSearch={handleSearch} style={{ height: '56px' }} />  {/* Search input with 56px height */}
                </div>
            </div>

            {/* Pokémon list */}
            {loading ? <p>Loading...</p> : (  // Show loading message if still fetching data
                <div className="row">
                    {pokemonList.map(pokemon => (
                        <div key={pokemon.id} className="col-md-3 mb-4">
                            <div className="card">
                                {/* Display Pokémon image */}
                                <img src={pokemon.image_url} className="card-img-top" alt={pokemon.name} />
                                <div className="card-body text-center">
                                    {/* Display Pokémon ID, ensuring it is padded to 4 digits */}
                                    <h6 className="card-subtitle mb-2 text-muted">#{pokemon.id.toString().padStart(4, '0')}</h6>
                                    {/* Display Pokémon name */}
                                    <h5 className="card-title">{pokemon.name}</h5>
                                    {/* Link to the details page for the selected Pokémon */}
                                    <Link to={`/pokemon/${pokemon.id}`} className="btn btn-primary">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    {/* Show the '<<' button for previous page groups */}
                    {currentPageGroup > 1 && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPageGroup(currentPageGroup - 1)}>{'<<'}</button>
                        </li>
                    )}

                    {/* Show page numbers within the current group */}
                    {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
                        <li key={startPage + idx} className={`page-item ${page === startPage + idx ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(startPage + idx)}>
                                {startPage + idx}
                            </button>
                        </li>
                    ))}

                    {/* Show the '>>' button for next page groups */}
                    {endPage < totalPages && (
                        <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPageGroup(currentPageGroup + 1)}>{'>>'}</button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default PokemonList;
