import React from 'react';
import type { Page } from '../types';
import { ActivityIcon, TasksIcon, ShopIcon, ProfileIcon, LeaderboardIcon, InfoIcon } from '../components/icons';
import { playSound } from '../services/audioService';

interface HomePageProps {
  setActivePage: (page: Page) => void;
}

const InstructionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  page: Page;
  onClick: (page: Page) => void;
}> = ({ icon, title, description, page, onClick }) => {
    
    const handleClick = () => {
        playSound('navigate');
        onClick(page);
    };

    return (
        <div 
            className="glassmorphism p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer flex flex-col"
            onClick={handleClick}
        >
            <div className="flex items-center space-x-4 mb-4">
            <div className="text-cyan-400 text-3xl">{icon}</div>
            <h3 className="text-xl font-orbitron text-white">{title}</h3>
            </div>
            <p className="text-gray-400 flex-grow">{description}</p>
            <button className="mt-4 text-cyan-400 font-bold self-start">Go to {title} &rarr;</button>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  const cards = [
    { icon: <ActivityIcon />, title: "The Heist", description: "Go head-to-head with rival agents. Spend Stamina to hack them and steal their Creds, but beware of their defenses.", page: 'activity' as Page },
    { icon: <TasksIcon />, title: "The Tasks", description: "Complete objectives to earn your primary income of Creds and XP. Some tasks will test your knowledge with AI assistance.", page: 'tasks' as Page },
    { icon: <ShopIcon />, title: "The Arsenal", description: "Spend your hard-earned Creds on powerful items. Boost your stats temporarily or get instant resource refills.", page: 'shop' as Page },
    { icon: <ProfileIcon />, title: "The Profile", description: "Your central hub. Track your stats, manage your inventory, and view your recent activity log.", page: 'profile' as Page },
    { icon: <LeaderboardIcon />, title: "The Ranks", description: "See where you stand among the other agents. Climb the leaderboard by gaining XP and asserting your dominance.", page: 'leaderboard' as Page },
    { icon: <InfoIcon />, title: "The Rules", description: "Level up by gaining XP from Tasks. Use items from the Arsenal to get an edge before hacking rivals in The Heist.", page: 'home' as Page },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white">Welcome, Agent</h2>
        <p className="text-lg text-cyan-400 mt-2">Your mission briefing awaits. The digital underworld is yours for the taking.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <InstructionCard key={card.title} {...card} onClick={setActivePage} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;