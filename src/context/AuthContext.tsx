import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  username?: string;
  password?: string;
  avatar?: string;
  role?: 'admin' | 'user';
}

interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  type: 'search' | 'vin' | 'maintenance';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  history: HistoryItem[];
  addToHistory: (query: string, type: HistoryItem['type']) => void;
  clearHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('auto_academy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedHistory = localStorage.getItem('auto_academy_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const login = async (email: string, name: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const newUser = await response.json();
      setUser(newUser);
      localStorage.setItem('auto_academy_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Login error:', error);
      // Fallback for demo if backend is not ready
      const isAdmin = email === 'erik.serobyan20@gmail.com';
      const newUser: User = { 
        email, 
        name, 
        username: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: isAdmin ? 'admin' : 'user'
      };
      setUser(newUser);
      localStorage.setItem('auto_academy_user', JSON.stringify(newUser));
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('auto_academy_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setHistory([]);
    localStorage.removeItem('auto_academy_user');
    localStorage.removeItem('auto_academy_history');
  };

  const addToHistory = (query: string, type: HistoryItem['type']) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      query,
      type,
      timestamp: Date.now(),
    };
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
    setHistory(newHistory);
    localStorage.setItem('auto_academy_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('auto_academy_history');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      updateUser, 
      logout, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      history, 
      addToHistory, 
      clearHistory 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
