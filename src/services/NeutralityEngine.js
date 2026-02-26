import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

/**
 * The Neutrality Engine: Dialectical Reasoning Layer
 * Responsibile for "Steel-manning" multiple objective perspectives.
 */
class NeutralityEngine {
    constructor() {
        this.genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
    }

    /**
     * Generates a dialectical review of a user's decision
     * @param {string} scenario - The context of the situation
     * @param {string} decision - The user's action/choice
     * @returns {Promise<{perspectives: Array<{label: string, argument: string, evidence: string}>}>}
     */
    async getDialecticalReview(scenario, decision) {
        if (!this.genAI) return { perspectives: [] };

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
        You are the "Neutrality Engine", an AI dedicated to dialectical reasoning and zero-bias analysis.
        
        CONTEXT:
        Scenario: "${scenario}"
        User's Decision: "${decision}"
        
        YOUR TASK:
        Present the two strongest, most objective, and intellectually honest arguments from different perspectives regarding this decision.
        Do NOT take a political side (Left, Right, Liberal, Conservative). Focus on:
        - Structural/Systemic trade-offs.
        - Long-term vs Short-term impact.
        - Technical vs Humanist priorities.
        
        OUTPUT format: JSON array of objects.
        {
          "perspectives": [
            {
              "label": "e.g., Short-term Pragmatism",
              "argument": "The strongest logical reason why this was a good or necessary move.",
              "friction": "The strongest logical reason why this move might fail or cause negative trade-offs.",
              "evidence": "Historical or theoretical basis for this logic."
            },
            {
              "label": "e.g., Long-term Systemic Health",
              "argument": "A different objective reasoning for the choice.",
              "friction": "The trade-offs inherent in this second view.",
              "evidence": "Objective data or theory supporting this."
            }
          ]
        }
      `;

            const result = await model.generateContent(prompt);
            const text = (await result.response).text();

            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            return JSON.parse(text.substring(jsonStart, jsonEnd));

        } catch (error) {
            console.error("[NeutralityEngine] Review Error:", error);
            return { perspectives: [] };
        }
    }
}

export const neutralityEngine = new NeutralityEngine();
