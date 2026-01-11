
import { CheckCircle2, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen font-sans">
            {/* Header / Identity */}
            <div className="text-center mb-20">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">About this site</h1>
                <p className="text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                    This is a web-based platform dedicated to delivering timely news and clear analysis. 
                    We focus on technology and data, prioritizing quality and context over sensation. 
                    Our mission is to provide a clean, distraction-free reading experience for those who value substance.
                </p>
            </div>

            {/* Description */}
            <section className="mb-20 text-center">
                <p className="text-xl text-gray-800 leading-8 max-w-3xl mx-auto">
                    mainThread is a web-based platform dedicated to delivering timely news and clear analysis.
                    We focus on technology and data, prioritizing quality and context over sensation.
                    Our mission is to provide a clean, distraction-free reading experience for those who value substance.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                {/* Approach & Content */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-1 bg-black rounded-full"></span>
                        What We Deliver
                    </h2>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="mt-1">
                                <CheckCircle2 className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Curated News</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We filter the noise to bring you stories that actually impact the world of tech and data.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="mt-1">
                                <CheckCircle2 className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">In-Depth Analysis</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Beyond headlines, we provide the context and "why" behind the breaking news.
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Audience & Principles */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-1 bg-black rounded-full"></span>
                        Our Values
                    </h2>
                    <div className="space-y-6 text-lg text-gray-700">
                        <p className="leading-relaxed">
                            We write for the curious mind desiring quick updates without losing depth.
                            We believe in being <strong>neutral</strong>, <strong>clear</strong>, and <strong>transparent</strong>.
                        </p>
                        <p className="leading-relaxed">
                            No clickbait. No complex segmentation. Just the information you’re looking for, presented simply.
                        </p>
                    </div>
                </section>
            </div>

            {/* Transparency Note */}
            <section className="bg-gray-50 rounded-2xl p-8 mb-20 border border-gray-100 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white p-3 rounded-full shadow-sm">
                    <Shield className="w-8 h-8 text-gray-800" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency Statement</h3>
                    <p className="text-gray-600">
                        Our content is produced through a blend of internal writing and automated processes, with every piece reviewed by humans to ensure accuracy and quality.
                    </p>
                </div>
            </section>

            {/* Contact & Footer */}
            <section className="border-t border-gray-200 pt-12 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-600 font-medium">
                    <Link href="mailto:kingahmadilyas05@gmail.com" className="flex items-center gap-2 hover:text-black transition-colors">
                        <Mail className="w-5 h-5" />
                        kingahmadilyas05@gmail.com
                    </Link>
                    {/* <span className="hidden sm:inline text-gray-300">|</span>
                    <Link href="/privacy" className="hover:text-black transition-colors">
                        Privacy Policy
                    </Link>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <Link href="/terms" className="hover:text-black transition-colors">
                        Terms of Service
                    </Link> */}
                </div>
            </section>
        </div>
    );
}