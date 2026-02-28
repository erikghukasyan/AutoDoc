import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
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
  logout: () => void;
  isAuthenticated: boolean;
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

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('auto_academy_user', JSON.stringify(newUser));
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, history, addToHistory, clearHistory }}>
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
