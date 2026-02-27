import OpenAI from "openai";

const getApiKey = () => {
    try {
        return import.meta.env.VITE_OPENAI_API_KEY;
    } catch (e) {
        return process.env.VITE_OPENAI_API_KEY;
    }
};
const API_KEY = getApiKey();

export const generateLiveQuiz = async (topic, difficulty = 'Intermediate') => {
    console.log(`[GPT-Core] Synthesis initialized for: ${topic} (${difficulty})`);
    console.log(`[GPT-Core] API Key detected: ${API_KEY ? 'YES (' + API_KEY.substring(0, 7) + '...)' : 'NO'}`);

    if (!API_KEY || API_KEY.includes("your_openai_key")) {
        console.error("[GPT-Core] FATAL: OpenAI API Key is missing or invalid in .env");
        return fallbackSimulation(topic, "MISSING_KEY");
    }

    const openai = new OpenAI({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true // Required for client-side API calls in this demo context
    });

    const prompt = `
    You are a world-class Subject Matter Expert and Pedagogy Specialist. 
    Your mission is to generate a comprehensive 25-question multiple-choice assessment.

    TOPIC: ${topic}
    DIFFICULTY TIER: ${difficulty}

    SPECIFIC CRITERIA FOR ${difficulty.toUpperCase()}:
    - BASIC: Fundamental definitions, syntax, and base-level concepts (Junior level).
    - INTERMEDIATE: Patterns, architecture, and common problem-solving (Mid-level).
    - ADVANCED: Expert-level deep dives, performance edge-cases, and complex theoretical trade-offs. Include brief code snippets where relevant.

    OUTPUT REQUIREMENTS:
    - Exactly 25 questions.
    - JSON array of objects.
    - Professional, subject-accurate, and challenging for the selected tier.

    JSON SCHEMA:
    {
      "id": number,
      "category": "Syntax" | "Architecture" | "Logic" | "Theory" | "Security",
      "question": string,
      "options": [string, string, string, string],
      "answer": string (exactly matching one of the options),
      "explanation": string (1-2 sentences of technical insight)
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using mini for faster/cheaper response while maintaining high quality
            messages: [
                { role: "system", content: "You are a professional quiz generator. You must ONLY output a valid JSON object containing a 'questions' array with exactly 25 items." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const rawContent = response.choices[0].message.content;
        console.log("[GPT-Core] Raw synthesis received. Validating...");

        const content = JSON.parse(rawContent);

        // Flexible normalization for common AI response structures
        let quizData = [];
        if (Array.isArray(content)) {
            quizData = content;
        } else if (content.questions && Array.isArray(content.questions)) {
            quizData = content.questions;
        } else if (content.quiz && Array.isArray(content.quiz)) {
            quizData = content.quiz;
        } else {
            // If it's an object with any array, assume that's our data
            const firstArray = Object.values(content).find(v => Array.isArray(v));
            if (firstArray) quizData = firstArray;
        }

        if (!Array.isArray(quizData) || quizData.length === 0) {
            console.error("[GPT-Core] Schema Anomaly: No array detected in response", content);
            throw new Error("Invalid format from GPT Core: No array found");
        }

        console.log(`[GPT-Core] Synthesis successful. ${quizData.length} vectors validated.`);
        return quizData.slice(0, 25);
    } catch (error) {
        console.error("[GPT-Core] Synthesis Failed!");
        console.error("[GPT-Core] Error Name:", error.name);
        console.error("[GPT-Core] Error Message:", error.message);

        // Help the user identify common issues
        if (error.message.includes("401")) {
            console.warn("[GPT-Core] Hint: Your API key appears invalid. Double check .env");
        } else if (error.message.includes("429")) {
            console.warn("[GPT-Core] Hint: Rate limit exceeded or insufficient quota.");
        } else if (error.message.includes("404")) {
            console.warn("[GPT-Core] Hint: Model 'gpt-4o-mini' not found. Your key might not have access yet.");
        }

        if (error.response) {
            console.error("[GPT-Core] Full API Response:", error.response.data);
        }

        return fallbackSimulation(topic, error.message.includes("401") ? "INVALID_KEY" : "API_ERROR");
    }
};

const fallbackSimulation = async (topic, reason) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const categories = ['Syntax', 'Architecture', 'Logic', 'Theory', 'Security'];

    const messages = {
        MISSING_KEY: "OpenAI API Key is missing in your .env file.",
        INVALID_KEY: "Your OpenAI API Key is invalid or has expired.",
        API_ERROR: "Failed to connect to the AI. The system is offline."
    };

    return Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        category: categories[i % categories.length],
        question: `[BACKUP] ${topic} Question ${i + 1}`,
        options: ["Check OpenAI Key", "Verify API Balance", "Restart Dev Server", "Try Again Later"],
        answer: "Check OpenAI Key",
        explanation: messages[reason] || "An unexpected error occurred during GPT synthesis."
    }));
};
