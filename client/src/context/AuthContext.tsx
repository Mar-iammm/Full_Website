"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { waitlistAPI, type User, type QueueStats, type ReferralStats } from '../services/api';
import storage from '../utils/storage';

interface AuthContextType {
    user: User | null;
    queueStats: QueueStats | null;
    referralStats: ReferralStats | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, referralCode: string | null) => Promise<void>;
    logout: () => void;
    refreshData: () => Promise<void>;
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
    const [user, setUser] = useState<User | null>(null);
    const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
    const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = useCallback(async (currentUser: User) => {
        try {
            const [queue, referrals] = await Promise.all([
                waitlistAPI.getQueuePosition(currentUser.id),
                waitlistAPI.getReferralStats(currentUser.id),
            ]);
            setQueueStats(queue);
            setReferralStats(referrals);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const storedUser = storage.get<User>('current_user');
                if (storedUser) {
                    setUser(storedUser);
                    await fetchUserData(storedUser);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [fetchUserData]);

    const login = async (email: string, referralCode: string | null) => {
        setIsLoading(true);
        try {
            // First try to find existing user
            let existingUser = await waitlistAPI.getUserByEmail(email);

            if (existingUser) {
                // Login existing user
                try {
                    storage.set('current_user', existingUser);
                    setUser(existingUser);
                    await fetchUserData(existingUser);
                } catch (error) {
                    console.error('Error logging in existing user:', error);
                    throw new Error('Failed to login. Please try again.');
                }
            } else {
                // Register new user
                try {
                    const newUser = await waitlistAPI.registerUser(email, referralCode);
                    setUser(newUser);
                    await fetchUserData(newUser);
                } catch (error) {
                    console.error('Error registering new user:', error);
                    // Re-throw the error with the original message (e.g., "Email already registered")
                    throw error;
                }
            }
        } catch (error) {
            // Propagate the error to the caller (LoginPage)
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        waitlistAPI.logout();
        setUser(null);
        setQueueStats(null);
        setReferralStats(null);
    };

    const refreshData = async () => {
        if (user) {
            await fetchUserData(user);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                queueStats,
                referralStats,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
