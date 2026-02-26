// Sentry Service Foundation
// In 2026, real-time error monitoring is non-negotiable for SaaS operations.

/**
 * Initialize Sentry
 * Instructions:
 * 1. install @sentry/react
 * 2. Add your DSN to .env as VITE_SENTRY_DSN
 * 3. Call SentryService.init() in main.jsx
 */

export const initSentry = async () => {
    // We dynamically import to keep the initial bundle light
    try {
        const Sentry = await import("@sentry/react");
        const dsn = import.meta.env.VITE_SENTRY_DSN;

        if (dsn) {
            Sentry.init({
                dsn,
                integrations: [
                    new Sentry.BrowserTracing(),
                    new Sentry.Replay(),
                ],
                tracesSampleRate: 1.0,
                replaysSessionSampleRate: 0.1,
                replaysOnErrorSampleRate: 1.0,
                environment: import.meta.env.MODE,
                sendDefaultPii: true,
            });
            console.log("Sentry: Neural Monitoring Active");
        }
    } catch (e) {
        console.warn("Sentry: Initialization bypassed (neural sync silent)");
    }
};

export const captureNeuralError = async (error, context = {}) => {
    try {
        const Sentry = await import("@sentry/react");
        Sentry.captureException(error, { extra: context });
    } catch (e) {
        console.error("Neural Error:", error, context);
    }
};
