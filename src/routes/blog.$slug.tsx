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

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getBlogPostBySlug(slug)
      .then((data) => {
        if (data) setPost(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — NEWEN`;
  }, [post]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
              <div className="prose-lg text-foreground/90 leading-relaxed whitespace-pre-line">
                {post.content}
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
