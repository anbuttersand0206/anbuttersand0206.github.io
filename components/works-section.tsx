"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"

const works = [
  {
    title: "プリクラメーカー",
    description:
      "カメラ映像にリアルタイムでシールフレームを合成し、プリクラ風の写真を生成するWebアプリ。MediaPipeによる顔認識でフレームを自動位置合わせ。",
    gradient: "linear-gradient(135deg, #f7b8d4 0%, #fddde6 50%, #c9b4f0 100%)",
    tags: ["Svelte 5", "TypeScript", "Python", "FastAPI", "MediaPipe", "OpenCV", "Docker", "GSAP"],
    github: "https://github.com/anbuttersand0206/prikura",
    demo: null,
  },
  {
    title: "お絵描きチャット Neo",
    description:
      "WebAssemblyでコンパイルしたC++描画エンジンをブラウザで動かし、Socket.IOでリアルタイム共有するお絵描きチャットアプリ。Nginx + Dockerで自己ホスト可能。",
    gradient: "linear-gradient(135deg, #c9b4f0 0%, #7c6f9f 100%)",
    tags: ["TypeScript", "C++ / WASM", "Node.js", "Socket.IO", "Docker", "Nginx", "Emscripten"],
    github: null,
    demo: null,
  },
]

export function WorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="works" className="py-24 md:py-32 relative bg-muted/20">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent-foreground font-heading font-semibold tracking-widest uppercase text-xs mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Personal Development
            </motion.span>
            <div className="flex items-baseline gap-3 justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                Works
              </h2>
              <span className="font-display font-semibold text-accent text-xl opacity-80">side projects</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
          </div>

          {/* Works カード */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {works.map((work, index) => (
              <motion.article
                key={work.title}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                {/* ヘッダー画像 */}
                <div
                  className="h-44 relative overflow-hidden"
                  style={{ background: work.gradient }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent" />

                  {/* ホバー時のリンク */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {work.github && (
                      <motion.a
                        href={work.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="GitHubを見る"
                      >
                        <Github size={18} />
                      </motion.a>
                    )}
                    {work.demo && (
                      <motion.a
                        href={work.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="デモを見る"
                      >
                        <ExternalLink size={18} />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* カード本文 */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-snug">
                      {work.title}
                    </h3>
                    {work.github && (
                      <a
                        href={work.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="GitHubを見る"
                      >
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {work.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
