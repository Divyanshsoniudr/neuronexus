/**
 * NeuroQuiz V7: Schema Verification Specification
 * 
 * This file defines exactly what the Gemini-Core must output for a successful 
 * neural handshake. This serves as the 'Source of Truth' for our AI service.
 */

const EXPECTED_SCHEMA = {
    id: "number (1-25)",
    category: "ONE OF: 'Syntax', 'Architecture', 'Logic', 'Theory', 'Security'",
    question: "string (High-tech, professional terminology)",
    options: "Array of exactly 4 strings",
    answer: "string (Must match one of the options exactly)",
    explanation: "string (1-2 sentences of professional technical insight)"
};

const SAMPLE_OUTPUT_ITEM = {
    id: 1,
    category: "Architecture",
    question: "How does the 'Reconciliation' algorithm in React 18+ optimize UI updates?",
    options: [
        "By performing a deep-clone of the entire DOM tree",
        "By using the 'Fiber' engine to prioritize concurrent tasks",
        "By bypassing the Virtual DOM and using direct DOM injection",
        "By strictly enforcing synchronous execution of all state changes"
    ],
    answer: "By using the 'Fiber' engine to prioritize concurrent tasks",
    explanation: "React Fiber introduces the ability to break rendering work into chunks and spread it out over multiple frames, enabling high-performance concurrency."
};

console.log("NEURO-QUIZ V7: EXPECTED OUTPUT FORMAT");
console.log("====================================");
console.log(JSON.stringify({ questions: [SAMPLE_OUTPUT_ITEM] }, null, 2));
