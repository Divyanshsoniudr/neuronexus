import { GoogleGenerativeAI } from "@google/generative-ai";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { guardian } from "./Guardian";

const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// Helper to convert File to GenerativePart (for fallback)
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

    // If there is no file, use the SECURE Backend Cloud Function!
    if (!file) {
        try {
            console.log(`[Gemini-Core] Routing request securely through Firebase Cloud Functions...`);
            const generateQuizSecure = httpsCallable(functions, 'generateQuizSecure');
            const result = await generateQuizSecure({ topic, difficulty });

            const quizData = result.data.quiz;
            console.log(`[Gemini-Core] SUCCESS via Secure Cloud Function`);

            // Still run the output through the local Guardian audit
            return await guardian.auditOutput(quizData);
        } catch (error) {
            console.error(`[Gemini-Core] Cloud Function Failed: ${error.message}`);
            throw new Error(`Secure Generation Failed: ${error.message}`);
        }
    }

    // --- FALLBACK FOR DOCUMENT UPLOADS (Client-Side) ---
    // Since moving large base64 documents requires a larger backend refactor, 
    // we keep the client-side SDK specifically for document parsing for now.

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing for document parsing");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });

    const basePrompt = `
    You are a world-class Subject Matter Expert and Pedagogy Specialist. 
    Your mission is to generate a comprehensive 25-question multiple-choice assessment.
    
    CONTEXT: The user has provided a document. Focus 80% of the questions on the specific content within this document, and 20% on related broader context of the topic.

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

    try {
        console.log(`[Gemini-Core] Attempting client-side document parsing...`);
        let result;

        if (file) {
            const filePart = await fileToGenerativePart(file);
            result = await model.generateContent([basePrompt, filePart]);
        } else {
            result = await model.generateContent(basePrompt);
        }

        const response = await result.response;
        const quizData = JSON.parse(response.text());

        if (!Array.isArray(quizData)) {
            const data = Object.values(quizData).find(v => Array.isArray(v));
            if (data) return data.slice(0, 25);
            throw new Error("Invalid format from Gemini Core");
        }

        console.log(`[Gemini-Core] SUCCESS parsing document`);
        return await guardian.auditOutput(quizData.slice(0, 25));
    } catch (error) {
        console.warn(`[Gemini-Core] Generation failed: ${error.message}`);
        throw new Error("Server Busy: The system is currently experiencing heavy load. Please try again later.");
    }
};

export const generateMiniProject = async (weakSectors) => {
    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelsToTry = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash"];

    const prompt = `
    Analyze these weak topics: ${weakSectors.join(", ")}.
    Synthesize a single, creative, and highly actionable "Mini-Project" idea that forces the user to apply these concepts.
    Format your response as a JSON object: { "title": "string", "objective": "string", "steps": ["string", "string", "string"] }.
    Make it challenging but approachable.
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
        title: "Integration Test",
        objective: "Manually sync your local data with the cloud.",
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
    You are the core intelligence of the learning platform.
    Analyze the FOLLOWING DATA SOURCES:
    
    1. USER STATE:
       TOPIC: ${topic || 'General Learning'}
       SKILL STATS: ${JSON.stringify(skillStats)}
    
    2. GLOBAL SIGNALS (Latest News/Trends):
       ${JSON.stringify(externalSignals)}
    
    3. MENTOR PROFILES:
       ${mentors.map(m => `- ${m.name} (${m.title}): ${m.role}`).join("\n")}
    
    TASK:
    Synthesize a "Daily Study Briefing."
    Generate exactly 3 "Insights." At least ONE insight MUST bridge a Global Signal with the user's current progress.
    
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

/**
 * simulateInterviewStep: Calls the secure backend function to evaluate the candidate's answer
 * and generate the next interview question or debrief.
 * 
 * REVERTED TO CLIENT-SIDE: User cannot use paid Firebase Cloud Functions.
 */
export const simulateInterviewStep = async (messages, config) => {
    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key is missing");
    }

    try {
        console.log(`[Gemini-Interview] Simulating interview step locally...`);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Build the system instructions
        const systemPrompt = `
        You are a Senior Engineering Manager conducting a technical interview. 
        The candidate is applying for the role of ${config.difficulty} ${config.role}.
        
        Current state of the interview:
        The candidate has just provided their response. 
        
        YOUR TASK:
        1. Briefly acknowledge and grade their previous response (mention if it was strong, or if it missed something critical).
        2. Ask the NEXT technical question or a follow-up probe based on their answer. Make it challenging but fair for a ${config.difficulty} level.
        3. If they have answered 5 questions total, conclude the interview and provide a final "Debrief Report" summarizing their Fit Score, Strengths, and Weaknesses.
        
        Keep your responses under 200 words. Speak directly to the candidate as the interviewer. Use Markdown for code or emphasis.
        `;

        // Convert history format to Gemini format
        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
            systemInstruction: { parts: [{ text: systemPrompt }] }
        });

        // The last message is the user's latest input
        const latestInput = messages[messages.length - 1].content;
        const result = await chat.sendMessage(latestInput);
        const text = result.response.text();

        console.log(`[Gemini-Interview] Received response from local Senior Eng Manager.`);
        return text;
    } catch (error) {
        console.error(`[Gemini-Interview] Failed to process interview step locally:`, error);
        throw new Error(`Interview Simulation Error: ${error.message}`);
    }
};
