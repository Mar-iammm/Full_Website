export const UNIVERSITY_DOMAINS: string[] = [
    // General academic domains
    'edu',
    'ac.uk',
    'edu.au',
    'ac.nz',
    'edu.sg',
    'ac.ae', // UAE universities
    'edu.ae',
    'ac.in', // India
    'edu.in',
    'ac.za', // South Africa
    'edu.za',
    'ac.jp', // Japan
    'edu.cn', // China
    'edu.hk', // Hong Kong
    'edu.my', // Malaysia
    'edu.pk', // Pakistan
    'edu.ph', // Philippines
    'edu.sa', // Saudi Arabia
    'edu.qa', // Qatar
    'edu.kw', // Kuwait
    'edu.bh', // Bahrain
    'edu.om', // Oman
    'edu.eg', // Egypt
    'edu.jo', // Jordan
    'edu.lb', // Lebanon
    'ac.il', // Israel
    'edu.tr', // Turkey
    'edu.br', // Brazil
    'edu.mx', // Mexico
    'edu.ar', // Argentina
    'edu.co', // Colombia
    'edu.pe', // Peru
    'edu.cl', // Chile
    // European academic domains
    'ac.at', // Austria
    'ac.be', // Belgium
    'edu.es', // Spain
    'edu.fr', // France (some universities)
    'edu.it', // Italy (some universities)
    'edu.pl', // Poland
    'edu.ru', // Russia
    // Specific well-known universities
    'student.uva.nl',
    'student.vu.nl',
    'uni-heidelberg.de',
    'student.ethz.ch',
    'ox.ac.uk',
    'cam.ac.uk',
    'mit.edu',
    'stanford.edu',
    'harvard.edu',
    'berkeley.edu',
    'yale.edu',
    'princeton.edu',
    'columbia.edu',
    'upenn.edu',
    'nyu.edu',
    'cornell.edu',
    'ucla.edu',
    'usc.edu',
];

export const SECURITY_CONFIG = {
    MAX_REFERRALS_PER_IP: 5,
    MAX_SIGNUPS_PER_IP: 3,
    REFERRAL_CODE_LENGTH: 8,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_FAILED_ATTEMPTS: 5,
} as const;

export const QUEUE_CONFIG = {
    COUNTDOWN_DURATION: 72 * 60 * 60 * 1000, // 72 hours
    POSITION_UPDATE_INTERVAL: 5000, // 5 seconds
} as const;

export const VERIFICATION_UI_CONFIG = {
    OTP_LENGTH: 6,
    OTP_EXPIRY_DISPLAY: '5 minutes',
    RESEND_COOLDOWN_DISPLAY: '60 seconds',
    MAX_ATTEMPTS_DISPLAY: 5,
    LOCKOUT_DISPLAY: '15 minutes',
} as const;

export const REFERRAL_MILESTONES = [
    { count: 1, reward: 'Move up 5 positions', color: 'azure', bonus: 5 },
    { count: 5, reward: 'Move up 15 positions', color: 'cyan', bonus: 15 },
    { count: 10, reward: 'Move up 30 positions', color: 'violet', bonus: 30 },
    { count: 25, reward: 'Priority access', color: 'gold', bonus: 100 },
] as const;
