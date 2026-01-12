"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RadarVisual from './design/RadarVisual';
import { Users, TrendingDown, Sparkles, Zap, Crown, Star } from 'lucide-react';

interface QueueVisualizationProps {
    currentPosition: number;
    totalUsers: number;
    className?: string;
}

// Animated number counter component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setDisplayValue(Math.floor(startValue + (value - startValue) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [value, duration]);

    return <span>{displayValue.toLocaleString()}</span>;
};

// Simplified Card wrapper
const Card3DWrapper = ({
    children,
    className = "",
    glowColor = "rgba(41, 98, 255, 0.3)"
}: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const QueueVisualization: React.FC<QueueVisualizationProps> = ({
    currentPosition,
    totalUsers,
    className = ''
}) => {
    const percentage = ((totalUsers - currentPosition + 1) / totalUsers) * 100;
    const topPercentile = Math.ceil((currentPosition / totalUsers) * 100);
    const [showCelebration, setShowCelebration] = useState(false);

    // Generate deterministic confetti positions using useMemo
    const confettiPositions = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            initialX: ((i * 47.3 + 12.5) % 400) - 200,
            finalX: ((i * 53.7 + 31.2) % 400) - 200,
            leftPosition: (i * 37.5 + 27.5) % 100,
            rotate: (i % 2 === 0 ? 1 : -1),
            duration: 2 + ((i * 13.7) % 100) / 100,
            colorIndex: i % 4,
        }));
    }, []);

    useEffect(() => {
        // Show celebration if user is in top 10%
        if (topPercentile <= 10) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [topPercentile]);

    const generateDots = () => {
        const dots = [];
        const maxDots = Math.min(totalUsers, 50);
        const interval = Math.ceil(totalUsers / maxDots);

        for (let i = 0; i < maxDots; i++) {
            const position = i * interval + 1;
            const isCurrent = Math.abs(position - currentPosition) < interval;
            dots.push(
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                    whileHover={{
                        scale: 1.5,
                        boxShadow: isCurrent ? "0 0 20px rgba(41, 98, 255, 0.8)" : "0 0 15px rgba(0, 240, 255, 0.5)"
                    }}
                    style={
                        isCurrent
                            ? {
                                background: '#FFB800',
                                boxShadow: '0 0 10px rgba(255, 184, 0, 0.5)',
                            }
                            : position < currentPosition
                                ? {
                                    background: 'linear-gradient(to right, #00F0FF, #2962FF)',
                                }
                                : {
                                    background: 'rgba(255, 255, 255, 0.3)',
                                }
                    }
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 cursor-pointer relative ${isCurrent
                            ? 'scale-150'
                            : position < currentPosition
                                ? ''
                                : ''
                        }`}
                    title={`Position ${position}`}
                >
                    {/* Pulse ring for current position */}
                    {isCurrent && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gold"
                            animate={{
                                scale: [1, 2, 1],
                                opacity: [0.8, 0, 0.8],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )}
                </motion.div>
            );
        }

        return dots;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`glass-strong rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-10 relative overflow-hidden border border-white/20 backdrop-blur-xl shadow-2xl ${className}`}
        >
            {/* Celebration confetti */}
            <AnimatePresence>
                {showCelebration && (
                    <>
                        {confettiPositions.map((confetti, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    y: -20,
                                    x: confetti.initialX,
                                    opacity: 1,
                                    rotate: 0
                                }}
                                animate={{
                                    y: 400,
                                    x: confetti.finalX,
                                    opacity: 0,
                                    rotate: 360 * confetti.rotate
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: confetti.duration, delay: i * 0.05 }}
                                className={`absolute w-2 h-2 rounded-sm ${['bg-azure', 'bg-cyan', 'bg-gold', 'bg-violet'][confetti.colorIndex]
                                    }`}
                                style={{ left: `${confetti.leftPosition}%` }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Static background glow */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: 'radial-gradient(circle at 30% 40%, rgba(41, 98, 255, 0.3), transparent 50%)',
                }}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
                <motion.h2
                    className="text-xl md:text-2xl font-bold text-white font-display flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Crown className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                    Queue Position
                </motion.h2>
                <motion.div
                    className="flex items-center gap-2 glass px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-azure/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(41, 98, 255, 0.4)" }}
                >
                    <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-azure" />
                    <span className="text-azure font-semibold text-sm md:text-base">
                        Top {topPercentile}%
                    </span>
                    {topPercentile <= 10 && (
                        <Star className="w-4 h-4 text-gold fill-gold" />
                    )}
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 md:mb-8 relative z-10">
                <div className="flex justify-between mb-2">
                    <span className="text-xs md:text-sm font-semibold text-gray-400">Your Progress</span>
                    <motion.span
                        className="text-xs md:text-sm font-bold gradient-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {percentage.toFixed(1)}%
                    </motion.span>
                </div>
                <div className="h-4 md:h-5 bg-white/10 rounded-full overflow-hidden border border-white/20 relative shadow-inner">
                    <motion.div
                        className="h-full relative"
                        style={{
                            background: 'linear-gradient(90deg, #00F0FF 0%, #2962FF 50%, #7B2CBF 100%)'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                    </motion.div>
                    {/* Progress marker */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg"
                        initial={{ left: 0 }}
                        animate={{ left: `${Math.max(percentage - 1, 0)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full bg-azure"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Dot Visualization */}
            <div className="mb-6 relative z-10">
                <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-cyan" />
                    Queue Visualization
                    <motion.span
                        className="text-xs text-gray-500 font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        (hover to explore)
                    </motion.span>
                </h3>
                <Card3DWrapper className="p-4 md:p-6 glass-strong rounded-xl border border-white/20 backdrop-blur-xl shadow-lg">
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        {generateDots()}
                    </div>
                </Card3DWrapper>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm mb-6 md:mb-8 relative z-10">
                {[
                    { bgStyle: { background: 'linear-gradient(to right, #00F0FF, #2962FF)' }, label: 'Ahead of you', ring: false },
                    { bgStyle: { background: '#FFB800' }, label: 'Your position', ring: true },
                    { bgStyle: { background: 'rgba(255, 255, 255, 0.3)' }, label: 'Behind you', ring: false },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                    >
                        <motion.div
                            style={item.bgStyle}
                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${item.ring ? 'ring-4 ring-azure/30' : ''}`}
                            whileHover={{ scale: 1.3 }}
                        />
                        <span className="text-gray-400">{item.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Raw Data Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-4 md:mb-6 relative z-10"
            >
                <h3 className="text-sm md:text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet" />
                    Queue Statistics
                </h3>
                <div className="glass-strong rounded-lg md:rounded-xl border border-white/20 backdrop-blur-xl shadow-lg overflow-hidden">
                    <table className="w-full text-xs md:text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-gray-400 font-medium">Metric</th>
                                <th className="text-right py-2 md:py-3 px-3 md:px-4 text-gray-400 font-medium">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 md:py-3 px-3 md:px-4 text-white">Your Position</td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-right font-mono text-azure font-bold">#{currentPosition.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 md:py-3 px-3 md:px-4 text-white">Total in Queue</td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-right font-mono text-cyan">{totalUsers.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 md:py-3 px-3 md:px-4 text-white">People Behind You</td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-right font-mono text-gold">{(totalUsers - currentPosition).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 md:py-3 px-3 md:px-4 text-white">People Ahead</td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-right font-mono text-white/70">{(currentPosition - 1).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 md:py-3 px-3 md:px-4 text-white">Top Percentile</td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-right font-mono text-violet">{topPercentile}%</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="py-2 md:py-3 px-3 md:px-4 text-white">Progress</td>
                                <td className="py-2 md:py-3 px-3 md:px-4 text-right font-mono gradient-text font-bold">{percentage.toFixed(2)}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 relative z-10">
                {[
                    { label: 'Your Position', value: currentPosition, prefix: '#', color: 'azure', icon: Crown },
                    { label: 'Behind You', value: totalUsers - currentPosition, prefix: '', color: 'cyan', icon: Users },
                    { label: 'Total Queue', value: totalUsers, prefix: '', color: 'violet', icon: Zap },
                ].map((stat, i) => (
                    <Card3DWrapper
                        key={i}
                        glowColor={`rgba(${stat.color === 'azure' ? '41, 98, 255' : stat.color === 'cyan' ? '0, 240, 255' : '123, 44, 191'}, 0.3)`}
                    >
                        <motion.div
                            className={`text-center p-4 md:p-5 glass-strong rounded-xl border border-${stat.color}/40 backdrop-blur-xl shadow-lg`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            whileHover={{ scale: 1.08, boxShadow: `0 0 35px rgba(${stat.color === 'azure' ? '41, 98, 255' : stat.color === 'cyan' ? '0, 240, 255' : '123, 44, 191'}, 0.5)` }}
                        >
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <stat.icon className={`w-3 h-3 text-${stat.color}`} />
                                <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                            </div>
                            <p className={`text-xl md:text-2xl font-bold ${stat.color === 'azure' ? 'gradient-text' : `text-${stat.color}`}`}>
                                {stat.prefix}<AnimatedCounter value={stat.value} />
                            </p>
                        </motion.div>
                    </Card3DWrapper>
                ))}
            </div>

            {/* Radar Visual Section - Commented Out */}
            {/* <div className="mb-6 relative z-10">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan" />
          Live Queue Radar
        </h3>
        <Card3DWrapper className="p-6 md:p-8 glass-strong rounded-xl border border-white/20 backdrop-blur-xl shadow-lg flex justify-center">
          <RadarVisual 
            size="lg"
            blips={[
              { x: 50, y: 50, color: 'gold' },
              { x: 30, y: 40, color: 'cyan' },
              { x: 70, y: 60, color: 'cyan' },
              { x: 45, y: 70, color: 'red' },
            ]}
          />
        </Card3DWrapper>
      </div> */}
        </motion.div>
    );
};

export default QueueVisualization;
