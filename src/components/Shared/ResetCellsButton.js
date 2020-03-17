import React from 'react'
import { PrimaryButton } from './Styled_Components'

const ResetButton = (props) => {
  const { cells } = props

  const reset = () => {
    if (!props.running) {
      cells.forEach(row => row.forEach(cell => cell.resetCell()))
    }
  }
  return (
    <PrimaryButton onClick={reset}>Reset Cells</PrimaryButton>
  )
}

export default ResetButton
