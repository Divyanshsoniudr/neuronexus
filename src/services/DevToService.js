/**
 * DevToService: The Community Intelligence Layer
 * Fetches real-world professional articles from Dev.to at $0 cost (No API Key).
 */
class DevToService {
    constructor() {
        this.baseUrl = "https://dev.to/api/articles";
    }

    /**
     * Fetches the latest professional articles based on tags
     * @param {string} topic - The topic to search for
     * @param {number} page - The page number to fetch
     * @returns {Promise<Array>}
     */
    async getArticles(topic = "technology", page = 1) {
        try {
            // Clean up the topic for tag search
            const tag = topic.toLowerCase().replace(/\s+/g, '');
            const response = await fetch(`${this.baseUrl}?tag=${tag}&per_page=15&page=${page}&top=3`);

            if (!response.ok) throw new Error("Failed to fetch from Dev.to");

            const data = await response.json();

            // Transform Dev.to data into our signal format
            return data.map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                url: article.url,
                published_at: article.published_at,
                source: "Dev.to community",
                tags: article.tag_list,
                author: article.user.name,
                avatar: article.user.profile_image_90,
                cover_image: article.cover_image || article.social_image,
                type: 'global'
            }));
        } catch (error) {
            console.warn("[DevToService] Error fetching articles:", error);
            return this.getFallbackArticles();
        }
    }

    getFallbackArticles() {
        return [
            {
                id: "fallback-1",
                title: "Mastering the Modern Stack 2026",
                description: "A deep dive into the architectural principles defining the next generation of applications.",
                source: "Tech Articles",
                cover_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                type: 'global'
            },
            {
                id: "fallback-2",
                title: "The Ethics of Agentic Systems",
                description: "Understanding the governance models required for autonomous professional agents.",
                source: "Static Intelligence",
                cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                type: 'global'
            }
        ];
    }
}

export const devToService = new DevToService();
