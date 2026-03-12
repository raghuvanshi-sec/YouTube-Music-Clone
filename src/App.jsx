
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PlayerBar from './components/PlayerBar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Library from './pages/Library';
import Explore from './pages/Explore';
import NowPlaying from './pages/NowPlaying';
import { PlayerProvider } from './context/PlayerContext';
import './App.css';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <TopBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/library" element={<Library />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/now-playing" element={<NowPlaying />} />
            </Routes>
          </main>
          <PlayerBar />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
