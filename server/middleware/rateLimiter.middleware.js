import { rateLimit } from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Limits each IP to 100 requests per 15 minutes.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

/**
 * Stricter Rate Limiter for Authentication Routes
 * Limits each IP to 5 requests per hour for routes like login, register, password reset.
 */
export const authLimiter = rateLimit({
    windowMs: 60 * 10 * 1000, // 10 min
    limit: 100, // Limit each IP to 5 requests per `window` (here, per 10 minutes).
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many attempts from this IP, please try again after an 10 minutes',
    },
});
