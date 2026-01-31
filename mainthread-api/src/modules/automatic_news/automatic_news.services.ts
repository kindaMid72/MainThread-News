import gemini from "../../config/LLM/googleGenAI";

export async function createAutomaticNews(data: { title: string, content: string }) {
    try {
        const { title, content } = data;
        if (!title || !content) return { message: 'Title and content are required' };

        // get article category and its description from database for LLM context

        // create prompt, pass possible category as context, goal: generate news article based on most important news for that day

        // generate article: title, content, category using selected LLM model (gemini 2.5 flash)

        // create thumbnail based on content using selected LLM model (gemini 2.5 flash)

        // store thumbnail in database

        // create slug based on title that been created (TODO: create slug function)

        // store content & thumbnail in database

        // return success message (or just return the news object)

        return { message: 'Automatic news created successfully' };
    } catch (error) {
        return { message: 'Internal server error' };
    }
}