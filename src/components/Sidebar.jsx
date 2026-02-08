import React from 'react';
import { NavLink } from 'react-router-dom';
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
import { MdOutlineLibraryMusic, MdLibraryMusic } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo-container">
                <div className="logo-icon">
                    <img src="https://music.youtube.com/img/on_platform_logo_dark.svg" alt="YouTube Music Logo" style={{height: '24px'}} />
                </div>
            </div>
            
            <nav className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    {({ isActive }) => (
                        <>
                            <span className="icon">{isActive ? <GoHomeFill size={26} /> : <GoHome size={26} />}</span>
                            <span className="text">Home</span>
                        </>
                    )}
                </NavLink>
                
                <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    {({ isActive }) => (
                        <>
                            <span className="icon">{isActive ? <MdExplore size={26} /> : <MdOutlineExplore size={26} />}</span>
                            <span className="text">Explore</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/library" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    {({ isActive }) => (
                        <>
                            <span className="icon">{isActive ? <MdLibraryMusic size={26} /> : <MdOutlineLibraryMusic size={26} />}</span>
                            <span className="text">Library</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/search" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span className="icon"><IoSearch size={26} /></span>
                    <span className="text">Search</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
