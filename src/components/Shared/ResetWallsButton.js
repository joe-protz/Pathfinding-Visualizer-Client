import React from 'react'

const ResetButton = (props) => {
  const { cells } = props

  const reset = () => {
    if (!props.running) {
      cells.forEach(row => row.forEach(cell => cell.resetWalls()))
    }
  }
  return (
    <button onClick={reset}>Reset Walls</button>
  )
}

export default ResetButton
