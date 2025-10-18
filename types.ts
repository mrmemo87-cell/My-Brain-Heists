// Gameplay-related types
export type Page = 'home' | 'profile' | 'tasks' | 'activity' | 'shop' | 'leaderboard';

export type TaskCategory = 'Science' | 'Maths' | 'English' | 'Global Perspective' | 'Russian Language' | 'Russian Literature' | 'German Language' | 'Geography' | 'Kyrgyz Language' | 'Kyrgyz History';

export interface ItemEffect {
    type: 'STAMINA_REFILL' | 'HACKING_BOOST' | 'SECURITY_BOOST';
    value: number; // e.g., amount of stamina, or % boost
    duration?: number; // duration in milliseconds for boosts
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    effect: ItemEffect;
}

export interface InventoryItem extends ShopItem {
    quantity: number;
}

export interface TaskReward {
    creds: number;
    xp: number;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    category: TaskCategory;
    type: 'simple' | 'trivia';
    topic?: string;
    reward: TaskReward;
    isCompleted: boolean;
}

export interface ActivityLogEntry {
    id: string;
    timestamp: number;
    message: string;
    isPositive: boolean;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    creds: number;
    stamina: number;
    maxStamina: number;
    hackingSkill: number;
    securitySkill: number;
    bio: string;
    inventory: InventoryItem[];
    activityLog: ActivityLogEntry[];
}

export interface GameState {
    isLoading: boolean;
    user: User;
    otherUsers: User[];
    tasks: Task[];
    shopItems: ShopItem[];
}
