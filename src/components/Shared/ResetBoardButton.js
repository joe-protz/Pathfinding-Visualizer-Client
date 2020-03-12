import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const ResetBoardButton = (props) => {
  const { cells, resetBoard } = props

  const reset = () => {
    resetBoard()
    cells.forEach(row => row.forEach(cell => cell.reset()))
  }
  return (
    <PrimaryButton onClick={reset}>Reset Path</PrimaryButton>
  )
}

export default ResetBoardButton
