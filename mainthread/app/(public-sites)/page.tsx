
// components
import LandingPage from "@/features/public-sites/landing-page/LandingPage";

import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';

import { ArticleQuery } from "@/types/Public.type";
interface MainResponse {
    data: {
        latestNews: ArticleQuery[];
        headline: ArticleQuery[];
        breakingNews: ArticleQuery[];
        categories: {id: string, name: string, slug: string, articles: ArticleQuery[]}[];
    }
}

const fetchArticles = async function fetchArticles() {
  try {
    const response = await api.get("/api/public/get-main-page-content");
    return {
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return null;
  }
};

export const metadata = {
  title: "MainThread",
  description: "MainThread News Website",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `/`,
  }
}
export default async function Home() {

  try {
    const response: MainResponse | null = await fetchArticles();
    // pass till here
    return (
      <LandingPage response={response as MainResponse} />
    );
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return null;
  }
}
