"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  RefreshCw, Trophy, Clock, Zap,
  Heart, Star, Sun, Moon, Music, Sparkles, Gem, Cloud,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type IconPair = { component: LucideIcon; color: string }

const ICON_PAIRS: IconPair[] = [
  { component: Heart,    color: "#F06292" },
  { component: Star,     color: "#7C6F9F" },
  { component: Sun,      color: "#5BBFD6" },
  { component: Moon,     color: "#C9B4F0" },
  { component: Music,    color: "#A8E6CF" },
  { component: Sparkles, color: "#3D3058" },
  { component: Gem,      color: "#F7B8D4" },
  { component: Cloud,    color: "#5BBFD6" },
]

type MemoryCard = { id: number; iconIndex: number; position: number }

function shuffleCards(): MemoryCard[] {
  const doubled = ICON_PAIRS.flatMap((_, iconIndex) => [iconIndex, iconIndex])
  return doubled
    .map((iconIndex, id) => ({ iconIndex, id, position: 0 }))
    .sort(() => Math.random() - 0.5)
    .map((card, position) => ({ ...card, position }))
}

function formatElapsedTime(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60).toString().padStart(2, "0")
  const seconds = (totalSec % 60).toString().padStart(2, "0")
  return `${minutes}:${seconds}`
}

export function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedPositions, setFlippedPositions] = useState<number[]>([])
  const [matchedPositions, setMatchedPositions] = useState<Set<number>>(new Set())
  const [moveCount, setMoveCount] = useState(0)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isInputLocked = useRef(false)

  // クライアントのみで初期化してハイドレーションのミスマッチを防ぐ
  useEffect(() => { setCards(shuffleCards()) }, [])

  useEffect(() => {
    if (!hasStarted || isComplete) return
    timerRef.current = setInterval(() => setElapsedSec(s => s + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [hasStarted, isComplete])

  const handleCardClick = useCallback((position: number) => {
    if (isInputLocked.current) return
    if (flippedPositions.includes(position)) return
    if (matchedPositions.has(position)) return

    if (!hasStarted) setHasStarted(true)

    const newFlipped = [...flippedPositions, position]
    setFlippedPositions(newFlipped)

    if (newFlipped.length < 2) return

    isInputLocked.current = true
    setMoveCount(m => m + 1)

    const [posA, posB] = newFlipped
    const isMatch = cards[posA].iconIndex === cards[posB].iconIndex

    if (isMatch) {
      const newMatched = new Set([...matchedPositions, posA, posB])
      setMatchedPositions(newMatched)
      setFlippedPositions([])
      isInputLocked.current = false
      if (newMatched.size === cards.length) setIsComplete(true)
    } else {
      setTimeout(() => {
        setFlippedPositions([])
        isInputLocked.current = false
      }, 900)
    }
  }, [cards, flippedPositions, matchedPositions, hasStarted])

  function resetGame() {
    if (timerRef.current) clearInterval(timerRef.current)
    setCards(shuffleCards())
    setFlippedPositions([])
    setMatchedPositions(new Set())
    setMoveCount(0)
    setElapsedSec(0)
    setHasStarted(false)
    setIsComplete(false)
    isInputLocked.current = false
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <span className="flex items-center gap-1"><Clock size={11} />{formatElapsedTime(elapsedSec)}</span>
        <span className="flex items-center gap-1"><Zap size={11} />{moveCount} moves</span>
        <span>{matchedPositions.size / 2} / {ICON_PAIRS.length} pairs</span>
        <Button variant="ghost" size="sm" onClick={resetGame} className="h-6 w-6 p-0">
          <RefreshCw size={11} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.length === 0
          ? Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: "#E2D4F8" }} />
            ))
          : cards.map((card) => {
              const isFlipped = flippedPositions.includes(card.position)
              const isMatched = matchedPositions.has(card.position)
              const isRevealed = isFlipped || isMatched
              const { component: IconComponent, color: iconColor } = ICON_PAIRS[card.iconIndex]

              return (
                <button
                  key={`${card.id}-${card.position}`}
                  onClick={() => handleCardClick(card.position)}
                  className="aspect-square rounded-xl flex items-center justify-center transition-all duration-150 select-none"
                  style={{
                    background: isMatched ? "#A8E6CF40" : isFlipped ? "#E2D4F8" : "#C9B4F030",
                    border: `2px solid ${isMatched ? "#A8E6CF" : isFlipped ? "#C9B4F0" : "#C9B4F060"}`,
                    cursor: isMatched ? "default" : "pointer",
                  }}
                >
                  {isRevealed
                    ? <IconComponent size={22} style={{ color: iconColor }} />
                    : <span style={{ color: "#C9B4F080" }}>✦</span>
                  }
                </button>
              )
            })
        }
      </div>

      {isComplete && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#A8E6CF20", border: "1px solid #A8E6CF80" }}>
          <Trophy className="w-5 h-5 mx-auto mb-1" style={{ color: "#5BBFD6" }} />
          <p className="font-bold text-sm" style={{ color: "#3D3058" }}>クリア！✨</p>
          <p className="text-xs mt-0.5" style={{ color: "#7C6F9F" }}>{moveCount} moves · {formatElapsedTime(elapsedSec)}</p>
          <Button size="sm" onClick={resetGame} className="mt-2 text-xs h-7">もう一度</Button>
        </div>
      )}
    </div>
  )
}
