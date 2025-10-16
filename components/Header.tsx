import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MOHLogo } from './icons/MOHLogo';
import { useTheme } from '../context/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-brand-secondary/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <MOHLogo className="h-10 w-10 text-brand-accent" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">MOH</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <NavLink to="/" className={({ isActive }) => `hover:text-brand-accent transition-colors ${isActive ? 'text-brand-accent' : 'text-gray-600 dark:text-slate-300'}`}>Home</NavLink>
          <NavLink to="/advance-bot" className={({ isActive }) => `hover:text-brand-accent transition-colors ${isActive ? 'text-brand-accent' : 'text-gray-600 dark:text-slate-300'}`}>Advance Bot</NavLink>
          <NavLink to="/traditional-bot" className={({ isActive }) => `hover:text-brand-accent transition-colors ${isActive ? 'text-brand-accent' : 'text-gray-600 dark:text-slate-300'}`}>Traditional Bot</NavLink>
          <Link to="/login" className="bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-sky-400 transition-colors">
            Admin Login
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;