import { GoogleGenerativeAI } from "@google/generative-ai";
import { guardian } from "./Guardian";
import { NEURAL_MENTORS } from "./NeuralMentors";

const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

/**
 * PersonaOrchestrator: The Scenario Manager
 * Orchestrates the "Crisis" and coordinates multi-agent feedback.
 */
class PersonaOrchestrator {
    constructor() {
        this.genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
    }

    /**
     * Initializes a new scenario based on a topic
     * @param {string} topic - The subject (e.g., "Medical Ethics", "Law", "Management")
     * @returns {Promise<{scenario: string, roles: string[]}>}
     */
    async startScenario(topic) {
        if (!this.genAI) throw new Error("AI Engine not initialized");

        // 1. Pre-audit topic
        const auditRes = await guardian.audit(topic);
        if (!auditRes.safe) throw new Error(auditRes.reason);

        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Create a high-stakes, interactive professional scenario for the topic: "${topic}".
      The scenario will be reviewed by three specialized AI agents: ${NEURAL_MENTORS.map(m => m.name + " (" + m.title + ")").join(", ")}.
      
      Output format: JSON object.
      {
        "title": "A short dramatic title",
        "context": "The detailed background and immediate crisis/situation.",
        "incident": "The specific event the user must respond to RIGHT NOW.",
        "roles": ${JSON.stringify(NEURAL_MENTORS.map(m => m.id))}, 
        "hint": "A subtle socratic hint for the user."
      }
    `;

        try {
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            return JSON.parse(text.substring(jsonStart, jsonEnd));
        } catch (error) {
            console.error("[PersonaOrchestrator] Start Error:", error);
            throw error;
        }
    }

    /**
     * Process a user's decision and get multi-persona feedback
     * @param {string} scenarioContext - The original situation
     * @param {string} userDecision - What the user did
     * @param {string[]} roles - The roles established at start
     */
    async getPersonaFeedback(scenarioContext, userDecision, roles) {
        if (!this.genAI) return [];

        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      SITUATION: "${scenarioContext}"
      USER DECISION: "${userDecision}"
      
      ACTORS:
      ${NEURAL_MENTORS.map(m => `- ${m.name} (${m.title}): ${m.systemPrompt}. Philosophy: ${m.philosophy}`).join("\n")}
      
      TASK:
      Each actor must give a brief, highly specific critique (max 3 sentences) of the user's decision from their unique perspective.
      Ensure the feedback is Professional, High-Intent, and matches their established persona traits.
      
      Output: JSON array of objects.
      [
        { "mentorId": "string (skeptic|architect|ethicist)", "feedback": "string", "rating": number (1-10) },
        ...
      ]
    `;

        try {
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            const jsonStart = text.indexOf('[');
            const jsonEnd = text.lastIndexOf(']') + 1;
            return JSON.parse(text.substring(jsonStart, jsonEnd));
        } catch (error) {
            console.error("[PersonaOrchestrator] Feedback Error:", error);
            return [];
        }
    }
}

export const personaOrchestrator = new PersonaOrchestrator();
