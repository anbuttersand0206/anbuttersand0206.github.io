"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const roles = [
  "Full-Stack Developer",
  "PoC Engineer",
  "Creative Coder",
]

export function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const role = roles[currentRole]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseDuration = 2000

    if (!isDeleting && displayText === role) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
      return
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false)
      setCurrentRole((prev) => (prev + 1) % roles.length)
      return
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? prev.slice(0, -1) : role.slice(0, prev.length + 1)
      )
    }, typingSpeed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayText, isDeleting, currentRole])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* グラデーションオーブ */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--glow-pink), transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--glow-cyan), transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--glow-purple), transparent 60%)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* キャッチコピー */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-heading font-semibold tracking-widest uppercase text-xs text-primary">Welcome to my portfolio</span>
          </motion.div>

          {/* メインタイトル */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
            <span className="block text-foreground">Hello, I&apos;m</span>
            <motion.span
              className="block"
              style={{
                background: "linear-gradient(120deg, var(--glow-purple) 0%, var(--glow-pink) 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Hama
            </motion.span>
          </h1>

          {/* タイピングアニメーション */}
          <div className="h-12 md:h-16 flex items-center justify-center mb-8">
            <span className="text-xl md:text-3xl text-foreground/70 font-mono">
              &lt;
            </span>
            <span className="text-xl md:text-3xl text-primary font-mono mx-2">
              {displayText}
            </span>
            <motion.span
              className="w-0.5 h-6 md:h-8 bg-primary"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-xl md:text-3xl text-foreground/70 font-mono">
              /&gt;
            </span>
          </div>

          {/* 説明文 */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-heading font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            非IT職を経て、エンジニアへ転身。
            <br className="hidden md:block" />
            フロントエンドからインフラまで、要件定義から本番リリースまで一気通貫で担当します。
          </motion.p>

          {/* CTAボタン */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              size="lg"
              className="px-8 py-6 text-sm font-heading font-semibold tracking-widest uppercase hover:scale-105 transition-transform"
              asChild
            >
              <a href="#projects">
                View Projects
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-sm font-heading font-semibold tracking-widest uppercase hover:bg-primary/10"
              asChild
            >
              <a href="#contact">
                Contact Me
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* スクロールインジケーター */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <a
          href="#about"
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
          aria-label="下にスクロール"
        >
          <span className="font-heading tracking-widest uppercase text-xs mb-2">Scroll</span>
          <ChevronDown size={24} />
        </a>
      </motion.div>
    </section>
  )
}
