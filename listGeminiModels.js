import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
    if (!API_KEY) {
        console.error("VITE_GEMINI_API_KEY not found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        console.log("Fetching available models...");
        // The SDK doesn't have a direct listModels on genAI in some versions, 
        // but we can try to hit the rest endpoint or use a known working model.
        // However, we can try to instantiate common models and see if they work.

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro"];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("test");
                const response = await result.response;
                console.log(`[PASS] Model ${modelName} is available.`);
            } catch (e) {
                console.log(`[FAIL] Model ${modelName}: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Fatal error:", error);
    }
}

listModels();
