"use client"

import { useState } from "react"
import { RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

// 7×7グリッド。-1=無効マス、0=穴、1=駒
// 英語式ペグソリティア（33個の駒、中央が初期空き）
const INITIAL_BOARD: number[][] = [
  [-1, -1,  1,  1,  1, -1, -1],
  [-1, -1,  1,  1,  1, -1, -1],
  [ 1,  1,  1,  1,  1,  1,  1],
  [ 1,  1,  1,  0,  1,  1,  1],
  [ 1,  1,  1,  1,  1,  1,  1],
  [-1, -1,  1,  1,  1, -1, -1],
  [-1, -1,  1,  1,  1, -1, -1],
]

type Cell = [number, number]
type GameStatus = "playing" | "win" | "stuck"

function cloneBoard(board: number[][]): number[][] {
  return board.map(row => [...row])
}

function countPegs(board: number[][]): number {
  return board.flat().filter(cell => cell === 1).length
}

function findValidDestinations(board: number[][], fromRow: number, fromCol: number): Cell[] {
  const directions: Cell[] = [[-2, 0], [2, 0], [0, -2], [0, 2]]
  return directions
    .map(([dr, dc]): Cell => [fromRow + dr, fromCol + dc])
    .filter(([destRow, destCol]) => {
      if (destRow < 0 || destRow >= 7 || destCol < 0 || destCol >= 7) return false
      if (board[destRow][destCol] !== 0) return false
      const midRow = (fromRow + destRow) / 2
      const midCol = (fromCol + destCol) / 2
      return board[midRow][midCol] === 1
    })
}

function hasAnyValidMove(board: number[][]): boolean {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === 1 && findValidDestinations(board, r, c).length > 0) return true
    }
  }
  return false
}

function applyMove(board: number[][], fromRow: number, fromCol: number, destRow: number, destCol: number): number[][] {
  const midRow = (fromRow + destRow) / 2
  const midCol = (fromCol + destCol) / 2
  const newBoard = cloneBoard(board)
  newBoard[fromRow][fromCol] = 0
  newBoard[midRow][midCol] = 0
  newBoard[destRow][destCol] = 1
  return newBoard
}

export function PegSolitaire() {
  const [board, setBoard] = useState<number[][]>(() => cloneBoard(INITIAL_BOARD))
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
  const [validDestinations, setValidDestinations] = useState<Cell[]>([])
  const [moveCount, setMoveCount] = useState(0)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")

  function handleCellClick(row: number, col: number) {
    if (gameStatus !== "playing") return

    const isValidDest = validDestinations.some(([r, c]) => r === row && c === col)
    if (isValidDest && selectedCell) {
      const [fromRow, fromCol] = selectedCell
      const newBoard = applyMove(board, fromRow, fromCol, row, col)
      setBoard(newBoard)
      setSelectedCell(null)
      setValidDestinations([])
      setMoveCount(prev => prev + 1)

      if (countPegs(newBoard) === 1) {
        setGameStatus("win")
      } else if (!hasAnyValidMove(newBoard)) {
        setGameStatus("stuck")
      }
      return
    }

    if (board[row][col] === 1) {
      const destinations = findValidDestinations(board, row, col)
      setSelectedCell([row, col])
      setValidDestinations(destinations)
      return
    }

    setSelectedCell(null)
    setValidDestinations([])
  }

  function resetGame() {
    setBoard(cloneBoard(INITIAL_BOARD))
    setSelectedCell(null)
    setValidDestinations([])
    setMoveCount(0)
    setGameStatus("playing")
  }

  const remainingPegs = countPegs(board)

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <span>残り <strong style={{ color: "#3D3058" }}>{remainingPegs}</strong> 個</span>
        <span>{moveCount} 手</span>
        <Button variant="ghost" size="sm" onClick={resetGame} className="h-6 w-6 p-0">
          <RefreshCw size={11} />
        </Button>
      </div>

      <div
        className="grid gap-1 mx-auto"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", maxWidth: 252 }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (cell === -1) {
              return <div key={`${rowIndex}-${colIndex}`} className="aspect-square" />
            }

            const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
            const isValidDest = validDestinations.some(([r, c]) => r === rowIndex && c === colIndex)
            const isEmpty = cell === 0

            let bg = "#E2D4F850"
            let border = "#C9B4F040"
            if (!isEmpty && isSelected) { bg = "#F06292"; border = "#F06292" }
            else if (!isEmpty)          { bg = "#C9B4F0"; border = "#9d8fd4" }
            else if (isValidDest)       { bg = "#A8E6CF80"; border = "#5BBFD6" }

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className="aspect-square rounded-full transition-all duration-100"
                style={{ background: bg, border: `2px solid ${border}`, cursor: isEmpty && !isValidDest ? "default" : "pointer" }}
                aria-label={isEmpty ? "穴" : "駒"}
              />
            )
          })
        )}
      </div>

      {gameStatus === "win" && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#A8E6CF20", border: "1px solid #A8E6CF80" }}>
          <Trophy className="w-5 h-5 mx-auto mb-1" style={{ color: "#5BBFD6" }} />
          <p className="font-bold text-sm" style={{ color: "#3D3058" }}>クリア！✨</p>
          <p className="text-xs mt-0.5" style={{ color: "#7C6F9F" }}>{moveCount} 手でクリア</p>
          <Button size="sm" onClick={resetGame} className="mt-2 text-xs h-7">もう一度</Button>
        </div>
      )}
      {gameStatus === "stuck" && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#F7B8D420", border: "1px solid #F7B8D4" }}>
          <p className="text-sm" style={{ color: "#c04070" }}>詰まりました... 残り {remainingPegs} 個</p>
          <Button size="sm" onClick={resetGame} className="mt-2 text-xs h-7">リトライ</Button>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "#7C6F9F80" }}>
        駒（紫）を選んで、飛び越せる穴（緑）へ移動。最後の1個を目指せ！
      </p>
    </div>
  )
}
