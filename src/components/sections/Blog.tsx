import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getBlogPosts } from "@/lib/queries"
import type { BlogPost } from "@/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    getBlogPosts().then(setPosts).catch(console.error)
  }, [])

  if (posts.length === 0) return null

  return (
    <section id="blog" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Novedades y Blog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterate de nuestras últimas noticias, viajes y recomendaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.cover_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                  {post.published_at ? format(new Date(post.published_at), 'PPP', { locale: es }) : 'Reciente'}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <button className="text-primary font-semibold text-sm hover:underline">
                  Leer más →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
