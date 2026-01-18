
// components
import LandingPage from "@/features/public-sites/landing-page/LandingPage";

import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';

import { cache } from 'react';

const fetchArticles = cache(async function fetchArticles() {
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
});

export const metadata = {
  title: "MainThread",
  description: "MainThread News Website",
}
export default async function Home() {

  try {
    const response = await fetchArticles();
    // pass till here
    return (
      <LandingPage response={response} />
    );
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return null;
  }
}
