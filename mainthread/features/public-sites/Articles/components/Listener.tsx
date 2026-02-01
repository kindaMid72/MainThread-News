'use client'

import { useEffect } from "react";

import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';
import { useParams } from "next/navigation";

export default function Listener() {

    // this component is used to increment the views of the article on page load

    const { articleSlug } = useParams();
    useEffect(() => {
        const incrementViews = () => {
            api.put(`/api/public/increment-views/${articleSlug}`);
        }
        incrementViews();
    }, []);

    return null;
}