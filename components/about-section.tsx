"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Code2, Zap, Wrench, Heart } from "lucide-react"

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack",
    description: "フロントエンド・バックエンド・インフラまで幅広く対応",
  },
  {
    icon: Zap,
    title: "PoC 開発",
    description: "スピード感ある PoC から本番開発まで一気通貫で担当",
  },
  {
    icon: Wrench,
    title: "問題解決",
    description: "ドキュメントなし・ログなしの状況でもバグを根本解消",
  },
  {
    icon: Heart,
    title: "自己研鑽",
    description: "業務外でも技術習得・資格受験・個人開発を継続中。",
  },
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-24 md:py-32 relative">
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
              className="inline-block px-4 py-1 rounded-full bg-secondary/50 text-secondary-foreground font-heading font-semibold tracking-widest uppercase text-xs mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              About Me
            </motion.span>
            <div className="flex items-baseline gap-3 justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                About Me
              </h2>
              <span className="font-display font-semibold text-primary text-xl opacity-80">my story</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          {/* コンテンツ */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左側：テキスト */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="prose prose-lg">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  非IT職を経て、独学でエンジニアに転身しました。
                  現在は<span className="text-primary font-semibold">フロントエンドからバックエンド・インフラまで</span>フルスタックで担当できるエンジニアとして活動しています。
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  IoT・業務システム・映像配信・AI など多様な領域での PoC 開発を経験し、
                  スピード感が求められる現場での<span className="text-accent font-semibold">要件定義〜実装〜ドキュメント作成</span>を一気通貫で遂行してきました。
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  「作って動かして届ける」を大切に、技術選定からユーザー体験まで一貫して考えることが得意です。
                  プライベートでもコードを書き続けています。
                </p>
              </div>

              {/* ステータス */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="px-4 py-2 rounded-lg bg-card border border-border">
                  <span className="text-2xl font-bold text-primary">2+</span>
                  <span className="text-sm text-muted-foreground ml-2">Years Exp.</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-card border border-border">
                  <span className="text-2xl font-bold text-accent">10+</span>
                  <span className="text-sm text-muted-foreground ml-2">Projects</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-card border border-border">
                  <span className="text-2xl font-bold text-primary">100%</span>
                  <span className="text-sm text-muted-foreground ml-2">Passion</span>
                </div>
              </div>
            </motion.div>

            {/* 右側：ハイライトカード */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
