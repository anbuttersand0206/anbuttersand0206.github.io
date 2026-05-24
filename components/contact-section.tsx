"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Mail, MapPin, Clock, Github } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "chocomint.15milk@gmail.com",
    href: "mailto:chocomint.15milk@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Saitama, Japan",
    href: null,
  },
  {
    icon: Clock,
    label: "Availability",
    value: "就業中。転職活動中です！",
    href: null,
  },
]

const socialLinks = [
  { icon: Github, href: "https://github.com/anbuttersand0206", label: "GitHub" },
]

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-24 md:py-32 relative bg-muted/30">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

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
              Get in Touch
            </motion.span>
            <div className="flex items-baseline gap-3 justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                Contact
              </h2>
              <span className="font-display font-semibold text-primary text-xl opacity-80">let&apos;s talk</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              プロジェクトのご相談や、お仕事のご依頼など、
              <br className="hidden md:block" />
              お気軽にご連絡ください。
            </p>
          </div>

          {/* コンタクト情報 */}
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="space-y-6 mb-10">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ソーシャルリンク */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-4">Connect with me</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/50 transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
