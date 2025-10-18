import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ShopItem } from '../types';
import { CoinIcon } from '../components/icons';
import { playSound } from '../services/audioService';

const ShopPage: React.FC = () => {
    const { gameState, purchaseItem } = useGameState();

    const handleBuyItem = (item: ShopItem) => {
        if (!gameState) return;
        
        const success = purchaseItem(item);

        if (success) {
            alert(`You bought ${item.name}! Check your profile to activate it.`);
        } else {
             alert("Not enough creds!");
        }
    };

    if (!gameState) return <div>Loading shop...</div>;

    return (
        <div className="animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-orbitron text-white">The Arsenal</h2>
                <p className="text-cyan-400">Spend your Creds on powerful items and boosts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameState.shopItems.map(item => (
                    <div key={item.id} className="glassmorphism p-6 rounded-lg border border-cyan-500/20 flex flex-col">
                        <h3 className="text-xl font-orbitron text-white mb-2">{item.name}</h3>
                        <p className="text-gray-400 mb-4 flex-grow">{item.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                            <span className="text-yellow-400 font-bold flex items-center">
                                <CoinIcon className="w-5 h-5 mr-1" />
                                {item.price.toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleBuyItem(item)}
                                disabled={gameState.user.creds < item.price}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors font-bold disabled:bg-gray-600"
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;