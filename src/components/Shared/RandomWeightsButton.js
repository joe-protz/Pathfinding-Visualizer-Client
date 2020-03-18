import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const RandomWeightsButton = props => {
  const { cells, start, end, msgAlert, running } = props

  const selectWeights = () => {
    if (!running) {
      cells.forEach(row =>
        row.forEach(cell => {
          if (Math.random() < 0.4 && !cell.wall) {
            cell.weighted = true
          } else {
            cell.weighted = false
          }
        })
      )
      start.wall = false
      end.wall = false
    } else {
      msgAlert({
        heading: 'Oops!',
        message: 'Only able to generate weighted cells when algorithm is not running',
        variant: 'danger'
      })
    }
  }
  return <PrimaryButton onClick={selectWeights}>Random Weights</PrimaryButton>
}

export default RandomWeightsButton
