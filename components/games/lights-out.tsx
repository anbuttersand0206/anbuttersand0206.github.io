"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 5

type Grid = boolean[][]

function createOffGrid(): Grid {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
}

function toggleCellAndNeighbors(grid: Grid, row: number, col: number): Grid {
  const newGrid = grid.map(r => [...r])
  const targets: [number, number][] = [
    [row, col],
    [row - 1, col], [row + 1, col],
    [row, col - 1], [row, col + 1],
  ]
  targets.forEach(([r, c]) => {
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      newGrid[r][c] = !newGrid[r][c]
    }
  })
  return newGrid
}

// 全消灯状態からランダムにクリックを重ねて必ず解ける盤面を生成する
function generateSolvablePuzzle(): Grid {
  let grid = createOffGrid()
  const clickCount = 8 + Math.floor(Math.random() * 8)
  for (let i = 0; i < clickCount; i++) {
    const row = Math.floor(Math.random() * GRID_SIZE)
    const col = Math.floor(Math.random() * GRID_SIZE)
    grid = toggleCellAndNeighbors(grid, row, col)
  }
  const isAllOff = grid.flat().every(cell => !cell)
  return isAllOff ? generateSolvablePuzzle() : grid
}

function isAllOff(grid: Grid): boolean {
  return grid.flat().every(cell => !cell)
}

export function LightsOut() {
  const [grid, setGrid] = useState<Grid>(createOffGrid)
  const [moveCount, setMoveCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)

  useEffect(() => {
    setGrid(generateSolvablePuzzle())
  }, [])

  function handleCellClick(row: number, col: number) {
    if (isComplete) return
    const newGrid = toggleCellAndNeighbors(grid, row, col)
    const newMoveCount = moveCount + 1
    setGrid(newGrid)
    setMoveCount(newMoveCount)

    if (isAllOff(newGrid)) {
      setIsComplete(true)
      if (bestScore === null || newMoveCount < bestScore) {
        setBestScore(newMoveCount)
      }
    }
  }

  function resetGame() {
    setGrid(generateSolvablePuzzle())
    setMoveCount(0)
    setIsComplete(false)
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <span>{moveCount} 手</span>
        {bestScore !== null && <span>ベスト: {bestScore} 手</span>}
        <Button variant="ghost" size="sm" onClick={resetGame} className="h-6 w-6 p-0">
          <RefreshCw size={11} />
        </Button>
      </div>

      <div
        className="grid gap-2 mx-auto"
        style={{ gridTemplateColumns: "repeat(5, 1fr)", maxWidth: 230 }}
      >
        {grid.map((row, rowIndex) =>
          row.map((isLit, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className="aspect-square rounded-xl transition-all duration-150 active:scale-90"
              style={{
                background: isLit ? "#FEF3B4" : "#E2D4F860",
                border: `2px solid ${isLit ? "#F06292" : "#C9B4F060"}`,
                boxShadow: isLit ? "0 0 10px #FEF3B480, 0 0 3px #F0629240" : "none",
                cursor: isComplete ? "default" : "pointer",
              }}
              aria-label={isLit ? "点灯" : "消灯"}
            />
          ))
        )}
      </div>

      {isComplete && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#A8E6CF20", border: "1px solid #A8E6CF80" }}>
          <Trophy className="w-5 h-5 mx-auto mb-1" style={{ color: "#5BBFD6" }} />
          <p className="font-bold text-sm" style={{ color: "#3D3058" }}>全消灯！✨</p>
          <p className="text-xs mt-0.5" style={{ color: "#7C6F9F" }}>{moveCount} 手でクリア</p>
          <Button size="sm" onClick={resetGame} className="mt-2 text-xs h-7">次のパズル</Button>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "#7C6F9F80" }}>
        マスを押すと、そのマスと上下左右が反転。全部消灯させよう！
      </p>
    </div>
  )
}
