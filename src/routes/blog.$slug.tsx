import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getBlogPostBySlug } from "@/lib/queries";
import type { BlogPost } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Skeleton } from "@/components/ui/skeleton";
import { RenderMarkdown } from "@/lib/markdown";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug(params.slug);
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        title: "Publicación no encontrada — NEWEN",
      };
    }
    return {
      title: `${post.title} — NEWEN`,
      meta: [
        { name: "description", content: post.excerpt || post.title },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt || post.title },
        { property: "og:image", content: post.cover_url || "https://newen.com.uy/og-image.jpg" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: `https://newen.com.uy/blog/${post.slug}` }
      ]
    };
  },
});

function BlogPostPage() {
  const { post: initialPost } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [notFound, setNotFound] = useState(!initialPost);

  useEffect(() => {
    if (!initialPost) {
      getBlogPostBySlug(slug)
        .then((data) => {
          if (data) setPost(data);
          else setNotFound(true);
        })
        .catch(() => setNotFound(true));
    }
  }, [slug, initialPost]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar solid />
      <main className="pt-28 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link
            to="/"
            hash="blog"
            className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mb-8"
          >
            <ArrowLeft size={16} /> Volver al blog
          </Link>

          {notFound ? (
            <div className="text-center py-24">
              <h1 className="text-2xl font-bold mb-3">Publicación no encontrada</h1>
              <p className="text-muted-foreground">
                El artículo que buscás no existe o fue despublicado.
              </p>
            </div>
          ) : !post ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
              {post.published_at && (
                <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-8">
                  {format(new Date(post.published_at), "PPP", { locale: es })}
                </p>
              )}
              {post.cover_url && (
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-2xl mb-10 shadow-lg"
                />
              )}
              <div className="text-lg text-foreground/90">
                <RenderMarkdown content={post.content} />
              </div>
            </>
          )}
        </article>
      </main>
      <Footer settings={null} />
      <WhatsAppButton phoneNumber="59899738955" />
    </div>
  );
}
