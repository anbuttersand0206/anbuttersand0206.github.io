"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const skillCategories = [
  {
    title: "Frontend",
    color: "from-primary to-pink-400",
    skills: [
      { name: "React / Next.js",           level: 85 },
      { name: "Vue 3 / Nuxt 3",            level: 75 },
      { name: "TypeScript",                level: 80 },
      { name: "Tailwind CSS / Bootstrap",  level: 80 },
    ],
  },
  {
    title: "Backend",
    color: "from-accent to-cyan-400",
    skills: [
      { name: "Python / FastAPI",      level: 75 },
      { name: "PHP / Laravel",         level: 80 },
      { name: "Node.js / Express",     level: 70 },
      { name: "Java / Spring Boot",    level: 65 },
    ],
  },
  {
    title: "Infra / DevOps",
    color: "from-secondary to-purple-400",
    skills: [
      { name: "Docker",                    level: 75 },
      { name: "AWS (EC2 / Lambda / RDS)",  level: 65 },
      { name: "Linux (Ubuntu / AlmaLinux)",level: 70 },
      { name: "Nginx / Apache",            level: 65 },
    ],
  },
  {
    title: "DB / Others",
    color: "from-chart-5 to-orange-400",
    skills: [
      { name: "MySQL / SQLite",        level: 75 },
      { name: "FFmpeg / mediaMTX",     level: 55 },
      { name: "MediaPipe / OpenCV",    level: 55 },
      { name: "Git / GitHub Actions",  level: 75 },
    ],
  },
]

const technologies = [
  "Next.js / React", "Vue 3 / Nuxt 3", "TypeScript", "Svelte",
  "Python", "FastAPI", "PHP", "Laravel", "Node.js", "Java",
  "Docker", "AWS", "Azure", "Nginx", "Ubuntu", "Linux",
  "MySQL", "SQLite", "FFmpeg", "MediaPipe", "OpenCV",
  "GitHub Actions", "Playwright", "WebAssembly", "Socket.IO",
  "基本情報技術者", "AWS Cloud Practitioner", "Java Silver",
]

export function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="skills" className="py-24 md:py-32 relative bg-muted/30">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

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
              className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent-foreground font-heading font-semibold tracking-widest uppercase text-xs mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Skills & Technologies
            </motion.span>
            <div className="flex items-baseline gap-3 justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                Skill Set
              </h2>
              <span className="font-display font-semibold text-accent text-xl opacity-80">what i use</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
          </div>

          {/* スキルカテゴリ */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className="p-6 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.5 }}
              >
                <h3 className={`text-xl font-bold font-heading mb-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            delay: 0.5 + categoryIndex * 0.1 + skillIndex * 0.1,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* テクノロジータグ */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold font-heading tracking-widest uppercase text-foreground mb-6">
              Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.9 + index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
