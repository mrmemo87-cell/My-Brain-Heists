import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GameState, User, Task, ShopItem } from '../types';
import { useAuth } from './AuthContext';
import { loadDataForUser, saveGameState } from '../data/mockDatabase';
import { 
    LEVEL_UP_XP_BASE, 
    LEVEL_UP_XP_MULTIPLIER,
    STAMINA_REGEN_RATE,
    STAMINA_REGEN_INTERVAL,
    HACKING_STAMINA_COST,
    HACKING_SUCCESS_XP_REWARD,
    HACKING_FAILURE_XP_REWARD,
    HACKING_CRED_STEAL_PERCENTAGE,
} from '../constants';
import { playSound } from '../services/audioService';

interface GameStateContextType {
    gameState: GameState | null;
    completeTask: (task: Task) => void;
    purchaseItem: (item: ShopItem) => boolean;
    performHack: (target: User) => string;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = (): GameStateContextType => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};

interface GameStateProviderProps {
    children: ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
    const { user: authUser } = useAuth();
    const [gameState, setGameState] = useState<GameState | null>({ isLoading: true } as GameState);

    const updateGameState = useCallback((newState: GameState) => {
        if (!authUser) return;
        saveGameState(authUser.uid, newState);
        setGameState(newState);
    }, [authUser]);


    useEffect(() => {
        if (authUser) {
            const data = loadDataForUser(authUser.uid, authUser.email?.split('@')[0] || `Agent${Date.now()}`);
            setGameState(data);
        } else {
            setGameState(null);
        }
    }, [authUser]);

    // Stamina Regeneration Timer
    useEffect(() => {
        if (!gameState || !gameState.user) return;

        const intervalId = setInterval(() => {
            setGameState(prevState => {
                if (!prevState || prevState.user.stamina >= prevState.user.maxStamina) {
                    return prevState;
                }
                const newStamina = Math.min(prevState.user.stamina + STAMINA_REGEN_RATE, prevState.user.maxStamina);
                const updatedUser = { ...prevState.user, stamina: newStamina };
                const newState = { ...prevState, user: updatedUser };
                if (authUser) saveGameState(authUser.uid, newState); // Save on update
                return newState;
            });
        }, STAMINA_REGEN_INTERVAL);

        return () => clearInterval(intervalId);
    }, [gameState, authUser]);
    
     // Level Up Logic
    const checkForLevelUp = useCallback((currentUser: User): User => {
        let user = { ...currentUser };
        while (user.xp >= user.xpToNextLevel) {
            user.level += 1;
            user.xp -= user.xpToNextLevel;
            user.xpToNextLevel = Math.floor(LEVEL_UP_XP_BASE * Math.pow(LEVEL_UP_XP_MULTIPLIER, user.level - 1));
            user.maxStamina += 10; // Bonus for leveling up
            user.stamina = user.maxStamina; // Full stamina refill
            user.hackingSkill += 1;
            user.securitySkill += 1;
            user.activityLog = [
                { id: `log_${Date.now()}`, timestamp: Date.now(), message: `Congratulations! You reached Level ${user.level}! Stamina refilled and skills increased.`, isPositive: true },
                ...user.activityLog
            ];
            playSound('success');
        }
        return user;
    }, []);

    const completeTask = (task: Task) => {
        if (!gameState) return;
        
        const updatedTasks = gameState.tasks.map(t =>
            t.id === task.id ? { ...t, isCompleted: true } : t
        );
        
        setGameState(prevState => {
             if (!prevState) return null;
             let updatedUser = {
                ...prevState.user,
                xp: prevState.user.xp + task.reward.xp,
                creds: prevState.user.creds + task.reward.creds,
                activityLog: [{ id: `log_${Date.now()}`, timestamp: Date.now(), message: `Task completed: '${task.title}'. Gained ${task.reward.xp} XP and ${task.reward.creds} creds.`, isPositive: true }, ...prevState.user.activityLog]
            };
            updatedUser = checkForLevelUp(updatedUser);
            const newState = { ...prevState, user: updatedUser, tasks: updatedTasks };
            updateGameState(newState);
            playSound('success');
            return newState;
        });
    };
    
    const purchaseItem = (item: ShopItem) => {
        if (!gameState || gameState.user.creds < item.price) {
            playSound('fail');
            return false;
        }

        setGameState(prevState => {
            if(!prevState) return null;
            
            let updatedUser = {
                ...prevState.user,
                creds: prevState.user.creds - item.price,
                activityLog: [{ id: `log_${Date.now()}`, timestamp: Date.now(), message: `Purchased ${item.name} for ${item.price} creds.`, isPositive: true }, ...prevState.user.activityLog]
            };

             if (item.effect.type === 'STAMINA_REFILL') {
                updatedUser.stamina = Math.min(updatedUser.stamina + item.effect.value, updatedUser.maxStamina);
            }

            const newState = { ...prevState, user: updatedUser };
            updateGameState(newState);
            playSound('purchase');
            return newState;
        });
        
        return true;
    };
    
    const performHack = (target: User): string => {
        if (!gameState || gameState.user.stamina < HACKING_STAMINA_COST) {
            return "Critical Error: Insufficient Stamina.";
        }

        const hackingSkill = gameState.user.hackingSkill;
        const securitySkill = target.securitySkill;
        
        const successChance = Math.max(0.1, Math.min(0.9, 0.5 + (hackingSkill - securitySkill) * 0.05));
        const isSuccess = Math.random() < successChance;
        
        let resultMessage = '';
        
        setGameState(prevState => {
            if (!prevState) return null;

            let updatedUser = { ...prevState.user, stamina: prevState.user.stamina - HACKING_STAMINA_COST };
            
            if (isSuccess) {
                const credsStolen = Math.floor(target.creds * HACKING_CRED_STEAL_PERCENTAGE);
                updatedUser.creds += credsStolen;
                updatedUser.xp += HACKING_SUCCESS_XP_REWARD;
                resultMessage = `Success! Siphoned ${credsStolen.toLocaleString()} creds from ${target.username}.`;
                updatedUser.activityLog = [{ id: `log_${Date.now()}`, timestamp: Date.now(), message: resultMessage, isPositive: true }, ...updatedUser.activityLog];
                playSound('success');
            } else {
                updatedUser.xp += HACKING_FAILURE_XP_REWARD;
                resultMessage = `Failure! ${target.username}'s defenses were too strong.`;
                updatedUser.activityLog = [{ id: `log_${Date.now()}`, timestamp: Date.now(), message: resultMessage, isPositive: false }, ...updatedUser.activityLog];
                playSound('fail');
            }

            updatedUser = checkForLevelUp(updatedUser);
            const newState = { ...prevState, user: updatedUser };
            updateGameState(newState);
            return newState;
        });
        
        return resultMessage;
    };


    const value: GameStateContextType = {
        gameState,
        completeTask,
        purchaseItem,
        performHack
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};
