"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, CheckCircle2, Zap, Gift, Star, Sparkles, Rocket } from 'lucide-react';
import { REFERRAL_MILESTONES } from '../../utils/constants';

interface ReferralProgressProps {
    referralCount: number;
    className?: string;
}

// Animated number
const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(value * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [value]);

    return <span>{displayValue}</span>;
};

// Simplified Card component
const Card3D = ({
    children,
    className = "",
    glowColor = "rgba(255, 184, 0, 0.3)"
}: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const ReferralProgress: React.FC<ReferralProgressProps> = ({
    referralCount,
    className = ''
}) => {
    const milestones = REFERRAL_MILESTONES;
    const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

    const nextMilestone = milestones.find(m => m.count > referralCount) || milestones[milestones.length - 1];
    const currentMilestoneIndex = milestones.findIndex(m => m.count > referralCount);
    const progress = Math.min((referralCount / nextMilestone.count) * 100, 100);

    const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; rgb: string }> = {
        azure: {
            bg: 'bg-azure/10',
            border: 'border-azure/30',
            text: 'text-azure',
            glow: 'shadow-[0_0_30px_rgba(41,98,255,0.4)]',
            rgb: '41, 98, 255'
        },
        cyan: {
            bg: 'bg-cyan/10',
            border: 'border-cyan/30',
            text: 'text-cyan',
            glow: 'shadow-[0_0_30px_rgba(0,240,255,0.4)]',
            rgb: '0, 240, 255'
        },
        violet: {
            bg: 'bg-violet/10',
            border: 'border-violet/30',
            text: 'text-violet',
            glow: 'shadow-[0_0_30px_rgba(123,44,191,0.4)]',
            rgb: '123, 44, 191'
        },
        gold: {
            bg: 'bg-gold/10',
            border: 'border-gold/30',
            text: 'text-gold',
            glow: 'shadow-[0_0_30px_rgba(255,184,0,0.4)]',
            rgb: '255, 184, 0'
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`glass-strong rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-10 relative overflow-hidden border border-white/20 backdrop-blur-xl shadow-2xl ${className}`}
        >
            {/* Static background gradient */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 184, 0, 0.3), transparent 50%)',
                }}
            />

            {/* Static particles */}
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full opacity-40 ${['bg-gold', 'bg-azure', 'bg-cyan'][i]}`}
                    style={{
                        left: `${20 + i * 30}%`,
                        top: `${25 + (i % 2) * 30}%`,
                    }}
                />
            ))}

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-4 md:mb-6 relative z-10">
                <motion.h2
                    className="text-base md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 font-display"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gold" />
                    <span className="hidden sm:inline">Referral Milestones</span>
                    <span className="sm:hidden">Referrals</span>
                </motion.h2>
                <motion.div
                    className="flex items-center gap-1.5 md:gap-2 glass-strong px-2.5 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-full border border-gold/50 backdrop-blur-xl shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                    <Target className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-gold" />
                    <span className="text-gold font-semibold text-xs md:text-sm lg:text-base">
                        <AnimatedNumber value={referralCount} /> / {nextMilestone.count}
                    </span>
                </motion.div>
            </div>

            {/* Progress Bar with enhanced animation */}
            <div className="mb-6 md:mb-8 relative z-10">
                <div className="h-6 md:h-7 bg-white/10 rounded-full overflow-hidden mb-3 relative">
                    {/* Outer animated gradient border */}
                    <div className="absolute -inset-[1px] rounded-full overflow-hidden">
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: "linear-gradient(90deg, #3B82F6 0%, #EC4899 20%, #8B5CF6 40%, #FB923C 60%, #F59E0B 80%, #3B82F6 100%)",
                                backgroundSize: "200% 200%"
                            }}
                            animate={{
                                backgroundPosition: ["0% 50%", "200% 50%"]
                            }}
                            transition={{
                                duration: 8,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                    </div>

                    {/* Inner background */}
                    <div className="absolute inset-0 bg-white/10 rounded-full"></div>

                    {/* Animated progress fill with 4-color gradient */}
                    <motion.div
                        className="h-full flex items-center justify-end pr-3 relative rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${progress}%`
                        }}
                        transition={{
                            width: { duration: 1.5, ease: "easeOut" }
                        }}
                    >
                        {/* Animated gradient background for progress bar */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, #3B82F6 0%, #EC4899 20%, #8B5CF6 40%, #FB923C 60%, #F59E0B 80%, #3B82F6 100%)",
                                backgroundSize: "200% 100%"
                            }}
                            animate={{
                                backgroundPosition: ["0% 50%", "200% 50%"]
                            }}
                            transition={{
                                duration: 8,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        />
                        {/* Subtle shimmer - runs once on mount */}
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 1.5, delay: 1 }}
                        />
                        {progress > 25 && (
                            <span className="text-xs font-bold text-white relative z-20">
                                {Math.round(progress)}%
                            </span>
                        )}
                    </motion.div>

                    {/* Milestone markers on progress bar */}
                    {milestones.map((m, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                            style={{ left: `${(m.count / milestones[milestones.length - 1].count) * 100}%` }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        />
                    ))}
                </div>

                <motion.p
                    className="text-sm text-gray-400 flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Zap className="w-4 h-4 text-gold" />
                    {nextMilestone.count - referralCount > 0
                        ? <>
                            <span className="font-semibold text-white">{nextMilestone.count - referralCount}</span> more referral{nextMilestone.count - referralCount !== 1 ? 's' : ''} to unlock:
                            <span className="text-gold font-semibold">{nextMilestone.reward}</span>
                        </>
                        : <span className="text-gold">All milestones unlocked! 🎉</span>
                    }
                </motion.p>
            </div>

            {/* Milestone Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 relative z-10">
                {milestones.map((milestone, index) => {
                    const achieved = referralCount >= milestone.count;
                    const colors = colorMap[milestone.color] || colorMap.azure;
                    const isNext = !achieved && milestones.findIndex(m => m.count > referralCount) === index;

                    return (
                        <Card3D
                            key={index}
                            glowColor={`rgba(${colors.rgb}, 0.3)`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                    boxShadow: achieved ? `0 20px 40px -10px rgba(${colors.rgb}, 0.5)` : undefined
                                }}
                                className={`relative p-4 md:p-5 rounded-xl border-2 transition-all overflow-hidden ${achieved
                                        ? `${colors.border} ${colors.bg}`
                                        : isNext
                                            ? 'border-white/30 bg-white/10'
                                            : 'border-white/10 bg-white/5'
                                    }`}
                            >
                                {/* Animated background for achieved */}
                                {achieved && (
                                    <motion.div
                                        className="absolute inset-0 opacity-30"
                                        animate={{
                                            background: [
                                                `radial-gradient(circle at 0% 0%, rgba(${colors.rgb}, 0.4), transparent 70%)`,
                                                `radial-gradient(circle at 100% 100%, rgba(${colors.rgb}, 0.4), transparent 70%)`,
                                                `radial-gradient(circle at 0% 0%, rgba(${colors.rgb}, 0.4), transparent 70%)`,
                                            ],
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    />
                                )}

                                {/* Pulsing border for next milestone */}
                                {isNext && (
                                    <motion.div
                                        className="absolute inset-0 rounded-xl border-2 border-white/50"
                                        animate={{
                                            opacity: [0.3, 0.8, 0.3],
                                            scale: [1, 1.02, 1],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}

                                {/* Achieved Badge */}
                                <AnimatePresence>
                                    {achieved && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
                                            className={`absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 ${colors.bg} border ${colors.border} rounded-full flex items-center justify-center z-20`}
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 ${colors.text}`} />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Count Badge */}
                                <motion.div
                                    className={`relative inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full ${colors.bg} border ${colors.border} ${colors.text} font-bold text-lg md:text-xl mb-3`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Glow ring for achieved */}
                                    {achieved && (
                                        <motion.div
                                            className={`absolute inset-0 rounded-full border-2 ${colors.border}`}
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.8, 0, 0.8],
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                    <span className="relative z-10">{milestone.count}</span>
                                </motion.div>

                                <p className={`text-xs md:text-sm font-semibold ${achieved ? colors.text : 'text-gray-400'} relative z-10`}>
                                    {milestone.reward}
                                </p>

                                {!achieved && (
                                    <motion.p
                                        className="text-xs text-gray-500 mt-2 font-mono flex items-center gap-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <Gift className="w-3 h-3" />
                                        {milestone.count - referralCount} more
                                    </motion.p>
                                )}

                                {/* "NEXT" indicator */}
                                {isNext && (
                                    <motion.div
                                        className="absolute top-2 left-2 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold text-white"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        NEXT
                                    </motion.div>
                                )}
                            </motion.div>
                        </Card3D>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default ReferralProgress;
