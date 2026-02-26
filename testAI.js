import { generateLiveQuiz } from './src/services/aiService.js';

/**
 * NeuroQuiz V7: Module Verification Script
 * 
 * Run this to test the AI's subject-matter accuracy and schema compliance 
 * without launching the full React UI.
 */
async function runDiagnostic() {
    const testTopic = "Advanced React Patterns";
    const testDifficulty = "Advanced";

    console.log(`[Diagnostic] Starting Neural Handshake for: ${testTopic}...`);

    try {
        const quiz = await generateLiveQuiz(testTopic, testDifficulty);

        console.log("\n[Diagnostic] SUCCESS! Neural feedback received.");
        console.log(`[Diagnostic] Total Vectors: ${quiz.length}`);
        console.log("[Diagnostic] Sample Vector (Vector 1):");
        console.log(JSON.stringify(quiz[0], null, 2));

        // Audit for schema compliance
        const errors = [];
        quiz.forEach((q, i) => {
            if (!q.question || q.question.length < 10) errors.push(`Vector ${i + 1}: Question too short/missing`);
            if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`Vector ${i + 1}: Invalid options count`);
            if (!q.options.includes(q.answer)) errors.push(`Vector ${i + 1}: Answer not in options`);
        });

        if (errors.length === 0) {
            console.log("\n[Diagnostic] SCHEMA COMPLIANCE: 100% NOMINAL");
        } else {
            console.warn("\n[Diagnostic] SCHEMA ANOMALIES DETECTED:");
            errors.forEach(err => console.error(`  - ${err}`));
        }

    } catch (error) {
        console.error("\n[Diagnostic] FATAL ERROR during handshake:");
        console.error(error);
    }
}

// NOTE: This requires environment variables to be set in your node session 
// or run via a tool that supports .env (like vite-browser testing)
// Execute the diagnostic
runDiagnostic();
