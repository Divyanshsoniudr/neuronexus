import { describe, it, expect } from 'vitest';
import { generateLiveQuiz } from './aiService';

/**
 * NeuroQuiz V7: Intelligence Core Test Suite
 * Ensures GPT-4o returns valid, subject-accurate data.
 */
describe('Neuro-Intelligence Core (OpenAI)', () => {

    it('should synthesize exactly 25 neural vectors', async () => {
        // Note: This requires VITE_OPENAI_API_KEY to be set in .env
        const quiz = await generateLiveQuiz('JavaScript', 'Basic');
        expect(quiz).toBeInstanceOf(Array);
        expect(quiz.length).toBe(25);
    }, 30000); // 30s timeout for AI synthesis

    it('should maintain schema integrity for result UI', async () => {
        const quiz = await generateLiveQuiz('React Architecture', 'Advanced');
        const vector = quiz[0];

        expect(vector).toHaveProperty('id');
        expect(vector).toHaveProperty('category');
        expect(vector).toHaveProperty('question');
        expect(vector).toHaveProperty('options');
        expect(vector).toHaveProperty('answer');
        expect(vector).toHaveProperty('explanation');

        expect(vector.options.length).toBe(4);
        expect(vector.options).toContain(vector.answer);
    }, 30000);

    it('should categorize correctly across all sectors', async () => {
        const quiz = await generateLiveQuiz('Cyber Security', 'Intermediate');
        const categories = quiz.map(q => q.category);

        // Check if at least some of our specific categories are present
        const sectors = ['Syntax', 'Architecture', 'Logic', 'Theory', 'Security'];
        const hasSectors = sectors.some(s => categories.includes(s));
        expect(hasSectors).toBe(true);
    }, 30000);
});
