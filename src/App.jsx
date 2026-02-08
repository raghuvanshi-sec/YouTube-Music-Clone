
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PlayerBar from './components/PlayerBar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
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
              <Route path="/library" element={<div style={{padding: '20px'}}>Library Content Placeholder</div>} />
            </Routes>
          </main>
          <PlayerBar />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
