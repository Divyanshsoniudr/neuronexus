import { saveQuizToHistory } from "./dbService";
import { useStore } from "../store/useStore";

/**
 * DecisionLedger: The Intellectual Profile Tracker
 * Tracks reasoning patterns, consistency, and logical strength.
 */
class DecisionLedger {
    /**
     * Logs a decision event to the user's permanent history
     * @param {Object} event - The scenario, decision, and feedback data
     */
    async logDecision(event) {
        const user = useStore.getState().user;
        if (!user) return;

        console.log("[DecisionLedger] Logging intellectual event...");

        const logEntry = {
            timestamp: new Date().toISOString(),
            scenario: event.scenarioTitle,
            decision: event.userDecision,
            perspectives: event.perspectives, // Adversarial reviews
            feedback: event.feedback, // Persona reviews
            scores: event.feedback.map(f => f.rating),
            averageScore: event.feedback.reduce((a, b) => a + b.rating, 0) / event.feedback.length
        };

        try {
            // We leverage the existing dbService to save to Firestore
            await saveQuizToHistory(user.uid, logEntry);
            // Note: In a future iteration, we'll create a dedicated 'decisions' collection
            // for deeper structural analysis.

            this.updateMasteryPulse(logEntry);
        } catch (error) {
            console.error("[DecisionLedger] Logging Error:", error);
        }
    }

    /**
     * Updates the user's 'Live Pulse' (Logical Consistency Score)
     */
    updateMasteryPulse(logEntry) {
        // Logic to calculate consistency across multiple events
        // This feeds into the RoadmapVisual.jsx later
        console.log("[DecisionLedger] Recalculating logical consistency pulse...");
    }
}

export const decisionLedger = new DecisionLedger();
