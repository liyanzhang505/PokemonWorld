import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PokemonListResponse, Pokemon } from '../types';
import './PokemonList.css';

// SearchBar component definition
function SearchBar({ onSearch, style }: { onSearch: (keyword: string) => void; style?: React.CSSProperties }) {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        onSearch(keyword);
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="input-group" style={style}>
            {/* Search input field */}
            <input
                type="text"
                className="form-control"
                placeholder="Search Pokemon by name or id"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown} // Listen for Enter key
                style={{ height: '56px' }}
            />
            <div className="input-group-append">
                {/* Search button */}
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSearch}
                    style={{ height: '56px' }}
                >
                    Search
                </button>
            </div>
        </div>
    );
}

// PokemonList component
function PokemonList() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPageGroup, setCurrentPageGroup] = useState(1);
    const pagesPerGroup = 10;
    const navigate = useNavigate(); // Use useNavigate to navigate on card click

    // Fetch Pokemon list with updated parameters
    const fetchPokemonList = useCallback(async () => {
        try {
            const response = await axios.get<PokemonListResponse>(
                `http://127.0.0.1:8080/pokemon/list?page=${page}&page_size=${pageSize}&order=${sortField}&direction=${sortOrder}&keyword=${searchKeyword}`
            );
            setPokemonList(response.data.data);
            setTotalPages(response.data.total_pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Pokemon list:', error);
        }
    }, [page, pageSize, sortField, sortOrder, searchKeyword]);

    // UseEffect to trigger fetch on page load or parameter change
    useEffect(() => {
        fetchPokemonList();
    }, [fetchPokemonList]);

    // Handle page change for pagination
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setLoading(true);
    };

    // Handle search input from SearchBar component
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setPage(1); // Reset to first page after search
        setCurrentPageGroup(1); // Also reset page group to the first group
    };

    // Handle card click to navigate to the details page
    const handleCardClick = (id: number) => {
        navigate(`/pokemon/${id}`);
    };

    // Calculate start and end page for pagination
    const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(currentPageGroup * pagesPerGroup, totalPages);

    // Pagination component to avoid repeating the code
    const PaginationControls = () => (
        <nav>
            <ul className="pagination justify-content-center">
                {/* Show the '<<' button for previous page groups without the button border */}
                {currentPageGroup > 1 && (
                    <li className="page-item">
                        <button
                            className="page-link arrow-only"
                            onClick={() => setCurrentPageGroup(currentPageGroup - 1)}
                        >
                            «
                        </button>
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

                {/* Show the '>>' button for next page groups without the button border */}
                {endPage < totalPages && (
                    <li className="page-item">
                        <button
                            className="page-link arrow-only"
                            onClick={() => setCurrentPageGroup(currentPageGroup + 1)}
                        >
                            »
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );

    return (
        <div>
            <h1 className="mb-4">Pokédex</h1>

            {/* Sort options and search bar in the same row */}
            <div className="d-flex justify-content-between align-items-end my-3">
                <div className="d-flex">
                    {/* Sort by field dropdown */}
                    <FormControl variant="outlined" className="mr-3" style={{ minWidth: 150, height: '56px' }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as string)}
                            label="Sort By"
                            style={{ height: '56px' }}
                        >
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
                            onChange={(e) => setSortOrder(e.target.value as string)}
                            label="Order"
                            style={{ height: '56px' }}
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Search bar */}
                <div className="flex-grow-1 ml-3">
                    <SearchBar onSearch={handleSearch} style={{ height: '56px' }} />
                </div>
            </div>

            {/* Pagination controls at the top */}
            <PaginationControls />

            {/* Pokémon list */}
            {loading ? <p>Loading...</p> : (
                <div className="row">
                    {pokemonList.map(pokemon => (
                        <div
                            key={pokemon.id}
                            className="col-md-3 mb-4"
                            onClick={() => handleCardClick(pokemon.id)} // Handle card click
                            style={{ cursor: 'pointer' }} // Hand pointer on hover
                        >
                            <div className="card pokemon-card">
                                {/* Pokemon image */}
                                <img
                                    src={pokemon.image_url}
                                    className="card-img-top pokemon-image"
                                    alt={pokemon.name}
                                />
                                <div className="card-body text-center">
                                    <h6 className="card-subtitle mb-2 text-muted">#{pokemon.id.toString().padStart(4, '0')}</h6>
                                    <h5 className="card-title">{pokemon.name}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination controls at the bottom */}
            <PaginationControls />
        </div>
    );
}

export default PokemonList;
