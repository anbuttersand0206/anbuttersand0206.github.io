"use client"

import { motion } from "framer-motion"
import { Heart, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-8 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* コピーライト */}
          <motion.p
            className="text-sm text-muted-foreground flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            © 2026 Hama.dev — Made with
            <Heart className="w-4 h-4 text-primary fill-primary" />
            & Code
          </motion.p>

          {/* 中央のテキスト */}
          <motion.p
            className="text-sm text-muted-foreground font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-primary">{"<"}</span>
            Dreaming in Code
            <span className="text-primary">{" />"}</span>
          </motion.p>

          {/* トップに戻るボタン */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 font-heading font-semibold tracking-widest uppercase text-xs text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
