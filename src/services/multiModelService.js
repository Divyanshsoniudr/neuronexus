import { generateLiveQuiz as generateOpenAIQuiz } from './aiService';
import { generateLiveQuiz as generateGeminiQuiz } from './geminiService';

export const generateSmartQuiz = async (topic, difficulty = 'Intermediate') => {
    console.log(`[AI-Handshake] Initializing synthesis for: ${topic}`);

    // Phase 1: Try OpenAI (GPT-4o Mini)
    try {
        console.log("[AI-Handshake] Primary Core: Attempting OpenAI Synthesis...");
        const result = await generateOpenAIQuiz(topic, difficulty);

        // Check if we got the failsafe (which means aiService caught an error internally)
        if (result.some(q => q.question.includes("[GPT FAILSAFE]"))) {
            throw new Error("OpenAI returned failsafe data");
        }

        console.log("[AI-Handshake] SUCCESS: OpenAI Synthesis Complete.");
        return result;
    } catch (error) {
        console.warn(`[AI-Handshake] OpenAI Failure: ${error.message}`);
        console.log("[AI-Handshake] Secondary Core: Activating Gemini 1.5 Flash Fallback...");

        // Phase 2: Try Gemini
        try {
            const result = await generateGeminiQuiz(topic, difficulty);
            console.log("[AI-Handshake] SUCCESS: Gemini Synthesis Complete.");
            return result;
        } catch (geminiError) {
            console.error(`[AI-Handshake] FATAL: All Neural Cores Offline. ${geminiError.message}`);

            // Phase 3: Final Failsafe Simulation
            return fallbackSimulation(topic, "TOTAL_CORE_FAILURE");
        }
    }
};

const fallbackSimulation = (topic, reason) => {
    const categories = ['Syntax', 'Architecture', 'Logic', 'Theory', 'Security'];
    return Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        category: categories[i % categories.length],
        question: `[NEURAL FAILSAFE] ${topic} Vector ${i + 1}`,
        options: ["Check API Configuration", "Verify Quota/Balance", "AI Core Offline", "Try Again Later"],
        answer: "Check API Configuration",
        explanation: "All AI models are currently unavailable. Please verify your OpenAI and Gemini API keys in the .env file."
    }));
};
