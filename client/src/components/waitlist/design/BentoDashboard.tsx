"use client";

import React, { memo, useCallback, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Copy, Check, Crown, Sparkles, Rocket, Lock } from "lucide-react";
import RadarVisual from "./RadarVisual";
import ChipSlots from "./ChipSlots";
import QueueVisualization from "../QueueVisualization";
import HolographicPlanet from "./HolographicPlanet";
import type { ReferralStats } from "../../services/api";

interface BentoDashboardProps {
    queuePosition: number;
    totalUsers?: number;
    referralStats: ReferralStats;
    referralCode: string;
}

// Stagger animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

// Memoized BentoCard component with animated gradient border
const BentoCard = memo(({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative rounded-3xl overflow-visible ${className}`}
        >
            {/* Card content with ultra-thin gradient border */}
            <div className="relative bg-black rounded-3xl p-5 sm:p-6 lg:p-8 border-[0.5px] border-transparent bg-clip-padding" style={{
                backgroundImage: 'linear-gradient(black, black), linear-gradient(90deg, #3B82F6 0%, #EC4899 20%, #8B5CF6 40%, #FB923C 60%, #F59E0B 80%, #3B82F6 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
            }}>
                {children}
            </div>
        </motion.div>
    );
});
BentoCard.displayName = "BentoCard";

// Social link component with animated border
const SocialLink = memo(({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black border-[0.5px] flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
        style={{
            backgroundImage: 'linear-gradient(black, black), linear-gradient(90deg, #3B82F6 0%, #EC4899 20%, #8B5CF6 40%, #FB923C 60%, #F59E0B 80%, #3B82F6 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
        }}
        whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(41, 98, 255, 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        aria-label={label}
    >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
        <motion.div
            className="absolute inset-0 rounded-full bg-azure/20"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
        />
    </motion.a>
));
SocialLink.displayName = "SocialLink";

// Instagram icon
const InstagramIcon = () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

// LinkedIn icon
const LinkedInIcon = () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// X icon
const XIcon = () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function BentoDashboard({ queuePosition, totalUsers = 1000, referralStats, referralCode }: BentoDashboardProps) {
    const [copied, setCopied] = useState(false);
    const referralLink = `studentverse.io/ref/u/${referralCode}`;

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [referralLink]);

    return (
        <motion.div
            id="sv_bento-dashboard"
            className="min-h-screen flex items-center justify-center px-4 py-6 sm:p-6 relative"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-6xl w-full relative z-10">
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

                    {/* Card 1: Queue Position - Large Feature Card */}
                    <BentoCard className="lg:col-span-2">
                        <div className="text-center">
                            <motion.p
                                className="text-gray-400 mb-3 font-mono text-xs sm:text-sm uppercase tracking-[0.2em]"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Queue Position
                            </motion.p>

                            {/* Animated Queue Number */}
                            <motion.div
                                className="relative inline-block"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                            >
                                <motion.span
                                    className="text-5xl sm:text-6xl lg:text-8xl font-black font-display block"
                                    style={{
                                        background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))",
                                    }}
                                    animate={{
                                        filter: [
                                            "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
                                            "drop-shadow(0 0 40px rgba(59, 130, 246, 0.6))",
                                            "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    #{queuePosition.toLocaleString()}
                                </motion.span>
                            </motion.div>

                            {/* Radar Visual */}
                            <motion.div
                                className="flex justify-center mt-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <RadarVisual size="md" />
                            </motion.div>
                        </div>
                    </BentoCard>

                    {/* Card 2: Pro Membership Unlock */}
                    <BentoCard className="lg:row-span-2">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Crown className="w-5 h-5 text-gold" />
                                <h3 className="font-display text-lg sm:text-xl font-bold text-white">UNLOCK PRO</h3>
                            </div>

                            <p className="text-gray-400 mb-5 text-sm leading-relaxed">
                                Refer <span className="text-gold font-semibold">5 students</span> to unlock
                                <span className="text-cyan font-semibold"> 1 month free</span> SV Pro membership
                            </p>

                            <ChipSlots
                                total={5}
                                filled={referralStats.count}
                                labels={["REFERRAL 1", "LOCKED", "LOCKED", "LOCKED", "LOCKED"]}
                            />

                            {/* Progress indicator */}
                            <div className="mt-5 mb-4">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="text-gold font-mono">{referralStats.count}/5</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-linear-to-r from-gold to-orange-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(referralStats.count / 5) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            <motion.div
                                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Lock className="w-4 h-4 text-gold" />
                                <span className="text-gold">PRO STATUS: LOCKED</span>
                            </motion.div>
                        </motion.div>
                    </BentoCard>

                    {/* Card 3: SV Orbit AI */}
                    <BentoCard className="lg:col-span-2">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <motion.div
                                className="shrink-0"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <HolographicPlanet size="md" />
                            </motion.div>
                            <div className="text-center sm:text-left flex-1">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-violet" />
                                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">SV Orbit AI</h3>
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base mb-3">
                                    Tell me your vibe. I&apos;ll plan the night.
                                </p>
                                <motion.div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/30"
                                    animate={{
                                        boxShadow: [
                                            "0 0 0 rgba(123, 44, 191, 0)",
                                            "0 0 20px rgba(123, 44, 191, 0.3)",
                                            "0 0 0 rgba(123, 44, 191, 0)",
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-violet"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    <span className="text-violet text-xs font-mono uppercase tracking-wider">System Loading...</span>
                                </motion.div>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* Referral Link Section */}
                <motion.div
                    className="mt-6"
                    variants={cardVariants}
                >
                    <h4 className="font-semibold mb-3 text-gray-400 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-cyan" />
                        Your Referral Link
                    </h4>
                    <div className="bg-black rounded-xl border-[0.5px] p-4 sm:p-5" style={{
                        backgroundImage: 'linear-gradient(black, black), linear-gradient(90deg, #3B82F6 0%, #EC4899 20%, #8B5CF6 40%, #FB923C 60%, #F59E0B 80%, #3B82F6 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box'
                    }}>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <motion.div
                                className="font-mono text-purple-400 text-sm sm:text-base break-all"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {referralLink}
                            </motion.div>
                            <motion.button
                                onClick={handleCopyLink}
                                className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:shadow-xl hover:shadow-purple-500/60 text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 text-sm sm:text-base overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.span
                                            key="copied"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="copy"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy Link
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    className="flex justify-center gap-4 mt-6"
                    variants={cardVariants}
                >
                    <SocialLink href="https://instagram.com/studentverse.ae" icon={InstagramIcon} label="Instagram" />
                    <SocialLink href="https://linkedin.com/company/studentverse.ae" icon={LinkedInIcon} label="LinkedIn" />
                    <SocialLink href="https://x.com/studentverse.ae" icon={XIcon} label="X (Twitter)" />
                </motion.div>

                {/* Launch Target */}
                <motion.div
                    className="text-center mt-6"
                    variants={cardVariants}
                >
                    <motion.p
                        className="text-gray-400 font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Rocket className="w-4 h-4 text-purple-400" />
                        Launch Target: March 1st, 2026
                    </motion.p>
                </motion.div>

                {/* Queue Visualization */}
                <motion.div
                    className="mt-6"
                    variants={cardVariants}
                >
                    <QueueVisualization
                        currentPosition={queuePosition}
                        totalUsers={totalUsers}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
