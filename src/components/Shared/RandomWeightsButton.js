import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const RandomWeightsButton = props => {
  const { cells, start, end } = props

  const selectWeights = () => {
    if (!props.running) {
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
    }
  }
  return <PrimaryButton onClick={selectWeights}>Random Weights</PrimaryButton>
}

export default RandomWeightsButton
