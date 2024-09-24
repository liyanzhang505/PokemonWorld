import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PokemonListResponse, Pokemon } from '../types';
import './PokemonList.css';

// Read configuration from .env
const backendHost = process.env.REACT_APP_BACKEND_SERVER_IP;
const backendPort = process.env.REACT_APP_BACKEND_SERVER_PORT;

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// SearchBar component definition
function SearchBar({ onSearch, style }: { onSearch: (keyword: string) => void; style?: React.CSSProperties }) {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        onSearch(keyword);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="input-group" style={style}>
            <input
                type="text"
                className="form-control"
                placeholder="Search Pokemon by name or id"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ height: '56px' }}
            />
            <div className="input-group-append">
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
    const [page, setPage] = useState(1); // Default to page 1
    const [pageSize] = useState(16);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPageGroup, setCurrentPageGroup] = useState(1);
    const pagesPerGroup = 10;
    const navigate = useNavigate();

    // Fetch Pokemon list with updated parameters
    const fetchPokemonList = useCallback(async () => {
        setLoading(true);  // Ensure loading state is set when fetching data
        try {
            const response = await axios.get<PokemonListResponse>(
                `http://${backendHost}:${backendPort}/pokemon/list?page=${page}&page_size=${pageSize}&order=${sortField}&direction=${sortOrder}&keyword=${searchKeyword}`
            );
            setPokemonList(response.data.data);
            setTotalPages(response.data.total_pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Pokemon list:', error);
            setLoading(false);  // Stop loading on error
        }
    }, [page, pageSize, sortField, sortOrder, searchKeyword]);

    // Trigger fetch when page, searchKeyword, sortField, or sortOrder changes
    useEffect(() => {
        fetchPokemonList();
    }, [page, searchKeyword, sortField, sortOrder, fetchPokemonList]);

    // Handle page change for pagination
    const handlePageChange = (newPage: number) => {
        setPage(newPage); // Update the current page
    };

    // Handle search input from SearchBar component
    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword); // Update search keyword
        setPage(1); // Reset to first page after search
        setCurrentPageGroup(1); // Reset page group to the first group
    };

    // Handle sorting change
    const handleSortChange = (newSortField: string) => {
        setSortField(newSortField);
        setPage(1); // Reset to first page when changing sort
        setCurrentPageGroup(1); // Reset page group
    };

    // Handle sort order change
    const handleOrderChange = (newSortOrder: string) => {
        setSortOrder(newSortOrder);
        setPage(1); // Reset to first page when changing sort order
        setCurrentPageGroup(1); // Reset page group
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

                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
                    <li key={startPage + idx} className={`page-item ${page === startPage + idx ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(startPage + idx)}>
                            {startPage + idx}
                        </button>
                    </li>
                ))}

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

            <div className="d-flex justify-content-between align-items-end my-3">
                <div className="d-flex">
                    <FormControl variant="outlined" className="mr-3" style={{ minWidth: 150, height: '56px' }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortField}
                            onChange={(e) => handleSortChange(e.target.value as string)}
                            label="Sort By"
                            style={{ height: '56px' }}
                        >
                            <MenuItem value="id">ID</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="weight">Weight</MenuItem>
                            <MenuItem value="height">Height</MenuItem> {/* Added Height */}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className="mr-3" style={{ minWidth: 150, height: '56px' }}>
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={(e) => handleOrderChange(e.target.value as string)}
                            label="Order"
                            style={{ height: '56px' }}
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="flex-grow-1 ml-3">
                    <SearchBar onSearch={handleSearch} style={{ height: '56px' }} />
                </div>
            </div>

            <PaginationControls />

            {loading ? <p>Loading...</p> : (
                <div className="row">
                    {pokemonList.map(pokemon => (
                        <div
                            key={pokemon.id}
                            className="col-md-3 mb-4"
                            onClick={() => handleCardClick(pokemon.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card pokemon-card">
                                <img
                                    src={pokemon.image_url}
                                    className="card-img-top pokemon-image"
                                    alt={pokemon.name}
                                />
                                <div className="card-body text-center">
                                    <h6 className="card-subtitle mb-2 text-muted">#{pokemon.id.toString().padStart(4, '0')}</h6>
                                    <h5 className="card-title">{capitalizeFirstLetter(pokemon.name)}</h5> {/* Capitalize Name */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PaginationControls />
        </div>
    );
}

export default PokemonList;
