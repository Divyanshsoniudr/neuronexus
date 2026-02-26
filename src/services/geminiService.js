import { GoogleGenerativeAI } from "@google/generative-ai";
import { guardian } from "./Guardian";

const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// Helper to convert File to GenerativePart
async function fileToGenerativePart(file) {
    const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: base64Data,
            mimeType: file.type
        },
    };
}

export const generateLiveQuiz = async (topic, difficulty = 'Intermediate', file = null) => {
    console.log(`[Gemini-Core] Synthesis initialized for: ${topic} (${difficulty}) ${file ? `+ Document: ${file.name}` : ''}`);

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing or invalid");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelsToTry = [
        "gemini-flash-latest",
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-flash-lite-latest"
    ];

    const basePrompt = `
    You are a world-class Subject Matter Expert and Pedagogy Specialist. 
    Your mission is to generate a comprehensive 25-question multiple-choice assessment.
    
    ${file ? `CONTEXT: The user has provided a document. Focus 80% of the questions on the specific content within this document, and 20% on related broader context of the topic.` : ''}

    TOPIC: ${topic}
    DIFFICULTY TIER: ${difficulty}

    SPECIFIC CRITERIA FOR ${difficulty.toUpperCase()}:
    - BASIC: Fundamental definitions, syntax, and base-level concepts.
    - INTERMEDIATE: Patterns, architecture, and common problem-solving.
    - ADVANCED: Expert-level deep dives, performance edge-cases, and complex theoretical trade-offs.

    OUTPUT REQUIREMENTS:
    - Exactly 25 questions.
    - JSON array of objects.
    - Schema: { id: number, category: string, question: string, options: [string, string, string, string], answer: string, explanation: string }
    `;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini-Core] Attempting ${modelName}...`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                }
            });

            let result;
            if (file) {
                const filePart = await fileToGenerativePart(file);
                result = await model.generateContent([basePrompt, filePart]);
            } else {
                result = await model.generateContent(basePrompt);
            }

            const response = await result.response;
            const text = response.text();

            const quizData = JSON.parse(text);

            if (!Array.isArray(quizData)) {
                const data = Object.values(quizData).find(v => Array.isArray(v));
                if (data) return data.slice(0, 25);
                throw new Error("Invalid format from Gemini Core");
            }

            console.log(`[Gemini-Core] SUCCESS using ${modelName}`);
            // 2026 Elite Standard: Audit AI Output before returning
            return await guardian.auditOutput(quizData.slice(0, 25));
        } catch (error) {
            console.warn(`[Gemini-Core] ${modelName} Failed: ${error.message}`);
            if (!error.message.includes("404") && !error.message.includes("not found")) {
                throw error;
            }
        }
    }

    throw new Error("All Gemini models returned 404 or are unavailable.");
};

export const generateMiniProject = async (weakSectors) => {
    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelsToTry = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash"];

    const prompt = `
    Analyze these weak neural sectors: ${weakSectors.join(", ")}.
    Synthesize a single, creative, and highly actionable "Mini-Project" idea that forces the user to apply these concepts.
    Format your response as a JSON object: { "title": "string", "objective": "string", "steps": ["string", "string", "string"] }.
    Make it sound futuristic and challenging.
    `;

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            const text = (await result.response).text();
            return JSON.parse(text);
        } catch (error) {
            console.warn(`[Project-Service] ${modelName} Failed: ${error.message}`);
        }
    }

    return {
        title: "Neural Integration Test",
        objective: "Manually reconcile local data structures with cloud-based persistent vectors.",
        steps: ["Identify data schema", "Mock external API", "Verify transactional integrity"]
    };
};
export const generateNeuralFeed = async (topic, skillStats, mentors, externalSignals = []) => {
    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    You are the Neural Core of the NeuroNexus platform.
    Analyze the FOLLOWING DATA SOURCES:
    
    1. USER STATE:
       TOPIC: ${topic || 'General Learning'}
       SKILL STATS: ${JSON.stringify(skillStats)}
    
    2. GLOBAL SIGNALS (Latest News/Trends):
       ${JSON.stringify(externalSignals)}
    
    3. MENTOR PROFILES:
       ${mentors.map(m => `- ${m.name} (${m.title}): ${m.role}`).join("\n")}
    
    TASK:
    Synthesize a "Daily Mastery Briefing."
    Generate exactly 3 "Synaptic Insights." At least ONE insight MUST bridge a Global Signal with the user's current progress.
    
    Output Format: JSON array.
    [
        { "mentorId": "skeptic|architect|ethicist", "text": "string (insight)", "type": "thought|warning|quote|global" },
        ...
    ]
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        return JSON.parse(text);
    } catch (error) {
        console.error("[NeuralFeed-Service] Failed:", error);
        return [];
    }
};

/**
 * generateAIRoadmap: Transforms a topic or a document into a structured learning path.
 */
export const generateAIRoadmap = async (topic, file = null) => {
    console.log(`[Roadmap-Core] Generating custom path for: ${topic} ${file ? `(Document: ${file.name})` : ''}`);

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });

    const prompt = `
    You are a Curriculum Architect. 
    TASK: Create a professional 5-node learning roadmap for the topic: "${topic}".
    
    ${file ? `CONTEXT: Use the provided document as the primary source of truth for the curriculum.` : ''}

    REQUIRED JSON FORMAT:
    {
        "id": "slugified-id",
        "title": "Roadmap Title",
        "nodes": [
            { "id": "unique-id-1", "title": "Core Concept", "topic": "specific sub-topic to master", "category": "Foundations" },
            ... (exactly 5 nodes)
        ]
    }

    NODES should follow a logical progression from Foundations to Mastery.
    `;

    try {
        let result;
        if (file) {
            const filePart = await fileToGenerativePart(file);
            result = await model.generateContent([prompt, filePart]);
        } else {
            result = await model.generateContent(prompt);
        }

        const text = (await result.response).text();
        const roadmapData = JSON.parse(text);

        // 2026 Elite Standard: Audit AI Output
        return await guardian.auditOutput(roadmapData);
    } catch (error) {
        console.error("[Roadmap-Core] Failed:", error);
        throw error;
    }
};
