import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Home, ChevronLeft } from "lucide-react";
import VelocityWeave from "./design/VelocityWeave";
import Navbar from "./design/Navbar";
import BentoDashboard from "./design/BentoDashboard";
import type { User, QueueStats, ReferralStats } from "../../services/api";

interface DashboardStyledProps {
    user: User;
    onLogout: () => void;
    queueStats: QueueStats;
    referralStats: ReferralStats;
}

const DashboardStyled = React.memo(function DashboardStyled({
    user,
    onLogout,
    queueStats,
    referralStats
}: DashboardStyledProps) {
    // Calculate total users using original logic to ensure valid numbers
    const totalUsers = Math.max(queueStats.position + 500, 1000);

    const navigate = useNavigate();

    const handleHomeClick = useCallback(() => navigate('/'), [navigate]);

    return (
        <div className="min-h-screen relative overflow-hidden pb-16 bg-black">
            <VelocityWeave variant="dual" />
            <Navbar />

            {/* Navigation buttons */}
            <div className="fixed top-20 sm:top-24 left-0 right-0 z-40 flex justify-between items-center px-4 sm:px-6 lg:px-8">
                <motion.button
                    onClick={handleHomeClick}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-white/80 hover:text-white transition-all border border-white/10 text-xs sm:text-sm backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-azure/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(41, 98, 255, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Home</span>
                </motion.button>

                <motion.button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-white/80 hover:text-red-300 transition-all border border-white/10 text-xs sm:text-sm backdrop-blur-xl bg-white/5 hover:bg-red-500/10 hover:border-red-400/30 group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:text-red-400 transition-colors" />
                    <span className="hidden sm:inline">Logout</span>
                </motion.button>
            </div>

            {/* Main content */}
            <motion.div
                className="pt-12 sm:pt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <BentoDashboard
                    queuePosition={queueStats.position}
                    totalUsers={totalUsers}
                    referralStats={referralStats}
                    referralCode={referralStats.code}
                />
            </motion.div>
        </div>
    );
});

export default DashboardStyled;
