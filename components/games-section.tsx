"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  LayoutGrid,
  Target,
  Lightbulb,
  Waypoints,
  Hash,
  Car,
  Grid3x3,
  type LucideIcon,
} from "lucide-react"

import { MemoryGame }    from "./games/memory-game"
import { PegSolitaire }  from "./games/peg-solitaire"
import { LightsOut }     from "./games/lights-out"
import { SnakeGame }     from "./games/snake-game"
import { Game2048 }      from "./games/game-2048"
import { CarDodge }      from "./games/car-dodge"
import { NumberPlace }   from "./games/number-place"

type GameId = "memory" | "peg" | "lights" | "snake" | "2048" | "dodge" | "number"

const GAME_LIST: Array<{ id: GameId; icon: LucideIcon; title: string; description: string }> = [
  { id: "memory",  icon: LayoutGrid, title: "メモリー",      description: "神経衰弱" },
  { id: "peg",     icon: Target,     title: "バニッシュ",    description: "ペグソリティア" },
  { id: "lights",  icon: Lightbulb,  title: "ライツアウト",  description: "全消灯パズル" },
  { id: "snake",   icon: Waypoints,  title: "スネーク",      description: "クラシックゲーム" },
  { id: "2048",    icon: Hash,       title: "2048",           description: "数字合体パズル" },
  { id: "dodge",   icon: Car,        title: "カーレース",    description: "障害物よけ" },
  { id: "number",  icon: Grid3x3,    title: "ナンプレ",      description: "4×4 数独" },
]

function renderActiveGame(gameId: GameId) {
  switch (gameId) {
    case "memory":  return <MemoryGame />
    case "peg":     return <PegSolitaire />
    case "lights":  return <LightsOut />
    case "snake":   return <SnakeGame />
    case "2048":    return <Game2048 />
    case "dodge":   return <CarDodge />
    case "number":  return <NumberPlace />
  }
}

export function GamesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeGameId, setActiveGameId] = useState<GameId>("memory")

  const activeGame = GAME_LIST.find(g => g.id === activeGameId)!

  return (
    <section id="games" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* セクションヘッダー */}
          <div className="text-center mb-12">
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-heading font-semibold tracking-widest uppercase text-xs mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Mini Games
            </motion.span>
            <div className="flex items-baseline gap-3 justify-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                Games Corner
              </h2>
              <span className="font-display font-semibold text-primary text-xl opacity-80">play!</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground font-heading font-light">携帯ミニゲーム機のときめきを求めて👀</p>
          </div>

          {/* ゲーム選択タブ */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {GAME_LIST.map(game => {
              const isActive = game.id === activeGameId
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGameId(game.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-200"
                  style={{
                    background: isActive ? "#C9B4F0" : "#3D305830",
                    color: isActive ? "#3D3058" : "#7C6F9F",
                    border: `1px solid ${isActive ? "#C9B4F0" : "#7C6F9F30"}`,
                  }}
                >
                  <game.icon size={13} />
                  <span className="hidden sm:inline">{game.title}</span>
                </button>
              )
            })}
          </motion.div>

          {/* ゲームコンソール本体 */}
          <motion.div
            className="mx-auto"
            style={{ maxWidth: 360 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            {/* コンソール外装 */}
            <div
              className="rounded-3xl p-3"
              style={{
                background: "linear-gradient(145deg, #E2D4F8, #f0eafe)",
                boxShadow: "0 16px 48px #C9B4F030, inset 0 1px 0 #ffffff90",
                border: "1px solid #C9B4F050",
              }}
            >
              {/* ロゴエリア */}
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#F06292" }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: "#FEF3B4", border: "1px solid #e0d090" }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: "#A8E6CF" }} />
                </div>
                <p className="flex items-center gap-1.5 text-xs font-heading font-bold tracking-widest" style={{ color: "#7C6F9F" }}>
                  <activeGame.icon size={11} />
                  {activeGame.title}
                </p>
                <div className="text-xs" style={{ color: "#C9B4F080" }}>▪▪▪</div>
              </div>

              {/* 画面エリア */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "#faf7ff",
                  boxShadow: "inset 0 2px 8px #C9B4F020",
                  minHeight: 200,
                }}
              >
                {renderActiveGame(activeGameId)}
              </div>

              {/* スピーカーグリル（装飾） */}
              <div className="flex justify-center gap-1 mt-3 pb-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-3 rounded-full"
                    style={{ background: "#C9B4F040" }}
                  />
                ))}
              </div>
            </div>

            {/* 説明テキスト */}
            <p className="text-center text-xs mt-3" style={{ color: "#7C6F9F60" }}>
              {activeGame.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
