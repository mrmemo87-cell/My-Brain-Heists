import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { User } from '../types';
import { HackingIcon, SecurityIcon, CoinIcon, XPIcon } from '../components/icons';
import { HACKING_STAMINA_COST } from '../constants';
import HackingAnimation from '../components/HackingAnimation';
import Modal from '../components/Modal';

const ActivityPage: React.FC = () => {
    const { gameState, performHack } = useGameState();
    const [target, setTarget] = useState<User | null>(null);
    const [isHacking, setIsHacking] = useState(false);
    const [hackResult, setHackResult] = useState<string | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const handleHack = (targetUser: User) => {
        if (!gameState || gameState.user.stamina < HACKING_STAMINA_COST) {
            alert("Not enough stamina!");
            return;
        }
        setTarget(targetUser);
        setIsHacking(true);
        setHackResult(null);

        // Animation will run for a few seconds, then we run the logic
        setTimeout(() => {
            const result = performHack(targetUser);
            setHackResult(result);
            
            // Show result message then close animation window
            setTimeout(() => {
                setIsHacking(false);
                setTarget(null);
                setHackResult(null);
            }, 4000);

        }, 4000); 
    };
    
    if (!gameState) return <div>Loading...</div>;

    if (isHacking && target) {
        return <HackingAnimation targetName={target.username} result={hackResult} />;
    }

    return (
        <div className="animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-orbitron text-white">The Heist</h2>
                <p className="text-cyan-400">Hack other agents to steal their Creds. Costs {HACKING_STAMINA_COST} Stamina.</p>
            </div>
            <div className="space-y-4">
                {gameState.otherUsers.map(user => (
                    <div key={user.id} className="glassmorphism p-4 rounded-lg flex items-center justify-between transition-all hover:border-cyan-400/50 border border-transparent">
                        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setViewingUser(user)}>
                            <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full border-2 border-cyan-500/50" />
                            <div>
                                <h3 className="text-lg font-bold text-white">{user.username} <span className="text-sm font-normal text-gray-400">Lvl {user.level}</span></h3>
                                <div className="flex items-center space-x-4 text-sm mt-1">
                                    <span className="flex items-center" title="Creds"><CoinIcon className="w-4 h-4 mr-1 text-yellow-400" /> {user.creds.toLocaleString()}</span>
                                    <span className="flex items-center" title="Security"><SecurityIcon className="w-4 h-4 mr-1 text-blue-400" /> {user.securitySkill}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleHack(user)}
                            disabled={gameState.user.stamina < HACKING_STAMINA_COST}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors font-bold disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2 animate-pulse hover:animate-none"
                        >
                            <HackingIcon className="w-5 h-5" />
                            <span>Hack</span>
                        </button>
                    </div>
                ))}
            </div>

             {viewingUser && (
                <Modal isOpen={!!viewingUser} onClose={() => setViewingUser(null)} title={`Agent Profile: ${viewingUser.username}`}>
                    <div className="flex flex-col items-center text-center">
                        <img src={viewingUser.avatar} alt={viewingUser.username} className="w-24 h-24 rounded-full border-4 border-cyan-500 mb-4" />
                         <div className="grid grid-cols-2 gap-4 w-full mb-4">
                            <div className="glassmorphism p-2 rounded-lg">
                                <div className="text-cyan-400 text-sm">Hacking</div>
                                <div className="text-white font-bold text-lg">{viewingUser.hackingSkill}</div>
                            </div>
                             <div className="glassmorphism p-2 rounded-lg">
                                <div className="text-cyan-400 text-sm">Security</div>
                                <div className="text-white font-bold text-lg">{viewingUser.securitySkill}</div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm italic whitespace-pre-wrap">{viewingUser.bio}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ActivityPage;