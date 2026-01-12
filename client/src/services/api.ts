import { generateReferralCode, isValidReferralCode } from '../utils/validation';
import storage from '../utils/storage';

export interface User {
    id: string;
    email: string;
    referralCode: string;
    referredBy: string | null;
    referralCount: number;
    position: number;
    verified: boolean;
    joinedAt: number;
}

export interface QueueStats {
    position: number;
    total: number;
    referralCount: number;
}

export interface ReferralStats {
    code: string;
    count: number;
    users: Array<{
        email: string;
        joinedAt: number;
    }>;
}

class WaitlistAPI {
    private users: User[] = [];
    private initialized = false;

    private init(): void {
        if (this.initialized || typeof window === 'undefined') return;
        this.users = this.loadUsers();
        this.initialized = true;
    }

    private loadUsers(): User[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem('sv_waitlist_users');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    private saveUsers(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem('sv_waitlist_users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    async registerUser(email: string, referralCode: string | null = null): Promise<User> {
        this.init();

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            throw new Error('Email already registered');
        }

        let referrer: User | undefined;
        if (referralCode) {
            if (!isValidReferralCode(referralCode)) {
                throw new Error('Invalid referral code format');
            }
            referrer = this.users.find(u => u.referralCode === referralCode);
            if (!referrer) {
                throw new Error('Referral code not found');
            }
        }

        const newUser: User = {
            id: Date.now().toString(),
            email,
            referralCode: generateReferralCode(),
            referredBy: referralCode || null,
            referralCount: 0,
            position: this.users.length + 1,
            verified: true,
            joinedAt: Date.now(),
        };

        this.users.push(newUser);

        // Update referrer's count and position
        if (referrer) {
            referrer.referralCount++;
            const bonus = Math.min(referrer.referralCount, 10);
            referrer.position = Math.max(1, referrer.position - bonus);
        }

        try {
            this.saveUsers();
            storage.set('current_user', newUser);
        } catch (error) {
            console.error('Error saving user data:', error);
            throw new Error('Failed to save user data. Please try again.');
        }

        return newUser;
    }

    async loginUser(email: string): Promise<User | null> {
        this.init();

        await new Promise(resolve => setTimeout(resolve, 300));

        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
            try {
                storage.set('current_user', user);
            } catch (error) {
                console.error('Error storing user session:', error);
            }
        }
        return user || null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        this.init();

        await new Promise(resolve => setTimeout(resolve, 300));
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    getCurrentUser(): User | null {
        try {
            return storage.get<User>('current_user');
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    logout(): void {
        try {
            storage.remove('current_user');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    // Queue offset for display purposes
    private readonly QUEUE_OFFSET = 3000;

    async getQueuePosition(userId: string): Promise<QueueStats | null> {
        this.init();

        await new Promise(resolve => setTimeout(resolve, 200));
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;

        // Sort users by score (lower is better)
        const sortedUsers = [...this.users].sort((a, b) => {
            const aScore = a.position - (a.referralCount * 2);
            const bScore = b.position - (b.referralCount * 2);
            return aScore - bScore;
        });

        const actualPosition = sortedUsers.findIndex(u => u.id === userId) + 1;

        return {
            position: actualPosition + this.QUEUE_OFFSET,
            total: this.users.length + this.QUEUE_OFFSET,
            referralCount: user.referralCount,
        };
    }

    async getReferralStats(userId: string): Promise<ReferralStats | null> {
        this.init();

        await new Promise(resolve => setTimeout(resolve, 200));
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;

        const referrals = this.users.filter(u => u.referredBy === user.referralCode);

        return {
            code: user.referralCode,
            count: referrals.length,
            users: referrals.map(r => ({
                email: r.email.replace(/(.{3}).*(@.*)/, '$1***$2'),
                joinedAt: r.joinedAt,
            })),
        };
    }

    // Refresh user data from storage
    async refreshUserData(userId: string): Promise<User | null> {
        this.init();
        const user = this.users.find(u => u.id === userId);

        if (user) {
            try {
                storage.set('current_user', user);
            } catch (error) {
                console.error('Error refreshing user data:', error);
            }
        }
        return user || null;
    }
}

export const waitlistAPI = new WaitlistAPI();
export default waitlistAPI;
