"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

const GRID_COLS = 14
const GRID_ROWS = 14
const CELL_PX = 20
const CANVAS_W = GRID_COLS * CELL_PX  // 280
const CANVAS_H = GRID_ROWS * CELL_PX  // 280
const TICK_MS = 160

type Direction = "up" | "down" | "left" | "right"
type Point = { x: number; y: number }
type GameStatus = "idle" | "playing" | "over"

const OPPOSITE: Record<Direction, Direction> = {
  up: "down", down: "up", left: "right", right: "left",
}

function randomFoodPosition(snakeBody: Point[]): Point {
  while (true) {
    const pos = { x: Math.floor(Math.random() * GRID_COLS), y: Math.floor(Math.random() * GRID_ROWS) }
    const isOnSnake = snakeBody.some(seg => seg.x === pos.x && seg.y === pos.y)
    if (!isOnSnake) return pos
  }
}

function drawGame(
  ctx: CanvasRenderingContext2D,
  snakeBody: Point[],
  foodPos: Point,
  gameStatus: GameStatus,
  score: number
) {
  ctx.fillStyle = "#faf7ff"
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.strokeStyle = "#C9B4F025"
  ctx.lineWidth = 0.5
  for (let x = 0; x <= CANVAS_W; x += CELL_PX) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
  }
  for (let y = 0; y <= CANVAS_H; y += CELL_PX) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
  }

  ctx.fillStyle = "#F06292"
  ctx.beginPath()
  ctx.arc(
    foodPos.x * CELL_PX + CELL_PX / 2,
    foodPos.y * CELL_PX + CELL_PX / 2,
    CELL_PX / 2 - 2, 0, Math.PI * 2
  )
  ctx.fill()

  snakeBody.forEach((seg, index) => {
    ctx.fillStyle = index === 0 ? "#F06292" : "#C9B4F0"
    const x = seg.x * CELL_PX + 1
    const y = seg.y * CELL_PX + 1
    const size = CELL_PX - 2
    ctx.beginPath()
    // @ts-ignore - roundRect は一部ブラウザでサポート
    ctx.roundRect(x, y, size, size, 3)
    ctx.fill()
  })

  if (gameStatus === "over") {
    ctx.fillStyle = "#f5f0fccc"
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = "#F06292"
    ctx.font = "bold 18px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 10)
    ctx.fillStyle = "#7C6F9F"
    ctx.font = "13px sans-serif"
    ctx.fillText(`スコア: ${score}`, CANVAS_W / 2, CANVAS_H / 2 + 14)
  }

  if (gameStatus === "idle") {
    ctx.fillStyle = "#7C6F9F"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("タップ / キーを押してスタート", CANVAS_W / 2, CANVAS_H / 2)
  }
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snakeRef = useRef<Point[]>([{ x: 7, y: 7 }])
  const foodRef = useRef<Point>({ x: 3, y: 3 })
  const directionRef = useRef<Direction>("right")
  const nextDirectionRef = useRef<Direction>("right")
  const gameStatusRef = useRef<GameStatus>("idle")
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    drawGame(ctx, snakeRef.current, foodRef.current, gameStatusRef.current, snakeRef.current.length - 1)
  }, [])

  const endGame = useCallback(() => {
    if (tickTimerRef.current) clearInterval(tickTimerRef.current)
    gameStatusRef.current = "over"
    const finalScore = snakeRef.current.length - 1
    setGameStatus("over")
    setHighScore(prev => Math.max(prev, finalScore))
    redrawCanvas()
  }, [redrawCanvas])

  const tick = useCallback(() => {
    const snake = snakeRef.current
    const head = snake[0]
    directionRef.current = nextDirectionRef.current

    const newHead: Point = {
      up:    { x: head.x, y: head.y - 1 },
      down:  { x: head.x, y: head.y + 1 },
      left:  { x: head.x - 1, y: head.y },
      right: { x: head.x + 1, y: head.y },
    }[directionRef.current]

    const hitWall = newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS
    if (hitWall) { endGame(); return }

    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      endGame(); return
    }

    const ateFood = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y
    const newSnake = ateFood ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)]
    snakeRef.current = newSnake

    if (ateFood) {
      foodRef.current = randomFoodPosition(newSnake)
      setScore(newSnake.length - 1)
    }

    redrawCanvas()
  }, [endGame, redrawCanvas])

  function startGame() {
    if (tickTimerRef.current) clearInterval(tickTimerRef.current)
    snakeRef.current = [{ x: 7, y: 7 }]
    foodRef.current = randomFoodPosition([{ x: 7, y: 7 }])
    directionRef.current = "right"
    nextDirectionRef.current = "right"
    gameStatusRef.current = "playing"
    setScore(0)
    setGameStatus("playing")
    tickTimerRef.current = setInterval(tick, TICK_MS)
    redrawCanvas()
  }

  function handleDirectionInput(dir: Direction) {
    if (gameStatusRef.current === "idle" || gameStatusRef.current === "over") {
      startGame(); return
    }
    // 逆方向への転換は無効
    if (dir === OPPOSITE[directionRef.current]) return
    nextDirectionRef.current = dir
  }

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const dirMap: Record<string, Direction> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      }
      const dir = dirMap[e.key]
      if (!dir) return
      e.preventDefault()
      handleDirectionInput(dir)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { if (tickTimerRef.current) clearInterval(tickTimerRef.current) }
  }, [])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      handleDirectionInput("right") // 短タップ = スタート
      return
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      handleDirectionInput(dx > 0 ? "right" : "left")
    } else {
      handleDirectionInput(dy > 0 ? "down" : "up")
    }
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <span>スコア: <strong style={{ color: "#E2D4F8" }}>{score}</strong></span>
        <span>ベスト: <strong style={{ color: "#C9B4F0" }}>{highScore}</strong></span>
        {gameStatus !== "idle" && (
          <Button variant="ghost" size="sm" onClick={startGame} className="h-6 px-2 text-xs">
            リスタート
          </Button>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-xl mx-auto block"
        style={{ maxWidth: "100%", cursor: "pointer" }}
        onClick={() => { if (gameStatus !== "playing") startGame() }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <div className="flex justify-center gap-1">
        {(["up", "down", "left", "right"] as Direction[]).map(dir => (
          <button
            key={dir}
            onClick={() => handleDirectionInput(dir)}
            className="w-9 h-9 rounded-lg text-sm flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: "#E2D4F8", border: "1px solid #C9B4F0", color: "#3D3058" }}
          >
            {{ up: "↑", down: "↓", left: "←", right: "→" }[dir]}
          </button>
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: "#7C6F9F80" }}>
        矢印キー / WASD / スワイプで操作。エサ（●）を食べて伸びよう！
      </p>
    </div>
  )
}
