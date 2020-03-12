import React from 'react'

const ResetBoardButton = (props) => {
  const { cells, resetBoard } = props

  const reset = () => {
    resetBoard()
    cells.forEach(row => row.forEach(cell => cell.reset()))
  }
  return (
    <button onClick={reset}>Reset Board</button>
  )
}

export default ResetBoardButton
