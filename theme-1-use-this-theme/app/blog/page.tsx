"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetched) {
      console.log("Blog page: Already fetched, skipping");
      return;
    }

    console.log("Blog page: Fetching posts...");
    
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/sites/summit-books-tax-seattle/blogs?status=published");
        const data = await response.json();
        setPosts(data.items || []);
        setHasFetched(true);
        console.log("Blog page: Fetched", data.items?.length || 0, "posts");
      } catch (error) {
        console.error("Blog page: Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold mb-8">Summit Books & Tax</h1>
        <h2 className="text-2xl font-bold mb-8">Latest Articles & Insights</h2>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-4">Summit Books & Tax</h1>
      <h2 className="text-2xl font-bold mb-8">Latest Articles & Insights</h2>
      
      <div className="max-w-3xl">
        {posts.length === 0 ? (
          <div className="text-gray-500">No articles yet.</div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border-b pb-6">
                <h3 className="text-xl font-bold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline text-blue-600">
                    {post.title}
                  </Link>
                </h3>
                {post.publishedAt && (
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                )}
                {post.excerpt && (
                  <p className="text-gray-700">{post.excerpt}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
