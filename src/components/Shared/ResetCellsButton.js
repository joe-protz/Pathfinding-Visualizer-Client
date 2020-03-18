import React from 'react'
import { PrimaryButton } from './Styled_Components'

const ResetButton = (props) => {
  const { cells, running, msgAlert } = props

  const reset = () => {
    if (!running) {
      cells.forEach(row => row.forEach(cell => cell.resetCell()))
    } else {
      msgAlert({
        heading: 'Oops!',
        message:
          'Only able to reset cells when algorithm is not running',
        variant: 'danger'
      })
    }
  }
  return (
    <PrimaryButton onClick={reset}>Reset Cells</PrimaryButton>
  )
}

export default ResetButton
