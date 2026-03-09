import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

// Ensure we don't pollute our production analytics with local development events
const isProduction = import.meta.env.MODE === "production";

export const AnalyticsService = {
    logQuizStarted: (topic, difficulty) => {
        if (!isProduction || !analytics) return;
        try {
            logEvent(analytics, "quiz_started", {
                topic: topic?.toLowerCase(),
                difficulty: difficulty?.toLowerCase(),
            });
        } catch (e) {
            console.warn("Analytics Error (quiz_started):", e);
        }
    },

    logQuizCompleted: (topic, score, rank) => {
        if (!isProduction || !analytics) return;
        try {
            logEvent(analytics, "quiz_completed", {
                topic: topic?.toLowerCase(),
                score,
                rank,
            });
        } catch (e) {
            console.warn("Analytics Error (quiz_completed):", e);
        }
    },

    logRoadmapGenerated: (topic) => {
        if (!isProduction || !analytics) return;
        try {
            logEvent(analytics, "roadmap_generated", {
                topic,
            });
        } catch (e) {
            console.warn("Analytics Error (roadmap_generated):", e);
        }
    },
};
