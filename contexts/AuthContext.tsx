import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getInitialData, saveGameState } from '../data/mockDatabase';

// This is a mock authentication context.
// In a real application, this would be backed by a service like Firebase Auth.

interface AuthUser {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse auth user from localStorage", error);
        localStorage.removeItem('authUser');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (email && password) {
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
            const userData = existingUsers[email];
            
            // FIX: Check if the user exists AND the password matches.
            if (userData && userData.password === password) {
                const newUser: AuthUser = { uid: userData.uid, email };
                localStorage.setItem('authUser', JSON.stringify(newUser));
                setUser(newUser);
            } else {
                 // Provide a more generic error for security.
                 throw new Error('Invalid email or password.');
            }
        } else {
          throw new Error('Invalid credentials');
        }
    } finally {
        setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }
        
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        if (existingUsers[email]) {
            throw new Error("An agent profile with this email already exists.");
        }

        const uid = `user_${Date.now()}`;
        const newUser: AuthUser = { uid, email };
        
        // "Register" the user
        existingUsers[email] = { uid, password }; // Don't store plain text passwords in real apps!
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        // Create AND SAVE their initial game state IMMEDIATELY to prevent race conditions.
        const initialGameState = getInitialData(uid, `Agent-${email.split('@')[0]}`);
        saveGameState(uid, initialGameState);
        
        // Log them in
        localStorage.setItem('authUser', JSON.stringify(newUser));
        setUser(newUser);
    } finally {
        setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};