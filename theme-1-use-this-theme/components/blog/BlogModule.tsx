"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/theme-config";
import { BlogListItem, BlogArticle } from "@/lib/blog-api.types";

type ClassNames = {
  root?: string;
  list?: string;
  card?: string;
  detail?: string;
};

type Props = {
  mode: "list" | "detail";
  slug?: string;
  page?: number;
  pageSize?: number;
  className?: ClassNames;
  siteSlug?: string;
};

// Move cache outside component to prevent recreation
const globalCache = new Map<string, any>();
let requestInProgress = new Set<string>();

async function fetchJSON<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : getApiUrl(path);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export default function BlogModule({ 
  mode, 
  slug, 
  page = 1, 
  pageSize = 10, 
  className, 
  siteSlug = "summit-books-tax-seattle" 
}: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const fetchedRef = useRef(false);

  // Create stable cache key
  const cacheKey = useMemo(() => {
    return `${mode}-${slug || 'list'}-${page}-${pageSize}-${siteSlug}`;
  }, [mode, slug, page, pageSize, siteSlug]);

  useEffect(() => {
    // Prevent multiple fetches
    if (fetchedRef.current) {
      console.log("BlogModule: Already fetched, skipping");
      return;
    }

    // Check if request is already in progress
    if (requestInProgress.has(cacheKey)) {
      console.log("BlogModule: Request already in progress for", cacheKey);
      return;
    }

    // Check cache first
    if (globalCache.has(cacheKey)) {
      console.log("BlogModule: Using cached data for", cacheKey);
      setData(globalCache.get(cacheKey));
      setLoading(false);
      fetchedRef.current = true;
      return;
    }

    console.log("BlogModule: Fetching data for", cacheKey);
    
    const fetchData = async () => {
      try {
        requestInProgress.add(cacheKey);
        setLoading(true);
        setError(null);
        
        let result;
        if (mode === "list") {
          result = await fetchJSON<{ items: BlogListItem[]; total: number }>(
            `/api/sites/${siteSlug}/blogs?status=published&page=${page}&pageSize=${pageSize}`
          );
        } else if (mode === "detail" && slug) {
          result = await fetchJSON<BlogArticle>(`/api/sites/${siteSlug}/blogs/${slug}`);
        }

        if (mountedRef.current && result) {
          setData(result);
          globalCache.set(cacheKey, result);
          fetchedRef.current = true;
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
        requestInProgress.delete(cacheKey);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      requestInProgress.delete(cacheKey);
    };
  }, [cacheKey, mode, slug, page, pageSize, siteSlug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      requestInProgress.delete(cacheKey);
      console.log("BlogModule: Unmounted and cleaned up", cacheKey);
    };
  }, [cacheKey]);

  if (loading) {
    return (
      <div className={className?.root}>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className?.root}>
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (mode === "list") {
    if (!data?.items?.length) {
      return (
        <div className={className?.root}>
          <div className="text-sm text-muted-foreground">No articles yet.</div>
        </div>
      );
    }

    return (
      <div className={className?.root}>
        <div className={className?.list || "space-y-8"}>
          {data.items.map((post: BlogListItem) => (
            <article key={post.slug} className={className?.card || "p-0"}>
              {post.coverImageUrl && (
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-44 object-cover rounded mb-3" />
              )}
              <h3 className="text-2xl font-bold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              {post.publishedAt && (
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
              {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    );
  }

  // Detail mode
  if (!slug || !data) {
    return <div className="text-sm text-red-500">Missing article slug or data.</div>;
  }

  return (
    <article className={className?.detail || "prose max-w-none"}>
      {data.coverImageUrl && (
        <img src={data.coverImageUrl} alt={data.title} className="w-full h-56 object-cover rounded mb-6" />
      )}
      <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
      {data.publishedAt && (
        <div className="text-sm text-muted-foreground mb-6">
          {new Date(data.publishedAt).toLocaleDateString()}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </article>
  );
}
