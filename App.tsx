import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';
import ActivityPage from './pages/ActivityPage';
import ShopPage from './pages/ShopPage';
import LeaderboardPage from './pages/LeaderboardPage';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';
import { Page } from './types';
import { playSound, stopSound } from './services/audioService';

const AuthenticatedApp: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('home');
    const { gameState } = useGameState();

    if (!gameState || gameState.isLoading) {
        return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-cyan-400 font-orbitron text-2xl animate-pulse">Loading Game State...</div>;
    }
    
     const renderPage = () => {
        switch(activePage) {
            case 'home':
                return <HomePage setActivePage={setActivePage} />;
            case 'profile':
                return <ProfilePage />;
            case 'tasks':
                return <TasksPage />;
            case 'activity':
                return <ActivityPage />;
            case 'shop':
                return <ShopPage />;
            case 'leaderboard':
                return <LeaderboardPage />;
            default:
                return <HomePage setActivePage={setActivePage} />;
        }
    };

    return (
         <div className="bg-gray-900 min-h-screen text-white font-sans selection:bg-cyan-500/30">
             <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern opacity-10 z-0"></div>
             <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-transparent to-gray-900 z-0"></div>
            <Header setActivePage={setActivePage} />
             <main className="container mx-auto px-4 py-8 relative z-10">
                {renderPage()}
            </main>
        </div>
    )
}


const App: React.FC = () => {
    const { user, loading } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    useEffect(() => {
        playSound('ambient', true);
        
        const clickHandler = () => playSound('click');
        window.addEventListener('click', clickHandler);
        
        return () => {
            stopSound('ambient');
            window.removeEventListener('click', clickHandler);
        };
    }, []);

    if (loading) {
        return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-cyan-400 font-orbitron text-2xl animate-pulse">Initializing Agent Interface...</div>;
    }
    
    if (!user) {
        return isLoginView 
            ? <LoginPage onSwitchToRegister={() => setIsLoginView(false)} />
            : <RegisterPage onSwitchToLogin={() => setIsLoginView(true)} />;
    }

    return (
        <GameStateProvider>
            <AuthenticatedApp />
        </GameStateProvider>
    );
};

export default App;