import React from 'react'

const ResetButton = (props) => {
  const { cells } = props
  const reset = () => {
    cells.forEach(row => row.forEach(cell => cell.reset()))
  }
  return (
    <button onClick={reset}>Reset</button>
  )
}

export default ResetButton
