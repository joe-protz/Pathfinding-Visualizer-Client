import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const RandomWallsButton = props => {
  const { cells, start, end } = props

  const selectWalls = () => {
    if (!props.running) {
      cells.forEach(row => row.forEach(cell => {
        if (Math.random() < 0.4) {
          cell.wall = true
        } else {
          cell.wall = false
        }
      }))
      start.wall = false
      end.wall = false
    }
  }
  return <PrimaryButton onClick={selectWalls}>Random Walls</PrimaryButton>
}

export default RandomWallsButton
