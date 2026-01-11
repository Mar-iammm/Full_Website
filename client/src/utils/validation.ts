import { UNIVERSITY_DOMAINS } from './constants';

export const isUniversityEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    const emailLower = email.toLowerCase().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailLower)) return false;
    return UNIVERSITY_DOMAINS.some(domain => emailLower.endsWith(domain));
};

export const generateReferralCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export const isValidReferralCode = (code: string): boolean => {
    return /^[A-Z0-9]{8}$/.test(code);
};

export interface ActivityLog {
    ipAddress: string;
    attempts: number;
    timestamp: number;
}

export const detectSuspiciousActivity = (activityLog: ActivityLog): boolean => {
    const { attempts, timestamp } = activityLog;
    if (attempts > 10 && Date.now() - timestamp < 60000) {
        return true;
    }
    return false;
};
