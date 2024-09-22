import React, { useState } from 'react';

// Interface defining the props for the SearchBar component
interface SearchBarProps {
    onSearch: (keyword: string) => void;
    style?: React.CSSProperties; // Allows passing style properties
}

// SearchBar component for searching Pokémon by name or ID
function SearchBar({ onSearch, style }: SearchBarProps) {
    const [keyword, setKeyword] = useState('');

    // Function to handle the search operation when the search button is clicked
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
                onChange={(e) => setKeyword(e.target.value)}
                style={{ height: '56px' }} // Set the height of the search input to 56px
            />
            <div className="input-group-append">
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSearch}
                    style={{ height: '56px' }} // Set the height of the search button to 56px
                >
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
