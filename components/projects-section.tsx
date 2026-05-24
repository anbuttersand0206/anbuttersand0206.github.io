"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Github, Lock } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "映像配信システム開発",
    description:
      "複数カメラの映像をリアルタイム配信するシステムの PoC。映像合成コンテナを必要に応じて増減。映像ストリームの制御・配信基盤を実装。",
    image: "linear-gradient(135deg, #c9b4f0 0%, #7c6f9f 50%, #3d3058 100%)",
    tags: ["Docker", "Linux", "Next.js", "Python", "Streaming"],
    featured: false,
  },
  {
    id: 2,
    title: "IoT データ可視化アプリ",
    description:
      "センサーデータをリアルタイム可視化するダッシュボード。インタラクティブなグラフ表示と PWA 対応を実装し、クラウドインフラ上で本番稼働。要件定義から本番リリースまで担当。",
    image: "linear-gradient(135deg, #f7b8d4 0%, #f06292 50%, #c9b4f0 100%)",
    tags: ["AWS", "Docker", "Laravel", "MySQL", "PWA", "Visualization"],
    featured: false,
  },
  {
    id: 3,
    title: "レガシーシステム保守開発",
    description:
      "既存 Java システムをリバースエンジニアリングし、バグ修正・機能追加を実施。Linux 環境でのビルドパイプライン整備も担当。",
    image: "linear-gradient(135deg, #a8e6cf 0%, #5bbfd6 100%)",
    tags: ["Java", "Linux", "Maven", "MySQL", "Spring Boot"],
    featured: false,
  },
  {
    id: 4,
    title: "Linuxデバイス向けアプリケーション開発",
    description:
      "Linux デバイス向けアプリケーションを Docker コンテナ化し、バックエンド・フロントエンドをパッケージとして整備。Shell Script による自動インストーラーも実装。",
    image: "linear-gradient(135deg, #fef3b4 0%, #f7b8d4 100%)",
    tags: ["Docker", "Linux", "PHP", "Python", "Shell Script"],
    featured: false,
  },
]

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* セクションタイトル */}
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading font-semibold tracking-widest uppercase text-xs mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Business Experience
            </motion.span>
            <div className="flex items-baseline gap-3 justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                Projects
              </h2>
              <span className="font-display font-semibold text-primary text-xl opacity-80">business works</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
              <Lock size={13} />
              業務プロジェクトのためリポジトリは非公開です
            </p>
          </div>

          {/* プロジェクトグリッド */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                {/* プロジェクト画像 */}
                <div
                  className="h-48 md:h-52 relative overflow-hidden"
                  style={{ background: project.image }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />

                  {/* GitHubアイコン（非公開表示） */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-sm text-muted-foreground">
                      <Lock size={14} />
                      Private Repository
                    </div>
                  </div>

                  {/* Featured バッジ */}
                  {project.featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>

                {/* プロジェクト情報 */}
                <div className="p-6">
                  <h3 className="text-lg font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
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

          {/* Works セクションへの誘導 */}
          <motion.p
            className="text-center text-sm text-muted-foreground mt-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            個人開発は{" "}
            <a href="#works" className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
              Works
            </a>{" "}
            セクションをご覧ください
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
