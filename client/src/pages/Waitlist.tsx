import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import EmailVerificationStyled from "../components/waitlist/EmailVerificationStyled";
import DashboardStyled from "../components/waitlist/DashboardStyled";

// Loading component
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
        >
            <motion.div
                className="w-16 h-16 border-4 border-azure/30 border-t-azure rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-400">Loading...</p>
        </motion.div>
    </div>
);

const WaitlistContent: React.FC = () => {
    const {
        user,
        queueStats,
        referralStats,
        isLoading,
        isAuthenticated,
        login,
        logout,
    } = useAuth();
    const [searchParams] = useSearchParams();
    const [referralFromUrl, setReferralFromUrl] = useState<string | null>(null);

    // Get referral code from URL on mount
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setReferralFromUrl(ref.toUpperCase());
        }
    }, [searchParams]);

    const handleVerificationSuccess = async (
        email: string,
        referralCode: string | null
    ) => {
        // Use URL referral code if no code provided in form
        const codeToUse = referralCode || referralFromUrl;
        await login(email, codeToUse);
    };

    // Loading state
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Show dashboard if authenticated
    if (
        isAuthenticated &&
        user &&
        queueStats &&
        referralStats
    ) {
        return (
            <DashboardStyled
                user={user}
                onLogout={logout}
                queueStats={queueStats}
                referralStats={referralStats}
            />
        );
    }

    // Show email verification page
    return (
        <EmailVerificationStyled
            onVerificationSuccess={handleVerificationSuccess}
        />
    );
};

export default function WaitlistPage() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-navy">
                <Suspense fallback={<LoadingSpinner />}>
                    <WaitlistContent />
                </Suspense>
            </div>
        </AuthProvider>
    )
}
