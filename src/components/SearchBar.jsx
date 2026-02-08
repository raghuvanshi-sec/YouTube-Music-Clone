import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form className="search-bar-container" onSubmit={handleSubmit}>
            <IoSearch className="search-icon" size={24} />
            <input 
                type="text" 
                className="search-input" 
                placeholder="Search songs, albums, artists" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    );
};

export default SearchBar;
