/**
 * Verification API Service
 * 
 * This module provides a clean interface for email verification and OTP operations.
 * Currently uses mock implementations that can be easily swapped with real backend endpoints.
 * 
 * Integration Points:
 * - POST /api/verification/send-otp
 * - POST /api/verification/verify-otp
 * - POST /api/verification/resend-otp
 */

import storage from '../utils/storage';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SendOTPRequest {
    email: string;
}

export interface SendOTPResponse {
    success: boolean;
    message: string;
    expiresAt?: number; // Unix timestamp
    cooldownUntil?: number; // Unix timestamp for rate limiting
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface VerifyOTPResponse {
    success: boolean;
    message: string;
    verified?: boolean;
    attemptsRemaining?: number;
    lockedUntil?: number; // Unix timestamp if account is locked
}

export interface ResendOTPRequest {
    email: string;
}

export interface ResendOTPResponse {
    success: boolean;
    message: string;
    expiresAt?: number;
    cooldownUntil?: number;
    resendCount?: number;
}

export interface VerificationState {
    email: string;
    otp: string;
    expiresAt: number;
    attempts: number;
    resendCount: number;
    lastResendAt: number;
    lockedUntil: number | null;
}

// ============================================================================
// Configuration
// ============================================================================

export const VERIFICATION_CONFIG = {
    OTP_LENGTH: 6,
    OTP_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
    RESEND_COOLDOWN_MS: 60 * 1000, // 60 seconds
    MAX_ATTEMPTS: 5,
    MAX_RESENDS: 3,
    LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
} as const;

// ============================================================================
// Mock Storage (Replace with real API calls)
// ============================================================================

const VERIFICATION_STORAGE_KEY = 'sv_verification_state';

const getVerificationState = (): VerificationState | null => {
    if (typeof window === 'undefined') return null;
    const stored = storage.get<VerificationState>(VERIFICATION_STORAGE_KEY);
    return stored;
};

const setVerificationState = (state: VerificationState): void => {
    if (typeof window === 'undefined') return;
    storage.set(VERIFICATION_STORAGE_KEY, state);
};

const clearVerificationState = (): void => {
    if (typeof window === 'undefined') return;
    storage.remove(VERIFICATION_STORAGE_KEY);
};

// Generate a random 6-digit OTP
const generateOTP = (): string => {
    // Default OTP for testing purposes - always returns 111111
    return '111111';
};

// ============================================================================
// API Methods (Mock Implementation - Ready for Backend Integration)
// ============================================================================

/**
 * Send OTP to the specified email address
 * 
 * Backend Integration:
 * Replace the mock implementation with:
 * ```
 * const response = await fetch('/api/verification/send-otp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email }),
 * });
 * return response.json();
 * ```
 */
export const sendOTP = async (request: SendOTPRequest): Promise<SendOTPResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { email } = request;
    const existingState = getVerificationState();

    // Check if locked
    if (existingState?.lockedUntil && Date.now() < existingState.lockedUntil) {
        return {
            success: false,
            message: 'Too many failed attempts. Please try again later.',
            cooldownUntil: existingState.lockedUntil,
        };
    }

    // Check resend cooldown
    if (existingState?.email === email && existingState.lastResendAt) {
        const cooldownEnd = existingState.lastResendAt + VERIFICATION_CONFIG.RESEND_COOLDOWN_MS;
        if (Date.now() < cooldownEnd) {
            return {
                success: false,
                message: 'Please wait before requesting another code.',
                cooldownUntil: cooldownEnd,
            };
        }
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + VERIFICATION_CONFIG.OTP_EXPIRY_MS;

    // Store verification state
    const newState: VerificationState = {
        email,
        otp,
        expiresAt,
        attempts: 0,
        resendCount: existingState?.email === email ? (existingState.resendCount || 0) : 0,
        lastResendAt: Date.now(),
        lockedUntil: null,
    };

    setVerificationState(newState);

    // In development, log the OTP for testing
    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] OTP for ${email}: ${otp}`);
    }

    return {
        success: true,
        message: `Verification code sent to ${email}`,
        expiresAt,
    };
};

/**
 * Verify the OTP entered by the user
 * 
 * Backend Integration:
 * Replace the mock implementation with:
 * ```
 * const response = await fetch('/api/verification/verify-otp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, otp }),
 * });
 * return response.json();
 * ```
 */
export const verifyOTP = async (request: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const { email, otp } = request;
    const state = getVerificationState();

    // No verification in progress
    if (!state || state.email !== email) {
        return {
            success: false,
            message: 'No verification in progress. Please request a new code.',
            verified: false,
        };
    }

    // Check if locked
    if (state.lockedUntil && Date.now() < state.lockedUntil) {
        return {
            success: false,
            message: 'Account temporarily locked. Please try again later.',
            verified: false,
            lockedUntil: state.lockedUntil,
        };
    }

    // Check if OTP expired
    if (Date.now() > state.expiresAt) {
        return {
            success: false,
            message: 'Verification code has expired. Please request a new one.',
            verified: false,
        };
    }

    // Verify OTP
    if (otp === state.otp) {
        clearVerificationState();
        return {
            success: true,
            message: 'Email verified successfully!',
            verified: true,
        };
    }

    // Wrong OTP - increment attempts
    state.attempts++;
    const attemptsRemaining = VERIFICATION_CONFIG.MAX_ATTEMPTS - state.attempts;

    // Lock account if max attempts reached
    if (attemptsRemaining <= 0) {
        state.lockedUntil = Date.now() + VERIFICATION_CONFIG.LOCKOUT_DURATION_MS;
        setVerificationState(state);
        return {
            success: false,
            message: 'Too many failed attempts. Account temporarily locked.',
            verified: false,
            attemptsRemaining: 0,
            lockedUntil: state.lockedUntil,
        };
    }

    setVerificationState(state);
    return {
        success: false,
        message: `Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`,
        verified: false,
        attemptsRemaining,
    };
};

/**
 * Resend OTP to the specified email
 * 
 * Backend Integration:
 * Replace the mock implementation with:
 * ```
 * const response = await fetch('/api/verification/resend-otp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email }),
 * });
 * return response.json();
 * ```
 */
export const resendOTP = async (request: ResendOTPRequest): Promise<ResendOTPResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { email } = request;
    const state = getVerificationState();

    // Check if locked
    if (state?.lockedUntil && Date.now() < state.lockedUntil) {
        return {
            success: false,
            message: 'Account temporarily locked. Please try again later.',
            cooldownUntil: state.lockedUntil,
        };
    }

    // Check cooldown
    if (state?.lastResendAt) {
        const cooldownEnd = state.lastResendAt + VERIFICATION_CONFIG.RESEND_COOLDOWN_MS;
        if (Date.now() < cooldownEnd) {
            return {
                success: false,
                message: 'Please wait before requesting another code.',
                cooldownUntil: cooldownEnd,
            };
        }
    }

    // Check max resends
    if (state && state.resendCount >= VERIFICATION_CONFIG.MAX_RESENDS) {
        return {
            success: false,
            message: 'Maximum resend limit reached. Please try again later.',
        };
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + VERIFICATION_CONFIG.OTP_EXPIRY_MS;
    const resendCount = (state?.resendCount || 0) + 1;

    const newState: VerificationState = {
        email,
        otp,
        expiresAt,
        attempts: 0,
        resendCount,
        lastResendAt: Date.now(),
        lockedUntil: null,
    };

    setVerificationState(newState);

    // In development, log the OTP for testing
    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Resent OTP for ${email}: ${otp}`);
    }

    return {
        success: true,
        message: 'New verification code sent.',
        expiresAt,
        resendCount,
    };
};

/**
 * Get current verification status (for UI state restoration)
 */
export const getVerificationStatus = (): {
    inProgress: boolean;
    email?: string;
    expiresAt?: number;
    attemptsRemaining?: number;
    lockedUntil?: number | null;
    canResend?: boolean;
    resendCooldownUntil?: number;
} => {
    const state = getVerificationState();

    if (!state) {
        return { inProgress: false };
    }

    const now = Date.now();
    const isExpired = now > state.expiresAt;
    const isLocked = state.lockedUntil && now < state.lockedUntil;
    const resendCooldownUntil = state.lastResendAt + VERIFICATION_CONFIG.RESEND_COOLDOWN_MS;
    const canResend = now > resendCooldownUntil && state.resendCount < VERIFICATION_CONFIG.MAX_RESENDS;

    return {
        inProgress: !isExpired && !isLocked,
        email: state.email,
        expiresAt: state.expiresAt,
        attemptsRemaining: VERIFICATION_CONFIG.MAX_ATTEMPTS - state.attempts,
        lockedUntil: state.lockedUntil,
        canResend,
        resendCooldownUntil: canResend ? undefined : resendCooldownUntil,
    };
};

/**
 * Clear verification state (for logout or reset)
 */
export const resetVerification = (): void => {
    clearVerificationState();
};

export default {
    sendOTP,
    verifyOTP,
    resendOTP,
    getVerificationStatus,
    resetVerification,
    VERIFICATION_CONFIG,
};
