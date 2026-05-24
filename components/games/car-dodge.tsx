"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

const LANE_COUNT = 3
const LANE_W = 60
const CANVAS_W = LANE_COUNT * LANE_W
const CANVAS_H = 300
const PLAYER_HEIGHT = 36
const PLAYER_WIDTH = 30
const OBSTACLE_H = 28
const OBSTACLE_W = 32
const INITIAL_OBSTACLE_SPEED = 3
const SPAWN_INTERVAL_MS = 1200
const TARGET_FRAME_MS = 16.67       // 60fps 基準のフレーム時間
const MAX_DELTA_MULTIPLIER = 3      // タブ非アクティブ後の巨大 delta を抑制するキャップ
const SPEED_INCREASE_INTERVAL_SEC = 10
const SPEED_INCREASE_PER_INTERVAL = 0.8

type Lane = 0 | 1 | 2
type GameStatus = "idle" | "playing" | "over"

interface Obstacle {
  lane: Lane
  y: number
}

function getLaneCenterX(lane: Lane): number {
  return lane * LANE_W + LANE_W / 2
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#faf7ff"
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.strokeStyle = "#C9B4F060"
  ctx.lineWidth = 1
  ctx.setLineDash([12, 8])
  for (let lane = 1; lane < LANE_COUNT; lane++) {
    const x = lane * LANE_W
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, CANVAS_H)
    ctx.stroke()
  }
  ctx.setLineDash([])
}

function drawPlayer(ctx: CanvasRenderingContext2D, lane: Lane) {
  const cx = getLaneCenterX(lane)
  const cy = CANVAS_H - PLAYER_HEIGHT - 12
  const w = PLAYER_WIDTH
  const h = PLAYER_HEIGHT

  ctx.fillStyle = "#C9B4F0"
  ctx.beginPath()
  // @ts-ignore - roundRect は一部ブラウザでサポート
  ctx.roundRect(cx - w / 2, cy, w, h, 4)
  ctx.fill()

  ctx.fillStyle = "#FEF3B4"
  ctx.fillRect(cx - w / 2 + 4, cy + 4, 8, 5)
  ctx.fillRect(cx + w / 2 - 12, cy + 4, 8, 5)

  ctx.fillStyle = "#3D3058"
  ctx.font = "bold 14px sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("▲", cx, cy + h - 6)
}

function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  const cx = getLaneCenterX(obstacle.lane)
  const w = OBSTACLE_W
  const h = OBSTACLE_H

  ctx.fillStyle = "#F06292"
  ctx.beginPath()
  // @ts-ignore - roundRect は一部ブラウザでサポート
  ctx.roundRect(cx - w / 2, obstacle.y, w, h, 3)
  ctx.fill()

  ctx.fillStyle = "#3D3058"
  ctx.font = "bold 12px sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("■", cx, obstacle.y + h - 6)
}

function drawOverlay(ctx: CanvasRenderingContext2D, status: GameStatus, score: number) {
  if (status === "idle") {
    ctx.fillStyle = "#f5f0fccc"
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = "#7C6F9F"
    ctx.font = "bold 13px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("タップでスタート", CANVAS_W / 2, CANVAS_H / 2)
  }
  if (status === "over") {
    ctx.fillStyle = "#f5f0fccc"
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = "#F06292"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 10)
    ctx.fillStyle = "#7C6F9F"
    ctx.font = "13px sans-serif"
    ctx.fillText(`${score} 秒`, CANVAS_W / 2, CANVAS_H / 2 + 14)
  }
}

export function CarDodge() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerLaneRef = useRef<Lane>(1)
  const obstaclesRef = useRef<Obstacle[]>([])
  const scoreSecRef = useRef(0)
  const obstacleSpeedRef = useRef(INITIAL_OBSTACLE_SPEED)
  const gameStatusRef = useRef<GameStatus>("idle")
  const animFrameRef = useRef<number>(0)
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scoreTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const touchStartXRef = useRef<number | null>(null)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawBackground(ctx)
    obstaclesRef.current.forEach(obs => drawObstacle(ctx, obs))
    if (gameStatusRef.current !== "idle") drawPlayer(ctx, playerLaneRef.current)
    drawOverlay(ctx, gameStatusRef.current, scoreSecRef.current)
  }, [])

  const endGame = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
    if (scoreTimerRef.current) clearInterval(scoreTimerRef.current)
    gameStatusRef.current = "over"
    setGameStatus("over")
    setHighScore(prev => Math.max(prev, scoreSecRef.current))
    redraw()
  }, [redraw])

  const gameLoop = useCallback((timestamp: number) => {
    if (gameStatusRef.current !== "playing") return

    // フレームレートに依存しないよう delta で速度調整
    const delta = Math.min((timestamp - lastFrameTimeRef.current) / TARGET_FRAME_MS, MAX_DELTA_MULTIPLIER)
    lastFrameTimeRef.current = timestamp

    const speed = obstacleSpeedRef.current * delta
    const playerCX = getLaneCenterX(playerLaneRef.current)
    const playerY = CANVAS_H - PLAYER_HEIGHT - 12

    // 障害物を動かして当たり判定
    let hitDetected = false
    obstaclesRef.current = obstaclesRef.current
      .map(obs => ({ ...obs, y: obs.y + speed }))
      .filter(obs => {
        const obsCX = getLaneCenterX(obs.lane)
        const horizontalHit = Math.abs(obsCX - playerCX) < (OBSTACLE_W + PLAYER_WIDTH) / 2 - 4
        const verticalHit = obs.y + OBSTACLE_H > playerY && obs.y < playerY + PLAYER_HEIGHT
        if (horizontalHit && verticalHit) hitDetected = true
        return obs.y < CANVAS_H
      })

    if (hitDetected) { endGame(); return }

    redraw()
    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [endGame, redraw])

  function startGame() {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
    if (scoreTimerRef.current) clearInterval(scoreTimerRef.current)
    cancelAnimationFrame(animFrameRef.current)

    playerLaneRef.current = 1
    obstaclesRef.current = []
    scoreSecRef.current = 0
    obstacleSpeedRef.current = INITIAL_OBSTACLE_SPEED
    gameStatusRef.current = "playing"
    lastFrameTimeRef.current = performance.now()
    setScore(0)
    setGameStatus("playing")

    spawnTimerRef.current = setInterval(() => {
      const lane = Math.floor(Math.random() * LANE_COUNT) as Lane
      obstaclesRef.current.push({ lane, y: -OBSTACLE_H })
      // 一定間隔ごとにスピードアップ
      const speedStage = Math.floor(scoreSecRef.current / SPEED_INCREASE_INTERVAL_SEC)
      obstacleSpeedRef.current = INITIAL_OBSTACLE_SPEED + speedStage * SPEED_INCREASE_PER_INTERVAL
    }, SPAWN_INTERVAL_MS)

    scoreTimerRef.current = setInterval(() => {
      scoreSecRef.current += 1
      setScore(scoreSecRef.current)
    }, 1000)

    animFrameRef.current = requestAnimationFrame(gameLoop)
  }

  function moveLane(direction: "left" | "right") {
    if (gameStatusRef.current === "idle" || gameStatusRef.current === "over") {
      startGame(); return
    }
    const current = playerLaneRef.current
    if (direction === "left" && current > 0) playerLaneRef.current = (current - 1) as Lane
    if (direction === "right" && current < LANE_COUNT - 1) playerLaneRef.current = (current + 1) as Lane
  }

  useEffect(() => {
    redraw()
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
      if (scoreTimerRef.current) clearInterval(scoreTimerRef.current)
    }
  }, [redraw])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "a") { e.preventDefault(); moveLane("left") }
      if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); moveLane("right") }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartXRef.current
    touchStartXRef.current = null
    if (Math.abs(dx) < 20) { startGame(); return }
    moveLane(dx < 0 ? "left" : "right")
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <span>生存時間: <strong style={{ color: "#E2D4F8" }}>{score}秒</strong></span>
        <span>ベスト: <strong style={{ color: "#C9B4F0" }}>{highScore}秒</strong></span>
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

      <div className="flex justify-center gap-3">
        <button
          onClick={() => moveLane("left")}
          className="w-12 h-10 rounded-lg text-lg flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "#E2D4F8", border: "1px solid #C9B4F0", color: "#3D3058" }}
        >←</button>
        <button
          onClick={() => moveLane("right")}
          className="w-12 h-10 rounded-lg text-lg flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "#E2D4F8", border: "1px solid #C9B4F0", color: "#3D3058" }}
        >→</button>
      </div>

      <p className="text-xs text-center" style={{ color: "#7C6F9F80" }}>
        ← → キー / スワイプで車線変更。障害物をよけて生き残れ！
      </p>
    </div>
  )
}
