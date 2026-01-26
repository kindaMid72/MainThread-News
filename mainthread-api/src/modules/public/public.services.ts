// imports
import { Temporal } from "@js-temporal/polyfill";
import hashSHA256 from "../../utils/cryptoTools/hashSHA256";
import generateRandomToken from "../../utils/generator/generateRandomToken";
import { checkUserExist, invalidateToken, storeResetPasswordToken, updateUserPassword, verifyResetToken } from "./public.repositories";

// types
import { ArticleQuery } from "./public.types";

// repositories
import { getAllArticles, getArticleContent, getCategoriesArticles, getMainPageContent, searchArticles } from "./public.repositories";

// emailer
import Emailer from '../../config/emailer/emailerInstance';

export async function getMainPageContentService(): Promise<{ latestNews: ArticleQuery[], headline: ArticleQuery[], breakingNews: ArticleQuery[], categories: any[] } | undefined> {
    try {
        /**
         1. latest news (right top): fetch 5 latest published articles, 
         - view all: open all article
         2. headline(middle top): show latest headline (just one)
         3. breaking news(left top): fetch 2 breaking news 
         4. categories: fetch 5 for each category
         */

        let { latestNews, headline, breakingNews, categories }: { latestNews: ArticleQuery[], headline: ArticleQuery[], breakingNews: ArticleQuery[], categories: any[] } = await getMainPageContent();

        // TODO: config author id name (change to author_id to its name), edit select to exclude content_html
        // FIXME: fix date format (why its acting that way)

        // fetch categories articles
        if(categories.length > 0) {
            const categoriesArticles = await Promise.all(categories.map((category) => getCategoriesArticles(category.id)));
            categories.forEach((category, index) => {
                category.articles = categoriesArticles[index];
            }); 
        }

        return {
            latestNews,
            headline,
            breakingNews,
            categories
        }
    } catch (error) {
        console.log('error from public service getMainPageContent: ', error);
    }
}

export async function getArticleContentService(slug: string): Promise<ArticleQuery | undefined> {
    try {
        const article = await getArticleContent(slug);
        
        return article as ArticleQuery;
    } catch (error) {
        console.log('error from public service getArticleContent: ', error);
    }
}

export async function getCategoryArticlesService(categoryId: string) {
    try {
        const articles = await getCategoriesArticles(categoryId);
        return articles;
    } catch (error) {
        console.log('error from public service getCategoryArticlesService: ', error);
        throw error;
    }
}

export async function getAllArticlesService(page: number, limit: number) {
    try {
        const { articles, count } = await getAllArticles(page, limit);
        return { articles, count };
    } catch (error) {
        console.log('error from public service getAllArticlesService: ', error);
        throw error;
    }
}

export async function getAllCategoriesService(page: number, limit: number, category_slug?: string) {
    try {
        if (category_slug) {
            const { articles, count } = await getAllArticles(page, limit, category_slug);
            return { articles, count };
        }
        const { articles, count } = await getAllArticles(page, limit);
        return { articles, count };
    } catch (error) {
        console.log('error from public service getAllCategoriesService: ', error);
        throw error;
    }
}

export async function searchArticlesService({ query, page, limit }: { query: string, page: number, limit: number }) {
    try {
        const articles = await searchArticles({ query, page, limit });
        return articles;
    } catch (error) {
        console.log('error from public service searchArticlesService: ', error);
        throw error;
    }
}


export async function forgotPasswordService({ email }: { email: string }) {
    try {
        // check if user exist
        const user = await checkUserExist(email);
        if (!user) {
            throw new Error("User not found");
        }

        // create token and store it with a expire date
        const token = await generateRandomToken();
        const token_hash = hashSHA256(token);
        const expiredAt = Temporal.Now.zonedDateTimeISO().add({ hours: 1 }).toString().split('[')[0];

        await storeResetPasswordToken({
            email: user.email,
            token_hash: token_hash,
            expiredAt: expiredAt,
            role: user.role
        });

        // send email with reset password link containt token
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        await (async function () {
            const { data: sendInvite, error: sendInviteError } = await Emailer.emails.send({
                from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
                to: [email],
                subject: `Reset Your Password`,
                html: `<p>You requested a password reset.</p><p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`,
            });

            if (sendInviteError) {
                throw new Error(sendInviteError.message);
            }
        })();

        // return success
        return true;
    } catch (error) {
        console.log('error from public service forgotPasswordService: ', error);
        throw error;
    }
}

export async function resetPasswordService({ token, password }: { token: string, password: string }) {
    try {
        const token_hash = hashSHA256(token);

        // 1. Verify token
        const inviteData = await verifyResetToken(token_hash);
        if (!inviteData || !inviteData.email) {
            throw new Error("Invalid or expired token");
        }

        // 2. Update password
        await updateUserPassword(inviteData.email, password);

        // 3. Invalidate token
        await invalidateToken(token_hash);

        return { message: "Password reset successfully" };

    } catch (error) {
        console.log('error from public service resetPasswordService: ', error);
        throw error;
    }
}