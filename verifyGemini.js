import { generateLiveQuiz } from "./src/services/geminiService.js";

// Mock minimal Vite environment for standalone Node execution
globalThis.import = { meta: { env: { VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY } } };

async function runVerification() {
    console.log("--- FINAL NEURAL CORE VERIFICATION ---");
    const topic = "Quantum Computing";
    const difficulty = "Intermediate";

    try {
        const quiz = await generateLiveQuiz(topic, difficulty);
        console.log("SUCCESS: Quiz synthesized successfully.");
        console.log(`Generated ${quiz.length} questions.`);
        console.log("Sample Question:", quiz[0].question);
        process.exit(0);
    } catch (error) {
        console.error("VERIFICATION FAILED:", error.message);
        process.exit(1);
    }
}

runVerification();
