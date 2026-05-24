"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

type Direction = "left" | "right" | "up" | "down"
type Grid = number[][]

// 数値ごとのカラー（カラーパレット準拠）
const TILE_STYLE: Record<number, { bg: string; color: string; fontSize: string }> = {
  0:    { bg: "#E2D4F840",  color: "transparent",  fontSize: "1.25rem" },
  2:    { bg: "#E2D4F8",    color: "#3D3058",       fontSize: "1.5rem" },
  4:    { bg: "#C9B4F0",    color: "#3D3058",       fontSize: "1.5rem" },
  8:    { bg: "#F7B8D4",    color: "#3D3058",       fontSize: "1.5rem" },
  16:   { bg: "#F06292",    color: "#ffffff",       fontSize: "1.25rem" },
  32:   { bg: "#A8E6CF",    color: "#3D3058",       fontSize: "1.25rem" },
  64:   { bg: "#5BBFD6",    color: "#ffffff",       fontSize: "1.25rem" },
  128:  { bg: "#7DDCE4",    color: "#3D3058",       fontSize: "1rem" },
  256:  { bg: "#FEF3B4",    color: "#3D3058",       fontSize: "1rem" },
  512:  { bg: "#FDDDE6",    color: "#3D3058",       fontSize: "1rem" },
  1024: { bg: "#B2DFEE",    color: "#3D3058",       fontSize: "0.875rem" },
  2048: { bg: "#C9B4F0",    color: "#3D3058",       fontSize: "0.875rem" },
}

function getTileStyle(value: number) {
  return TILE_STYLE[value] ?? { bg: "#C9B4F0", color: "#3D3058", fontSize: "0.75rem" }
}

function slideRowLeft(row: number[]): { row: number[]; scoreGained: number } {
  const nonZero = row.filter(x => x !== 0)
  let scoreGained = 0
  const merged: number[] = []
  let i = 0

  while (i < nonZero.length) {
    const canMergeWithNext = i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]
    if (canMergeWithNext) {
      const mergedValue = nonZero[i] * 2
      merged.push(mergedValue)
      scoreGained += mergedValue
      i += 2
    } else {
      merged.push(nonZero[i])
      i++
    }
  }

  while (merged.length < 4) merged.push(0)
  return { row: merged, scoreGained }
}

function transpose(grid: Grid): Grid {
  return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
}

function reverseRows(grid: Grid): Grid {
  return grid.map(row => [...row].reverse())
}

function slideGrid(grid: Grid, direction: Direction): { grid: Grid; scoreGained: number } {
  let workingGrid = grid
  let scoreGained = 0

  if (direction === "right")  workingGrid = reverseRows(grid)
  if (direction === "up")     workingGrid = transpose(grid)
  if (direction === "down")   workingGrid = reverseRows(transpose(grid))

  const slidGrid = workingGrid.map(row => {
    const result = slideRowLeft(row)
    scoreGained += result.scoreGained
    return result.row
  })

  if (direction === "right")  return { grid: reverseRows(slidGrid), scoreGained }
  if (direction === "up")     return { grid: transpose(slidGrid), scoreGained }
  if (direction === "down")   return { grid: transpose(reverseRows(slidGrid)), scoreGained }
  return { grid: slidGrid, scoreGained }
}

function gridsAreIdentical(a: Grid, b: Grid): boolean {
  return a.every((row, r) => row.every((cell, c) => cell === b[r][c]))
}

function addRandomTile(grid: Grid): Grid {
  const emptyCells: [number, number][] = []
  grid.forEach((row, r) => row.forEach((cell, c) => { if (cell === 0) emptyCells.push([r, c]) }))
  if (emptyCells.length === 0) return grid

  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  const newGrid = grid.map(row => [...row])
  // 確率90%で2、10%で4
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
  return newGrid
}

function hasValidMoves(grid: Grid): boolean {
  if (grid.some(row => row.some(cell => cell === 0))) return true
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (r + 1 < 4 && grid[r][c] === grid[r + 1][c]) return true
      if (c + 1 < 4 && grid[r][c] === grid[r][c + 1]) return true
    }
  }
  return false
}

function createInitialGrid(): Grid {
  const empty: Grid = Array(4).fill(null).map(() => Array(4).fill(0))
  return addRandomTile(addRandomTile(empty))
}

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [hasWon, setHasWon] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const [keepPlaying, setKeepPlaying] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => { setGrid(createInitialGrid()) }, [])

  const handleSlide = useCallback((direction: Direction) => {
    if (isOver) return

    setGrid(prevGrid => {
      const { grid: newGrid, scoreGained } = slideGrid(prevGrid, direction)
      if (gridsAreIdentical(prevGrid, newGrid)) return prevGrid

      const withNewTile = addRandomTile(newGrid)

      setScore(prev => {
        const next = prev + scoreGained
        setBestScore(best => Math.max(best, next))
        return next
      })

      if (!keepPlaying && newGrid.some(row => row.includes(2048))) setHasWon(true)
      if (!hasValidMoves(withNewTile)) setIsOver(true)

      return withNewTile
    })
  }, [isOver, keepPlaying])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const dirMap: Record<string, Direction> = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down",
      }
      const dir = dirMap[e.key]
      if (!dir) return
      e.preventDefault()
      handleSlide(dir)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSlide])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return
    if (Math.abs(dx) > Math.abs(dy)) {
      handleSlide(dx > 0 ? "right" : "left")
    } else {
      handleSlide(dy > 0 ? "down" : "up")
    }
  }

  function resetGame() {
    setGrid(createInitialGrid())
    setScore(0)
    setHasWon(false)
    setIsOver(false)
    setKeepPlaying(false)
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <div className="flex gap-3">
          <span>スコア: <strong style={{ color: "#E2D4F8" }}>{score}</strong></span>
          <span>ベスト: <strong style={{ color: "#C9B4F0" }}>{bestScore}</strong></span>
        </div>
        <Button variant="ghost" size="sm" onClick={resetGame} className="h-6 w-6 p-0">
          <RefreshCw size={11} />
        </Button>
      </div>

      {/* 4×4 グリッド */}
      <div
        className="grid gap-2 mx-auto p-2 rounded-xl"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 240, background: "#E2D4F850" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const style = getTileStyle(cell)
            return (
              <div
                key={`${r}-${c}`}
                className="aspect-square rounded-lg flex items-center justify-center font-bold transition-all duration-100"
                style={{ background: style.bg, color: style.color, fontSize: style.fontSize }}
              >
                {cell !== 0 ? cell : ""}
              </div>
            )
          })
        )}
      </div>

      {/* 方向ボタン */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => handleSlide("up")}
          className="w-9 h-9 rounded-lg text-sm flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "#E2D4F8", border: "1px solid #C9B4F0", color: "#3D3058" }}
        >↑</button>
        <div className="flex gap-1">
          {(["left", "down", "right"] as Direction[]).map(dir => (
            <button
              key={dir}
              onClick={() => handleSlide(dir)}
              className="w-9 h-9 rounded-lg text-sm flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: "#E2D4F8", border: "1px solid #C9B4F0", color: "#3D3058" }}
            >
              {{ left: "←", down: "↓", right: "→" }[dir]}
            </button>
          ))}
        </div>
      </div>

      {hasWon && !keepPlaying && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#C9B4F015", border: "1px solid #C9B4F040" }}>
          <Trophy className="w-5 h-5 mx-auto mb-1" style={{ color: "#FEF3B4" }} />
          <p className="font-bold text-sm" style={{ color: "#E2D4F8" }}>2048 達成！🎉</p>
          <div className="flex gap-2 justify-center mt-2">
            <Button size="sm" onClick={() => setKeepPlaying(true)} className="text-xs h-7">続ける</Button>
            <Button size="sm" variant="outline" onClick={resetGame} className="text-xs h-7">新しく</Button>
          </div>
        </div>
      )}
      {isOver && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#F7B8D420", border: "1px solid #F7B8D4" }}>
          <p className="text-sm" style={{ color: "#c04070" }}>ゲームオーバー</p>
          <Button size="sm" onClick={resetGame} className="mt-2 text-xs h-7">もう一度</Button>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "#7C6F9F60" }}>
        ボタン / 矢印キー / スワイプで移動。同じ数字を合体させて 2048 を目指せ！
      </p>
    </div>
  )
}
