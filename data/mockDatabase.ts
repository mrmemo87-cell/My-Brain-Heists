import { GameState, User, Task, ShopItem, TaskCategory } from '../types';
import { LEVEL_UP_XP_BASE, LEVEL_UP_XP_MULTIPLIER, MAX_STAMINA } from '../constants';

const taskCategories: TaskCategory[] = ['Science', 'Maths', 'English', 'Global Perspective', 'Russian Language', 'Russian Literature', 'German Language', 'Geography', 'Kyrgyz Language', 'Kyrgyz History'];

// Helper to generate a random integer
const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a more diverse set of tasks
const generateTasks = (): Task[] => {
    const tasks: Task[] = [];
    let idCounter = 1;
    taskCategories.forEach(category => {
        // Two simple tasks per category
        tasks.push({
            id: `task_${idCounter++}`,
            title: `Basic ${category} Review`,
            description: `Brush up on the fundamentals of ${category}. Quick and easy.`,
            category: category,
            type: 'simple',
            reward: { creds: 25, xp: 10 },
            isCompleted: false
        });
        tasks.push({
            id: `task_${idCounter++}`,
            title: `Advanced ${category} Study`,
            description: `Dive deeper into complex ${category} topics.`,
            category: category,
            type: 'simple',
            reward: { creds: 50, xp: 25 },
            isCompleted: false
        });
        // One trivia task per category
        tasks.push({
            id: `task_${idCounter++}`,
            title: `${category} Trivia Challenge`,
            description: `Test your knowledge on ${category} with a challenging question.`,
            category: category,
            type: 'trivia',
            topic: category, // Topic for Gemini
            reward: { creds: 100, xp: 75 },
            isCompleted: false
        });
    });
    return tasks;
};


// Generate some shop items
const generateShopItems = (): ShopItem[] => {
    return [
        { id: 'item_1', name: 'Stamina Refill', description: 'Instantly restores 50 stamina.', price: 500, effect: { type: 'STAMINA_REFILL', value: 50 } },
        { id: 'item_2', name: 'Data Spike', description: 'Boosts Hacking Skill by 20% for the next 10 minutes.', price: 1000, effect: { type: 'HACKING_BOOST', value: 20, duration: 10 * 60 * 1000 } },
        { id: 'item_3', name: 'Firewall Shield', description: 'Boosts Security Skill by 20% for the next 10 minutes.', price: 1000, effect: { type: 'SECURITY_BOOST', value: 20, duration: 10 * 60 * 1000 } },
        { id: 'item_4', name: 'Full Stamina Restore', description: 'Instantly restores all stamina.', price: 800, effect: { type: 'STAMINA_REFILL', value: MAX_STAMINA } },
    ];
};

// Generate a single user profile
const generateUser = (id: string, username: string, isPlayer: boolean): User => {
    const level = isPlayer ? 1 : getRandomInt(1, 10);
    const creds = isPlayer ? 500 : getRandomInt(100, 5000);
    const xp = isPlayer ? 0 : getRandomInt(0, 1000);

    return {
        id: id,
        username: username,
        email: `${username}@heist.io`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        level: level,
        xp: xp,
        xpToNextLevel: Math.floor(LEVEL_UP_XP_BASE * Math.pow(LEVEL_UP_XP_MULTIPLIER, level - 1)),
        creds: creds,
        stamina: MAX_STAMINA,
        maxStamina: MAX_STAMINA,
        hackingSkill: isPlayer ? 10 : getRandomInt(5, 50),
        securitySkill: isPlayer ? 10 : getRandomInt(5, 50),
        bio: isPlayer ? "A new agent on the scene, ready to make a name for myself in the digital underworld." : `A mysterious agent known only as ${username}.`,
        inventory: [],
        activityLog: isPlayer ? [{ id: `log_${Date.now()}`, timestamp: Date.now(), message: "Welcome to Brain Heist, agent. Your mission begins now.", isPositive: true }] : [],
    };
};

// Generate the full initial game state for a new player
export const getInitialData = (userId: string, username: string): GameState => {
    const playerUser = generateUser(userId, username, true);
    const otherUsers: User[] = [
        generateUser('bot_1', 'CyberNinja', false),
        generateUser('bot_2', 'DataWraith', false),
        generateUser('bot_3', 'Glitch', false),
        generateUser('bot_4', 'Syntax', false),
        generateUser('bot_5', 'Vector', false),
    ];
    
    return {
        isLoading: false,
        user: playerUser,
        otherUsers: otherUsers,
        tasks: generateTasks(),
        shopItems: generateShopItems(),
    };
};


// Functions to interact with localStorage
const getGameState = (userId: string): GameState | null => {
    const savedData = localStorage.getItem(`gameState_${userId}`);
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (e) {
            console.error("Failed to parse game state from localStorage", e);
            return null;
        }
    }
    return null;
};

export const saveGameState = (userId: string, gameState: GameState): void => {
    localStorage.setItem(`gameState_${userId}`, JSON.stringify(gameState));
};

// Main function to load data, either from storage or by generating it
export const loadDataForUser = (userId: string, username: string): GameState => {
    let gameState = getGameState(userId);
    if (!gameState) {
        console.log("No saved game state found, generating initial data.");
        gameState = getInitialData(userId, username);
        saveGameState(userId, gameState);
    }
    return gameState;
};
