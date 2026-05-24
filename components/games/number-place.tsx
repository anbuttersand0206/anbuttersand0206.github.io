"use client"

import { useState } from "react"
import { RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

// -1=無効マス、0=空白、1〜9=数字
const PUZZLES: Array<{ board: number[][]; solution: number[][] }> = [
  {
    // Wikipedia の有名なサンプル問題
    board: [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9],
    ],
    solution: [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9],
    ],
  },
  {
    board: [
      [0,0,3,0,2,0,6,0,0],
      [9,0,0,3,0,5,0,0,1],
      [0,0,1,8,0,6,4,0,0],
      [0,0,8,1,0,2,9,0,0],
      [7,0,0,0,0,0,0,0,8],
      [0,0,6,7,0,8,2,0,0],
      [0,0,2,6,0,9,5,0,0],
      [8,0,0,2,0,3,0,0,9],
      [0,0,5,0,1,0,3,0,0],
    ],
    solution: [
      [4,8,3,9,2,1,6,5,7],
      [9,6,7,3,4,5,8,2,1],
      [2,5,1,8,7,6,4,9,3],
      [5,4,8,1,3,2,9,7,6],
      [7,2,9,5,6,4,1,3,8],
      [1,3,6,7,9,8,2,4,5],
      [3,7,2,6,8,9,5,1,4],
      [8,1,4,2,5,3,7,6,9],
      [6,9,5,4,1,7,3,8,2],
    ],
  },
  {
    board: [
      [0,0,0,2,6,0,7,0,1],
      [6,8,0,0,7,0,0,9,0],
      [1,9,0,0,0,4,5,0,0],
      [8,2,0,1,0,0,0,4,0],
      [0,0,4,6,0,2,9,0,0],
      [0,5,0,0,0,3,0,2,8],
      [0,0,9,3,0,0,0,7,4],
      [0,4,0,0,5,0,0,3,6],
      [7,0,3,0,1,8,0,0,0],
    ],
    solution: [
      [4,3,5,2,6,9,7,8,1],
      [6,8,2,5,7,1,4,9,3],
      [1,9,7,8,3,4,5,6,2],
      [8,2,6,1,9,5,3,4,7],
      [3,7,4,6,8,2,9,1,5],
      [9,5,1,7,4,3,6,2,8],
      [5,1,9,3,2,6,8,7,4],
      [2,4,8,9,5,7,1,3,6],
      [7,6,3,4,1,8,2,5,9],
    ],
  },
]

type Cell = { row: number; col: number }

function findConflictCells(board: number[][]): Set<string> {
  const conflicts = new Set<string>()

  const markConflicts = (cells: Cell[]) => {
    const seen = new Map<number, Cell[]>()
    cells.forEach(cell => {
      const val = board[cell.row][cell.col]
      if (val === 0) return
      if (!seen.has(val)) seen.set(val, [])
      seen.get(val)!.push(cell)
    })
    seen.forEach(duplicates => {
      if (duplicates.length > 1) {
        duplicates.forEach(({ row, col }) => conflicts.add(`${row}-${col}`))
      }
    })
  }

  for (let r = 0; r < 9; r++) {
    markConflicts(Array.from({ length: 9 }, (_, c) => ({ row: r, col: c })))
  }
  for (let c = 0; c < 9; c++) {
    markConflicts(Array.from({ length: 9 }, (_, r) => ({ row: r, col: c })))
  }
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const cells: Cell[] = []
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          cells.push({ row: blockRow * 3 + dr, col: blockCol * 3 + dc })
        }
      }
      markConflicts(cells)
    }
  }

  return conflicts
}

function isBoardFilled(board: number[][]): boolean {
  return board.every(row => row.every(cell => cell !== 0))
}

function boardsMatch(a: number[][], b: number[][]): boolean {
  return a.every((row, r) => row.every((cell, c) => cell === b[r][c]))
}

export function NumberPlace() {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [board, setBoard] = useState<number[][]>(() =>
    PUZZLES[0].board.map(row => [...row])
  )
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const puzzle = PUZZLES[puzzleIndex]
  const conflicts = findConflictCells(board)

  function handleCellClick(row: number, col: number) {
    if (isComplete) return
    if (puzzle.board[row][col] !== 0) return
    setSelectedCell({ row, col })
  }

  function handleNumberInput(num: number) {
    if (!selectedCell || isComplete) return
    const { row, col } = selectedCell
    if (puzzle.board[row][col] !== 0) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = board[row][col] === num ? 0 : num
    setBoard(newBoard)

    if (isBoardFilled(newBoard) && boardsMatch(newBoard, puzzle.solution)) {
      setIsComplete(true)
      setSelectedCell(null)
    }
  }

  function resetPuzzle() {
    setBoard(puzzle.board.map(row => [...row]))
    setSelectedCell(null)
    setIsComplete(false)
  }

  function nextPuzzle() {
    const next = (puzzleIndex + 1) % PUZZLES.length
    setPuzzleIndex(next)
    setBoard(PUZZLES[next].board.map(row => [...row]))
    setSelectedCell(null)
    setIsComplete(false)
  }

  return (
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-center text-xs" style={{ color: "#7C6F9F" }}>
        <span>パズル {puzzleIndex + 1} / {PUZZLES.length}</span>
        <Button variant="ghost" size="sm" onClick={resetPuzzle} className="h-6 w-6 p-0">
          <RefreshCw size={11} />
        </Button>
      </div>

      {/* 9×9 グリッド */}
      <div className="mx-auto" style={{ maxWidth: 270 }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(9, 1fr)",
            border: "2px solid #C9B4F080",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isFixed = puzzle.board[r][c] !== 0
              const isSelected = selectedCell?.row === r && selectedCell?.col === c
              const isConflict = conflicts.has(`${r}-${c}`)
              const isSameBlock =
                selectedCell !== null &&
                Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
                Math.floor(selectedCell.col / 3) === Math.floor(c / 3)
              const isSameRowOrCol =
                selectedCell !== null &&
                (selectedCell.row === r || selectedCell.col === c)

              const borderRight = (c + 1) % 3 === 0 && c !== 8
                ? "2px solid #C9B4F080"
                : "1px solid #C9B4F025"
              const borderBottom = (r + 1) % 3 === 0 && r !== 8
                ? "2px solid #C9B4F080"
                : "1px solid #C9B4F025"

              let bg = "#ffffff"
              if (isFixed) bg = "#E2D4F870"
              if (isSameRowOrCol || isSameBlock) bg = "#C9B4F010"
              if (isConflict) bg = "#F7B8D440"
              if (isSelected) bg = "#C9B4F030"

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className="aspect-square flex items-center justify-center font-bold transition-colors"
                  style={{
                    background: bg,
                    color: isConflict ? "#F06292" : isFixed ? "#3D3058" : "#7C6F9F",
                    borderRight,
                    borderBottom,
                    fontSize: "0.65rem",
                    cursor: isFixed ? "default" : "pointer",
                    outline: isSelected ? "2px solid #C9B4F060" : "none",
                    outlineOffset: "-2px",
                  }}
                  aria-label={`行${r + 1} 列${c + 1}: ${cell || "空"}`}
                >
                  {cell !== 0 ? cell : ""}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* 数字入力ボタン */}
      {!isComplete && (
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="w-7 h-7 rounded-md font-bold text-xs active:scale-90 transition-transform"
              style={{
                background: "#E2D4F8",
                border: "1px solid #C9B4F0",
                color: "#3D3058",
              }}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {isComplete && (
        <div className="text-center p-3 rounded-xl" style={{ background: "#C9B4F015", border: "1px solid #C9B4F040" }}>
          <Trophy className="w-5 h-5 mx-auto mb-1" style={{ color: "#C9B4F0" }} />
          <p className="font-bold text-sm" style={{ color: "#E2D4F8" }}>クリア！✨</p>
          <div className="flex gap-2 justify-center mt-2">
            <Button size="sm" onClick={nextPuzzle} className="text-xs h-7">次のパズル</Button>
            <Button size="sm" variant="outline" onClick={resetPuzzle} className="text-xs h-7">やり直し</Button>
          </div>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "#7C6F9F60" }}>
        セルを選んで数字を入力。各行・列・3×3に1〜9を重複なく！
      </p>
    </div>
  )
}
