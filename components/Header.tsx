import React from 'react';
import { CoinIcon, StaminaIcon, LogoutIcon, HomeIcon, ProfileIcon, TasksIcon, ActivityIcon, ShopIcon, LeaderboardIcon } from './icons';
import ProgressBar from './ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import { useGameState }from '../contexts/GameStateContext';
import { APP_NAME } from '../constants';
import { Page } from '../types';
import { playSound } from '../services/audioService';

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}


const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
    const { logout } = useAuth();
    const { gameState } = useGameState(); 

    if (!gameState) return null;

    const { user } = gameState;

    const handleNavClick = (page: Page) => {
        playSound('navigate');
        setActivePage(page);
    }
    
    const handleLogout = () => {
        playSound('navigate');
        logout();
    }
    
    const navLinks = [
        { icon: <HomeIcon className="w-5 h-5"/>, label: "Home", page: "home" as Page },
        { icon: <ProfileIcon className="w-5 h-5"/>, label: "Profile", page: "profile" as Page },
        { icon: <TasksIcon className="w-5 h-5"/>, label: "Tasks", page: "tasks" as Page },
        { icon: <ActivityIcon className="w-5 h-5"/>, label: "Heist", page: "activity" as Page },
        { icon: <ShopIcon className="w-5 h-5"/>, label: "Arsenal", page: "shop" as Page },
        { icon: <LeaderboardIcon className="w-5 h-5"/>, label: "Ranks", page: "leaderboard" as Page },
    ];


    return (
        <header className="glassmorphism p-4 rounded-b-lg mb-8 border-b border-t-0 border-x-0 border-cyan-500/30 sticky top-0 z-40">
            {/* Desktop Header */}
            <div className="container mx-auto hidden md:flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <h1 onClick={() => handleNavClick('home')} className="text-2xl font-orbitron font-bold text-cyan-400 cursor-pointer">{APP_NAME}</h1>
                    <nav className="flex items-center space-x-1">
                        {navLinks.map(link => (
                            <button
                                key={link.page}
                                onClick={() => handleNavClick(link.page)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm font-bold ${activePage === link.page ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300 hover:bg-cyan-500/10 hover:text-white'}`}
                                aria-current={activePage === link.page ? 'page' : undefined}
                            >
                                {link.icon}
                                <span className="hidden lg:inline">{link.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="flex items-center space-x-2">
                        <CoinIcon className="w-6 h-6 text-yellow-400" />
                        <span className="font-mono text-white">{user.creds.toLocaleString()}</span>
                    </div>
                     <div className="flex items-center space-x-2">
                        <StaminaIcon className="w-6 h-6 text-green-400" />
                        <span className="font-mono text-white">{user.stamina}/{user.maxStamina}</span>
                    </div>
                    <div className="w-32 hidden lg:block">
                         <ProgressBar 
                            value={user.xp}
                            max={user.xpToNextLevel}
                            label={`Lvl ${user.level}`}
                            colorClass="bg-purple-500"
                        />
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:bg-cyan-500/20 rounded-full transition-colors" aria-label="Logout">
                        <LogoutIcon className="w-6 h-6 text-red-500" />
                    </button>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="container mx-auto md:hidden">
                <div className="flex justify-between items-center">
                    <h1 onClick={() => handleNavClick('home')} className="text-xl font-orbitron font-bold text-cyan-400 cursor-pointer">{APP_NAME}</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <CoinIcon className="w-5 h-5 text-yellow-400" />
                            <span className="font-mono text-white text-sm">{user.creds.toLocaleString()}</span>
                        </div>
                        <button onClick={handleLogout} className="p-2" aria-label="Logout">
                            <LogoutIcon className="w-6 h-6 text-red-500" />
                        </button>
                    </div>
                </div>
                <nav className="mt-4 flex justify-around border-t border-cyan-500/20 pt-3">
                    {navLinks.map(link => (
                        <button
                            key={link.page}
                            onClick={() => handleNavClick(link.page)}
                            className={`p-2 rounded-full transition-colors ${activePage === link.page ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400'}`}
                            aria-label={link.label}
                        >
                            {link.icon}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;