"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Mail,
    Shield,
    Clock,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Lock,
    Loader2
} from 'lucide-react';
import { VERIFICATION_CONFIG } from '../../services/verificationApi';

// ============================================================================
// Types
// ============================================================================

export type OTPModalStep = 'input' | 'verifying' | 'success' | 'error' | 'locked';

export interface OTPModalProps {
    isOpen: boolean;
    email: string;
    onClose: () => void;
    onVerify: (otp: string) => Promise<{ success: boolean; message: string; attemptsRemaining?: number; lockedUntil?: number }>;
    onResend: () => Promise<{ success: boolean; message: string; cooldownUntil?: number }>;
    onSuccess: () => void;
    expiresAt?: number;
    initialCooldownUntil?: number;
}

// ============================================================================
// OTP Input Component
// ============================================================================

interface OTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
    autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
    length,
    value,
    onChange,
    disabled = false,
    error = false,
    autoFocus = true,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index: number, inputValue: string) => {
        // Only allow numbers
        const digit = inputValue.replace(/\D/g, '').slice(-1);

        const newValue = value.split('');
        newValue[index] = digit;
        const result = newValue.join('');

        onChange(result);

        // Move to next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
            const newValue = value.split('');
            newValue[index] = '';
            onChange(newValue.join(''));
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(pastedData);

        // Focus the appropriate input
        const focusIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {Array.from({ length }).map((_, index) => (
                <motion.input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
            w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono
            glass rounded-xl border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-azure/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
                            ? 'border-red-500/50 focus:border-red-500 text-red-400'
                            : value[index]
                                ? 'border-azure/50 text-white'
                                : 'border-white/10 text-white'
                        }
          `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileFocus={{ scale: 1.05 }}
                />
            ))}
        </div>
    );
};

// ============================================================================
// Resend Timer Component
// ============================================================================

interface ResendTimerProps {
    cooldownUntil: number | null;
    onResend: () => void;
    disabled?: boolean;
    isResending?: boolean;
}

const ResendTimer: React.FC<ResendTimerProps> = ({
    cooldownUntil,
    onResend,
    disabled = false,
    isResending = false,
}) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!cooldownUntil) {
            setTimeLeft(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [cooldownUntil]);

    const canResend = timeLeft === 0 && !disabled && !isResending;

    return (
        <div className="text-center">
            {isResending ? (
                <motion.div
                    className="flex items-center justify-center gap-2 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Sending new code...</span>
                </motion.div>
            ) : timeLeft > 0 ? (
                <motion.div
                    className="flex items-center justify-center gap-2 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                        Resend code in <span className="font-mono text-azure">{timeLeft}s</span>
                    </span>
                </motion.div>
            ) : (
                <motion.button
                    onClick={onResend}
                    disabled={!canResend}
                    className={`
            flex items-center justify-center gap-2 text-sm mx-auto
            transition-all duration-200
            ${canResend
                            ? 'text-azure hover:text-cyan cursor-pointer'
                            : 'text-gray-500 cursor-not-allowed'
                        }
          `}
                    whileHover={canResend ? { scale: 1.05 } : {}}
                    whileTap={canResend ? { scale: 0.95 } : {}}
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend code</span>
                </motion.button>
            )}
        </div>
    );
};

// ============================================================================
// Expiry Timer Component
// ============================================================================

interface ExpiryTimerProps {
    expiresAt: number;
    onExpire: () => void;
}

const ExpiryTimer: React.FC<ExpiryTimerProps> = ({ expiresAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const hasExpiredRef = useRef(false);

    useEffect(() => {
        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
            setTimeLeft(remaining);

            if (remaining === 0 && !hasExpiredRef.current) {
                hasExpiredRef.current = true;
                onExpire();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isLow = timeLeft <= 60;

    return (
        <motion.div
            className={`
        flex items-center justify-center gap-2 text-sm
        ${isLow ? 'text-orange-400' : 'text-gray-400'}
      `}
            animate={isLow ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, repeat: isLow ? Infinity : 0 }}
        >
            <Clock className="w-4 h-4" />
            <span>
                Code expires in{' '}
                <span className="font-mono font-semibold">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </span>
        </motion.div>
    );
};

// ============================================================================
// Main OTP Modal Component
// ============================================================================

export const OTPModal: React.FC<OTPModalProps> = ({
    isOpen,
    email,
    onClose,
    onVerify,
    onResend,
    onSuccess,
    expiresAt: initialExpiresAt,
    initialCooldownUntil,
}) => {
    const [step, setStep] = useState<OTPModalStep>('input');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [attemptsRemaining, setAttemptsRemaining] = useState<number>(VERIFICATION_CONFIG.MAX_ATTEMPTS);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [expiresAt, setExpiresAt] = useState(initialExpiresAt || Date.now() + VERIFICATION_CONFIG.OTP_EXPIRY_MS);
    const [cooldownUntil, setCooldownUntil] = useState<number | null>(initialCooldownUntil || null);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setOtp('');
            setError(null);
            setIsVerifying(false);
            setIsResending(false);
            if (initialExpiresAt) setExpiresAt(initialExpiresAt);
            if (initialCooldownUntil) setCooldownUntil(initialCooldownUntil);
        }
    }, [isOpen, initialExpiresAt, initialCooldownUntil]);

    // Auto-verify when OTP is complete
    useEffect(() => {
        if (otp.length === VERIFICATION_CONFIG.OTP_LENGTH && !isVerifying && step === 'input') {
            handleVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    const handleVerify = async () => {
        if (otp.length !== VERIFICATION_CONFIG.OTP_LENGTH || isVerifying) return;

        setIsVerifying(true);
        setError(null);
        setStep('verifying');

        try {
            const result = await onVerify(otp);

            if (result.success) {
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                if (result.lockedUntil) {
                    setLockedUntil(result.lockedUntil);
                    setStep('locked');
                } else {
                    setStep('error');
                    setError(result.message);
                    if (result.attemptsRemaining !== undefined) {
                        setAttemptsRemaining(result.attemptsRemaining);
                    }
                    // Reset to input after showing error
                    setTimeout(() => {
                        setStep('input');
                        setOtp('');
                    }, 2000);
                }
            }
        } catch {
            setStep('error');
            setError('An unexpected error occurred. Please try again.');
            setTimeout(() => {
                setStep('input');
                setOtp('');
            }, 2000);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (isResending) return;

        setIsResending(true);
        setError(null);

        try {
            const result = await onResend();

            if (result.success) {
                setOtp('');
                setExpiresAt(Date.now() + VERIFICATION_CONFIG.OTP_EXPIRY_MS);
                setCooldownUntil(Date.now() + VERIFICATION_CONFIG.RESEND_COOLDOWN_MS);
                setAttemptsRemaining(VERIFICATION_CONFIG.MAX_ATTEMPTS);
            } else {
                setError(result.message);
                if (result.cooldownUntil) {
                    setCooldownUntil(result.cooldownUntil);
                }
            }
        } catch {
            setError('Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const handleExpire = useCallback(() => {
        setError('Verification code has expired.');
        setStep('error');
        setTimeout(() => {
            setStep('input');
        }, 2000);
    }, []);

    const handleClose = () => {
        if (!isVerifying) {
            onClose();
        }
    };

    // Masked email display
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, start, middle, end) => {
        return start + '*'.repeat(Math.min(middle.length, 5)) + end;
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-md glass-strong rounded-3xl overflow-hidden border border-white/10"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="relative p-6 pb-4 text-center border-b border-white/5">
                            <motion.button
                                onClick={handleClose}
                                disabled={isVerifying}
                                className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </motion.button>

                            <motion.div
                                className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center border border-azure/30"
                                animate={step === 'verifying' ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 2, repeat: step === 'verifying' ? Infinity : 0, ease: 'linear' }}
                            >
                                {step === 'success' ? (
                                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                                ) : step === 'error' ? (
                                    <AlertCircle className="w-8 h-8 text-red-400" />
                                ) : step === 'locked' ? (
                                    <Lock className="w-8 h-8 text-orange-400" />
                                ) : (
                                    <Shield className="w-8 h-8 text-azure" />
                                )}
                            </motion.div>

                            <h2 className="text-xl font-bold text-white mb-1">
                                {step === 'success' ? 'Verified!' : step === 'locked' ? 'Account Locked' : 'Verify Your Email'}
                            </h2>

                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                <Mail className="w-4 h-4" />
                                <span>{maskedEmail}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {step === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="text-center py-6"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                        </motion.div>
                                        <p className="text-green-400 font-semibold">Email verified successfully!</p>
                                        <p className="text-gray-400 text-sm mt-1">Redirecting...</p>
                                    </motion.div>
                                ) : step === 'locked' ? (
                                    <motion.div
                                        key="locked"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="text-center py-6"
                                    >
                                        <Lock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                                        <p className="text-orange-400 font-semibold">Too many failed attempts</p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Please try again in{' '}
                                            <span className="text-orange-400 font-mono">
                                                {lockedUntil ? Math.ceil((lockedUntil - Date.now()) / 60000) : 15} minutes
                                            </span>
                                        </p>
                                    </motion.div>
                                ) : step === 'verifying' ? (
                                    <motion.div
                                        key="verifying"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-8"
                                    >
                                        <Loader2 className="w-12 h-12 text-azure mx-auto animate-spin mb-4" />
                                        <p className="text-gray-400">Verifying your code...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="input"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <p className="text-gray-400 text-center text-sm">
                                            Enter the 6-digit code sent to your email
                                        </p>

                                        {/* OTP Input */}
                                        <OTPInput
                                            length={VERIFICATION_CONFIG.OTP_LENGTH}
                                            value={otp}
                                            onChange={setOtp}
                                            disabled={isVerifying}
                                            error={!!error}
                                        />

                                        {/* Error Message */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                                                >
                                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                                    <p className="text-sm text-red-400">{error}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Attempts Remaining */}
                                        {attemptsRemaining < VERIFICATION_CONFIG.MAX_ATTEMPTS && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center text-sm text-orange-400"
                                            >
                                                {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                                            </motion.p>
                                        )}

                                        {/* Expiry Timer */}
                                        <ExpiryTimer expiresAt={expiresAt} onExpire={handleExpire} />

                                        {/* Resend Button */}
                                        <ResendTimer
                                            cooldownUntil={cooldownUntil}
                                            onResend={handleResend}
                                            disabled={isVerifying}
                                            isResending={isResending}
                                        />

                                        {/* Verify Button */}
                                        <motion.button
                                            onClick={handleVerify}
                                            disabled={otp.length !== VERIFICATION_CONFIG.OTP_LENGTH || isVerifying}
                                            className={`
                        w-full py-3 rounded-xl font-semibold transition-all duration-200
                        ${otp.length === VERIFICATION_CONFIG.OTP_LENGTH && !isVerifying
                                                    ? 'bg-linear-to-r from-azure to-cyan text-white hover:shadow-lg hover:shadow-azure/30'
                                                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                }
                      `}
                                            whileHover={otp.length === VERIFICATION_CONFIG.OTP_LENGTH ? { scale: 1.02 } : {}}
                                            whileTap={otp.length === VERIFICATION_CONFIG.OTP_LENGTH ? { scale: 0.98 } : {}}
                                        >
                                            {isVerifying ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Verifying...
                                                </span>
                                            ) : (
                                                'Verify Code'
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-white/5 text-center">
                            <p className="text-xs text-gray-500">
                                Didn&apos;t receive the code? Check your spam folder
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OTPModal;
