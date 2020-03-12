import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const ResetButton = (props) => {
  const { cells } = props

  const reset = () => {
    if (!props.running) {
      cells.forEach(row => row.forEach(cell => cell.resetWalls()))
    }
  }
  return (
    <PrimaryButton onClick={reset}>Reset Walls</PrimaryButton>
  )
}

export default ResetButton
