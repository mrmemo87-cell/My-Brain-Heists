import React from 'react';
import { CoinIcon, StaminaIcon, LogoutIcon } from './icons';
import ProgressBar from './ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import { useGameState }from '../contexts/GameStateContext';
import { APP_NAME } from '../constants';
import { Page } from '../types';
import { playSound } from '../services/audioService';

interface HeaderProps {
  setActivePage: (page: Page) => void;
}


const Header: React.FC<HeaderProps> = ({ setActivePage }) => {
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

    return (
        <header className="glassmorphism p-4 rounded-b-lg mb-8 border-b border-t-0 border-x-0 border-cyan-500/30 sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <h1 onClick={() => handleNavClick('home')} className="text-2xl font-orbitron font-bold text-cyan-400 cursor-pointer">{APP_NAME}</h1>
                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="hidden md:flex items-center space-x-2">
                        <CoinIcon className="w-6 h-6 text-yellow-400" />
                        <span className="font-mono text-white">{user.creds.toLocaleString()}</span>
                    </div>
                     <div className="hidden md:flex items-center space-x-2">
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
                    <button onClick={handleLogout} className="p-2 hover:bg-cyan-500/20 rounded-full transition-colors">
                        <LogoutIcon className="w-6 h-6 text-red-500" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;