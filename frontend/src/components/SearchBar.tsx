import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (keyword: string) => void;
    style?: React.CSSProperties; // Allows passing style properties
}

function SearchBar({ onSearch, style }: SearchBarProps) {
    const [keyword, setKeyword] = useState('');

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
