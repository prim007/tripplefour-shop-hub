import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  sources: { title: string; url: string }[];
  published_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, sources, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (!error && data) setPosts(data as unknown as BlogPost[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Cannabis Blog SA — News & Guides | Tripplefour</title>
        <meta name="description" content="Read the latest CBD news, guides and tips for South Africa. Edibles, vapes, legal updates and more from Tripplefour." />
        <link rel="canonical" href="https://tripplefourshophub.online/blog" />
        <meta property="og:title" content="Cannabis Blog SA — News & Guides | Tripplefour" />
        <meta property="og:description" content="Latest cannabis news, guides & tips for South Africa." />
        <meta property="og:url" content="https://tripplefourshophub.online/blog" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Tripplefour Blog",
          "url": "https://tripplefourshophub.online/blog",
          "description": "Cannabis news, guides and tips for South Africa.",
          "blogPost": posts.slice(0, 10).map((p) => ({
            "@type": "BlogPosting",
            "headline": p.title,
            "url": `https://tripplefourshophub.online/blog/${p.slug}`,
            "datePublished": p.published_at
          }))
        })}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground">Blog</h1>
            <p className="mt-2 text-muted-foreground">
              Updates, stories & insights from the CBD world.
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border bg-card p-6">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-3 h-4 w-full rounded bg-muted" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No posts yet. Check back soon!</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.published_at).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h2 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>

                  {post.sources.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
                      {post.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {source.title}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
