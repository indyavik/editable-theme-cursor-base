"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type BlogArticle = {
  slug: string;
  title: string;
  content: string;
  publishedAt?: string;
};

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched) {
      console.log("Blog detail: Already fetched, skipping");
      return;
    }

    console.log("Blog detail: Fetching article for", params.slug);
    
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/sites/summit-books-tax-seattle/blogs/${params.slug}`);
        const data = await response.json();
        setArticle(data);
        setHasFetched(true);
        console.log("Blog detail: Fetched article:", data.title);
      } catch (error) {
        console.error("Blog detail: Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug]); // Only depend on slug

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Articles
        </Link>
        <div>Loading...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white p-8">
        <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Articles
        </Link>
        <div>Article not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Articles
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Summit Books & Tax</h1>
        
        <article className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          {article.publishedAt && (
            <div className="text-sm text-gray-500 mb-6">
              {new Date(article.publishedAt).toLocaleDateString()}
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </div>
    </div>
  );
}
