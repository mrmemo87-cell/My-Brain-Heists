import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import ProgressBar from '../components/ProgressBar';
import RadialGauge from '../components/RadialGauge';
import { CoinIcon } from '../components/icons';

const ProfilePage: React.FC = () => {
    const { gameState } = useGameState();

    if (!gameState) {
        return <div>Loading profile...</div>;
    }

    const { user } = gameState;
    
    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 mb-12">
                <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-full border-4 border-cyan-500 shadow-lg shadow-cyan-500/30" />
                <div>
                    <h2 className="text-4xl font-orbitron font-bold text-white">{user.username}</h2>
                    <p className="text-cyan-400">Level {user.level} Agent</p>
                    <p className="text-gray-400 mt-2 max-w-lg italic whitespace-pre-wrap">{user.bio}</p>
                </div>
            </div>
            
            {/* Core Stats Gauges */}
            <div className="glassmorphism p-6 rounded-lg border border-cyan-500/20 mb-8">
                <h3 className="text-xl font-orbitron text-white mb-6 text-center">Core Stats</h3>
                <div className="flex flex-col md:flex-row items-center justify-around w-full gap-8 md:gap-4">
                    <RadialGauge 
                        progress={(user.stamina / user.maxStamina) * 100} 
                        label="Stamina" 
                        value={user.stamina} 
                        colorClass="text-green-500" 
                    />
                    <RadialGauge 
                        progress={user.hackingSkill} 
                        label="Hacking" 
                        value={user.hackingSkill} 
                        colorClass="text-red-500" 
                    />
                    <RadialGauge 
                        progress={user.securitySkill} 
                        label="Security" 
                        value={user.securitySkill} 
                        colorClass="text-blue-500" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Agent Vitals */}
                <div className="glassmorphism p-6 rounded-lg border border-cyan-500/20">
                    <h3 className="text-xl font-orbitron text-white mb-6">Agent Vitals</h3>
                    <div className="space-y-6">
                         <ProgressBar 
                            value={user.xp}
                            max={user.xpToNextLevel}
                            label={`Level ${user.level} XP`}
                            colorClass="bg-purple-500"
                        />
                         <div className="flex items-center space-x-4 text-lg">
                            <CoinIcon className="w-6 h-6 text-yellow-400" />
                            <span className="text-white font-mono">{user.creds.toLocaleString()} Creds</span>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="glassmorphism p-6 rounded-lg border border-cyan-500/20">
                     <h3 className="text-xl font-orbitron text-white mb-4">Activity Log</h3>
                     <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                         {user.activityLog.slice(0, 50).map(log => (
                            <div key={log.id} className={`p-2 rounded-md text-sm ${log.isPositive ? 'bg-cyan-500/10 text-cyan-300' : 'bg-red-500/10 text-red-300'}`}>
                                <span className="font-mono mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span>{log.message}</span>
                            </div>
                         ))}
                     </div>
                </div>
            </div>
            
        </div>
    );
};

export default ProfilePage;