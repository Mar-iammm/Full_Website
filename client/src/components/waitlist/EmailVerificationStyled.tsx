"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Mail,
    Ticket,
    AlertCircle,
    Shield,
    Sparkles,
    ArrowRight,
    Rocket,
    CheckCircle2
} from 'lucide-react';
import { OrbitalLogoSmall } from './Logo';
import { isUniversityEmail } from '../../utils/validation';
import SpotlightButton from './SpotlightButton';
import LoadingScreen from './LoadingScreen';
import OTPModal from './OTPModal';
import CountdownDisplay from './design/CountdownDisplay';
import {
    sendOTP,
    verifyOTP,
    resendOTP,
    VERIFICATION_CONFIG
} from '../../services/verificationApi';

interface EmailVerificationStyledProps {
    onVerificationSuccess: (
        email: string,
        referralCode: string | null
    ) => Promise<void>;
}

type VerificationStep = 'email-input' | 'otp-verification' | 'completing';

// Premium gradient ring background
const GradientOrb = React.memo(() => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Center multi-color glow */}
        <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-30"
            style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.2) 25%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)",
                filter: "blur(80px)",
            }}
        />
    </div>
));
GradientOrb.displayName = 'GradientOrb';

// Simple email hint component
const EmailHint: React.FC<{ email: string; isValid: boolean }> = React.memo(({ email, isValid }) => {
    if (!email || !email.includes('@')) {
        return (
            <p className="mt-2 text-[11px] sm:text-xs text-gray-500 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-azure" />
                <span className="opacity-80">Supported: .edu, .ac.uk, .ac.ae, .edu.au, .ac.nz</span>
            </p>
        );
    }

    return (
        <p className={`mt-2 text-[11px] sm:text-xs flex items-center gap-1.5 transition-colors ${isValid ? 'text-cyan' : 'text-gray-500'}`}>
            {isValid ? (
                <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Valid academic email</span>
                </>
            ) : (
                <>
                    <Shield className="w-3 h-3 text-azure" />
                    <span className="opacity-80">Supported: .edu, .ac.uk, .ac.ae, .edu.au, .ac.nz</span>
                </>
            )}
        </p>
    );
});
EmailHint.displayName = 'EmailHint';

export default function EmailVerificationStyled({
    onVerificationSuccess,
}: EmailVerificationStyledProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<VerificationStep>('email-input');
    const [isLoading, setIsLoading] = useState(false);
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpExpiresAt, setOtpExpiresAt] = useState<number | undefined>();
    const [otpCooldownUntil, setOtpCooldownUntil] = useState<
        number | undefined
    >();

    const isEmailValid = useMemo(() => isUniversityEmail(email), [email]);

    // Disable custom cursor on this page
    useEffect(() => {
        document.body.style.cursor = 'auto';
        // Target the custom cursor component container (has z-9999 class)
        const cursorContainer = document.querySelector('.z-9999');

        if (cursorContainer instanceof HTMLElement) {
            cursorContainer.style.display = 'none';
        }

        return () => {
            document.body.style.cursor = "";
            if (cursorContainer instanceof HTMLElement) {
                cursorContainer.style.display = "";
            }
        };
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    }, []);

    const handleReferralChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setReferralCode(e.target.value.toUpperCase());
        },
        []
    );

    const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!isEmailValid) {
            setError(
                "Please use a valid university email (.edu, .ac.uk, .ac.ae, etc.)"
            );
            return;
        }

        setIsLoading(true);

        try {
            const result = await sendOTP({ email: email.trim().toLowerCase() });

            if (result.success) {
                setStep("otp-verification");
                setOtpExpiresAt(result.expiresAt);
                setOtpCooldownUntil(
                    Date.now() + VERIFICATION_CONFIG.RESEND_COOLDOWN_MS
                );
                setShowOTPModal(true);
            } else {
                if (result.cooldownUntil) {
                    const waitSeconds = Math.ceil(
                        (result.cooldownUntil - Date.now()) / 1000
                    );
                    setError(
                        `Please wait ${waitSeconds}s before requesting another code.`
                    );
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to send code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }, [email, isEmailValid]);

    const handleOTPVerify = useCallback(async (otp: string) => {
        return await verifyOTP({ email: email.trim().toLowerCase(), otp });
    }, [email]);

    const handleOTPResend = useCallback(async () => {
        const result = await resendOTP({
            email: email.trim().toLowerCase(),
        });
        if (result.expiresAt) setOtpExpiresAt(result.expiresAt);
        if (result.cooldownUntil) setOtpCooldownUntil(result.cooldownUntil);
        return result;
    }, [email]);

    const handleVerificationSuccess = useCallback(async () => {
        setShowOTPModal(false);
        setStep("completing");
        setShowLoadingScreen(true);
    }, []);

    const handleLoadingComplete = useCallback(async () => {
        try {
            await onVerificationSuccess(
                email.trim().toLowerCase(),
                referralCode || null
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setShowLoadingScreen(false);
            setStep("email-input");
            setIsLoading(false);
        }
    }, [email, referralCode, onVerificationSuccess]);

    const handleOTPModalClose = useCallback(() => {
        setShowOTPModal(false);
        setStep("email-input");
        setError("");
    }, []);

    return (
        <>
            <LoadingScreen isVisible={showLoadingScreen} onComplete={handleLoadingComplete} />
            <OTPModal
                isOpen={showOTPModal}
                email={email}
                onClose={handleOTPModalClose}
                onVerify={handleOTPVerify}
                onResend={handleOTPResend}
                onSuccess={handleVerificationSuccess}
                expiresAt={otpExpiresAt}
                initialCooldownUntil={otpCooldownUntil}
            />

            {/* Main verification screen */}
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden bg-black cursor-auto">
                {/* Gradient rings background */}
                <GradientOrb />

                {/* Main content */}
                <motion.div
                    className="w-full max-w-[480px] relative z-30"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        {/* Logo icon */}
                        <motion.div
                            className="mb-6 flex justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <OrbitalLogoSmall className="w-20 h-20" />
                            </motion.div>
                        </motion.div>

                        {/* Metallic gradient title - inspired by reference */}
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                background: "linear-gradient(180deg, #FFFFFF 0%, #D0D0D0 30%, #909090 70%, #505050 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                textShadow: "0px 2px 4px rgba(255, 255, 255, 0.3), 0px 6px 16px rgba(0, 0, 0, 0.7)",
                                letterSpacing: "0.02em",
                                filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.4))"
                            }}
                        >
                            JOIN THE
                            <br />
                            WAITLIST
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-base sm:text-lg text-neutral-400 max-w-md mx-auto font-normal"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Get exclusive early access and never pay full price again
                        </motion.p>
                    </div>

                    {/* Waitlist card with animated gradient border */}
                    <motion.div
                        className="relative rounded-3xl overflow-visible z-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {/* Orbit rings - 2 rings total for cleaner look */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            {/* Outer ring */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full animate-pulse-slow"
                                style={{
                                    background: "conic-gradient(from 0deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 25%, rgba(251, 146, 60, 0.25) 50%, rgba(59, 130, 246, 0.3) 75%, rgba(139, 92, 246, 0.3) 100%)",
                                    WebkitMaskImage: "radial-gradient(circle, transparent calc(50% - 2px), black 50%)",
                                    maskImage: "radial-gradient(circle, transparent calc(50% - 2px), black 50%)",
                                    filter: "blur(3px)"
                                }}
                            />
                            {/* Inner ring */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-pulse-slow"
                                style={{
                                    animationDelay: "1.5s",
                                    background: "conic-gradient(from 180deg, rgba(59, 130, 246, 0.5) 0%, rgba(139, 92, 246, 0.5) 33%, rgba(236, 72, 153, 0.5) 66%, rgba(59, 130, 246, 0.5) 100%)",
                                    WebkitMaskImage: "radial-gradient(circle, transparent calc(50% - 2px), black 50%)",
                                    maskImage: "radial-gradient(circle, transparent calc(50% - 2px), black 50%)",
                                    filter: "blur(3px)"
                                }}
                            />
                        </div>

                        {/* Animated gradient border orbit */}
                        <div className="absolute -inset-[2px] rounded-3xl opacity-80">
                            <motion.div
                                className="absolute inset-0 rounded-3xl"
                                style={{
                                    background: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 18%, #FB923C 35%, #3B82F6 52%, #06B6D4 68%, #FB923C 85%, #8B5CF6 100%)",
                                    backgroundSize: "300% 300%"
                                }}
                                animate={{
                                    backgroundPosition: ["0% 50%", "300% 50%"]
                                }}
                                transition={{
                                    duration: 4,
                                    ease: "linear",
                                    repeat: Infinity
                                }}
                            />
                            {/* Soft multi-color glow effect */}
                            <div className="absolute inset-0 rounded-3xl blur-lg" style={{
                                background: "linear-gradient(90deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 20%, rgba(251, 146, 60, 0.35) 40%, rgba(59, 130, 246, 0.4) 60%, rgba(251, 146, 60, 0.35) 80%, rgba(139, 92, 246, 0.4) 100%)"
                            }} />
                        </div>

                        {/* Card content */}
                        <div className="relative bg-black rounded-3xl border-2 border-transparent z-10">
                            {/* Countdown */}
                            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5">
                                <p className="text-center text-xs uppercase tracking-widest text-gray-400 mb-4">
                                    Launch Countdown
                                </p>
                                <CountdownDisplay />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mx-6" />

                            {/* Form */}
                            <form onSubmit={handleEmailSubmit} className="px-6 sm:px-8 py-6 space-y-5">
                                {/* Email field */}
                                <div>
                                    <label htmlFor="email" className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                                        University Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border text-neutral-200 placeholder-neutral-600 text-sm transition-all focus:outline-none focus:bg-white/10 ${isEmailValid && email
                                                    ? "border-purple-500/40 focus:border-purple-500/60 shadow-lg shadow-purple-500/10"
                                                    : "border-white/10 focus:border-blue-400/40"
                                                }`}
                                            placeholder="student@university.edu"
                                            required
                                            disabled={isLoading}
                                        />
                                        {isEmailValid && email && (
                                            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                        )}
                                    </div>
                                    <EmailHint email={email} isValid={isEmailValid} />
                                </div>

                                {/* Referral code field */}
                                <div>
                                    <label htmlFor="referral" className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                                        Referral Code <span className="text-neutral-700 normal-case font-normal">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            id="referral"
                                            value={referralCode}
                                            onChange={handleReferralChange}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/40 focus:outline-none focus:bg-white/10 transition-all text-neutral-200 placeholder-neutral-600 uppercase tracking-wider font-mono text-sm"
                                            placeholder="ABC12345"
                                            maxLength={8}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>Skip the line with a referral code</span>
                                    </p>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="flex items-start gap-2 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10">
                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-300">{error}</p>
                                    </div>
                                )}

                                {/* Submit button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold text-base uppercase tracking-wide shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                        ) : (
                                            "JOIN THE WAITLIST"
                                        )}
                                    </button>
                                </div>

                                <p className="text-center text-xs text-neutral-600">
                                    We will send a 6-digit verification code to your email
                                </p>
                            </form>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/5 text-center">
                                <p className="text-[10px] text-neutral-700">
                                    By joining, you agree to our verification process
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Security badge */}
                    <div className="mt-6 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                            <Shield className="w-4 h-4 text-purple-400" />
                            <p className="text-neutral-400 text-xs">
                                Secure • Encrypted • Anti-fraud protected
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
