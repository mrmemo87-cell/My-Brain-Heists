import React, { useMemo, useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import Modal from '../components/Modal';

const LeaderboardPage: React.FC = () => {
  const { gameState } = useGameState();
  const { user: authUser } = useAuth();
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const sortedUsers = useMemo(() => {
    if (!gameState) return [];
    const allUsers = [gameState.user, ...gameState.otherUsers];
    return allUsers.sort((a, b) => (b.level * 100000 + b.xp) - (a.level * 100000 + a.xp));
  }, [gameState]);

  if (!gameState || !authUser) return <div>Loading leaderboard...</div>;
  
  const handleUserClick = (user: User) => {
    setViewingUser(user);
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-orbitron text-white">The Ranks</h2>
        <p className="text-cyan-400">See where you stand among the top agents.</p>
      </div>
      <div className="glassmorphism p-4 sm:p-6 rounded-lg">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-cyan-500/30">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-cyan-400 sm:pl-0">Rank</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cyan-400">Agent</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cyan-400">Level</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cyan-400">Total XP</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cyan-400">Creds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedUsers.map((user, index) => (
                    <tr 
                        key={user.id} 
                        className={`${user.id === authUser.uid ? "bg-cyan-500/10" : ""} hover:bg-cyan-500/20 cursor-pointer`}
                        onClick={() => handleUserClick(user)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">{index + 1}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 flex items-center space-x-3">
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                        <span>{user.username}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.level}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.xp.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.creds.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
                  <p className="text-gray-400 text-sm italic whitespace-pre-wrap">{viewingUser.bio || "This agent prefers to remain a mystery."}</p>
              </div>
          </Modal>
      )}
    </div>
  );
};

export default LeaderboardPage;