console.log("EXECUTION START: listActiveModels.js");
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("CRITICAL: VITE_GEMINI_API_KEY is missing. Pass it via CLI.");
    process.exit(1);
}

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Note: The v1beta might be replaced by v1 in some SDK versions, 
        // but here we use the SDK's built-in capability if available.
        // If not, we'll try a raw fetch or check the SDK docs.

        console.log("--- PROBING GEMINI API MODELS ---");

        // In @google/generative-ai ^0.24.1, we might need to use the REST fallback 
        // if listModels isn't directly exposed on the client in this way.
        // However, let's try the common pattern.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(", ")})`);
            });
        } else {
            console.error("Failed to list models:", data);
        }
    } catch (error) {
        console.error("Error during model listing:", error);
    }
}

listModels();
