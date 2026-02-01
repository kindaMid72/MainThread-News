import gemini from "../../config/LLM/googleGenAI";
import { checkHTMLNode } from "../../utils/articleTools/checkHTMLformat";
import { createTitleSlug } from "../../utils/articleTools/createTitleSlug";

// repositories
import { getArticleCategory, storeArticleReturnId, uploadImage } from "./automatic_news.repositories";

import { contentPrompt } from "./LLM.prompt";

export async function createAutomaticNews() {
    try {

        // get article category and its description from database for LLM context
        const categories: { id: string, name: string, description: string }[] = await getArticleCategory();


        // create prompt, pass possible category as context, goal: generate news article based on most important news for that day
        const aiPrompt = contentPrompt(categories.map((category: { name: string, description: string }) => category.name).join(', '));

        // generate article: title, content, category using selected LLM model (gemini 2.5 flash)
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: aiPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        content: { type: 'html' },
                        category: { type: 'string' },
                    },
                    required: ['title', 'content', 'category'],
                },
            },
        });

        const parsedResponse: { title: string, content: string, category: string } = JSON.parse(response.candidates[0].content.parts[0].text);

        // check if content is valid html
        const isValidHTML = checkHTMLNode(parsedResponse.content);
        if (!isValidHTML) {
            throw new Error('Invalid HTML content');
        }


        // // TODO: create thumbnail based on content using selected LLM model (gemini 2.5 flash) then store it in database
        // const thumbnailResponse = await gemini.models.generateContent({
        //     model: "gemini-2.5-flash-image",
        //     contents: `create thumbnail based on this title, only output image: ${parsedResponse.title}`,
        // });
        let thumbnailUrl: string = '';
        // for (const part of thumbnailResponse.candidates[0].content.parts) {
        //     if (part.text) {
        //         console.log(part.text);
        //     } else if (part.inlineData) {
        //         const imageData = part.inlineData.data;
        //         const buffer = Buffer.from(imageData, "base64");

        //         const slug = createTitleSlug(parsedResponse.title);
        //         const path = `thumbnail/thumbnail_auto-${Date.now().toString()}-${slug}.png`

        //         // store thumbnail in database
        //         thumbnailUrl = await uploadImage(buffer, path, {
        //             name: `thumbnail_auto-${Date.now().toString()}-${slug}.png`,
        //             type: 'image/png',
        //             size: buffer.length,
        //             path: path,
        //         });
        //         console.log('thumbnail url: ', thumbnailUrl);
        //     }
        // }

        // get category id from database based on category name
        let category: string = categories.find((category: { id: string, name: string, description: string }) => category.name.toLowerCase() === parsedResponse.category.toLowerCase()).id;
        if (!category) {
            // default category
            category = categories[0].id;
        }
        // generate slug based on title that been created (TODO: create slug function)
        const slug = createTitleSlug(parsedResponse.title);

        // store article in database
        const articleId = await storeArticleReturnId({
            title: parsedResponse.title,
            content: parsedResponse.content,
            category: category,
            slug: slug,
            thumbnail_url: thumbnailUrl,
        });

        return { id: articleId }; // return id of created article
    } catch (error) {
        console.log(error);
        return { message: 'Internal server error' };
    }
}