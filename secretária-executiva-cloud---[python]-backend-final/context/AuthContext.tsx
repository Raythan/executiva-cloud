import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { mockAllData } from '../mock/data';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const storedToken = localStorage.getItem('token');
        const storedUserJSON = localStorage.getItem('user');
        if (storedToken && storedUserJSON) {
            setToken(storedToken);
            setUser(JSON.parse(storedUserJSON));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = async (userId: string) => {
    const userToLogin = mockAllData.users.find(u => u.id === userId);
    
    if (userToLogin) {
        // Clone user to avoid mutating mock data
        const loggedInUser: User = { ...userToLogin };

        // If user is a secretary, populate their associated executive IDs
        if (loggedInUser.role === 'secretary' && loggedInUser.secretaryId) {
            const secretary = mockAllData.secretaries.find(s => s.id === loggedInUser.secretaryId);
            loggedInUser.executiveIds = secretary?.executiveIds || [];
        }

        const newToken = `mock-token-for-${userId}-${Date.now()}`;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setToken(newToken);
        setUser(loggedInUser);
    } else {
        throw new Error('User not found in mock data.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
