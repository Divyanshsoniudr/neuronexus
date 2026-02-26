import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from './src/store/useStore';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Roadmap Progression Logic', () => {
    beforeEach(() => {
        localStorage.clear();
        const store = useStore.getState();
        store.reset();
        // Manually set initial state for test
        useStore.setState({
            roadmapProgress: {},
            activeRoadmapId: 'frontend',
            activeRoadmapNode: 'html',
            currentQuiz: Array(10).fill({ answer: 'A', category: 'Syntax' }),
            score: 0
        });
    });

    it('should unlock a node when passing with 70%', async () => {
        const store = useStore.getState();

        // Simulate finishing quiz with 7/10 (70%)
        useStore.setState({ score: 6 }); // 6 correct before final answer

        await store.submitAnswer('A'); // Correct answer -> score becomes 7

        const updatedProgress = useStore.getState().roadmapProgress;
        expect(updatedProgress['frontend']).toContain('html');
        expect(localStorage.getItem('roadmap_progress')).toContain('html');
    });

    it('should NOT unlock a node when failing (< 70%)', async () => {
        const store = useStore.getState();

        // Simulate finishing quiz with 5/10 (50%)
        useStore.setState({ score: 4 }); // 4 correct before final answer

        await store.submitAnswer('A'); // Correct answer -> score becomes 5 (50%)

        const updatedProgress = useStore.getState().roadmapProgress;
        expect(updatedProgress['frontend'] || []).not.toContain('html');
    });
});
