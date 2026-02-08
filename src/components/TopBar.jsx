import SearchBar from './SearchBar';
import './TopBar.css';

const TopBar = () => {
    return (
        <div className="top-bar">
            <div className="search-section">
                <SearchBar />
            </div>
            <div className="profile-section">
                {/* Profile placeholder */}
                <div className="profile-icon">A</div>
            </div>
        </div>
    );
};

export default TopBar;
