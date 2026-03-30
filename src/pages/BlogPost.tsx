import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import SocialShare from "@/components/SocialShare";
import { Analytics } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  sources: { title: string; url: string }[];
  published_at: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, content, cover_image, sources, published_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (!error && data) setPost(data as unknown as BlogPostData);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-12">
          <div className="mx-auto max-w-3xl animate-pulse space-y-4">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">Post not found</h1>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <article className="mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(post.published_at).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>

          <SocialShare
            url={`/blog/${post.slug}`}
            title={post.title}
            campaign="blog_share"
            className="mt-4"
          />

          <div className="prose-custom mt-8 space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line text-[15px]">
            {post.content}
          </div>

          {post.sources.length > 0 && (
            <div className="mt-10 rounded-xl border bg-card p-5">
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Sources</h3>
              <ul className="space-y-2">
                {post.sources.map((source, idx) => (
                  <li key={idx}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Chat CTA */}
          <div className="mt-10 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-3xl mb-2">🌿</p>
            <h3 className="font-display text-lg font-bold text-foreground">
              Got questions about this topic?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask Cuddles AI — your groovy cannabis assistant is just a click away!
            </p>
            <button
              onClick={() => {
                Analytics.blogChatOpened(post.slug);
                // Trigger the chatbot by clicking the floating button
                const chatBtn = document.querySelector('[aria-label="Open Cuddles AI chat"]') as HTMLButtonElement;
                if (chatBtn) chatBtn.click();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Cuddles ✌️
            </button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
