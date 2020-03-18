import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const RandomWallsButton = props => {
  const { cells, start, end, running, msgAlert, editing } = props

  const selectWalls = () => {
    if (!running && editing) {
      cells.forEach(row => row.forEach(cell => {
        if (Math.random() < 0.4 && !cell.weighted) {
          cell.wall = true
        } else {
          cell.wall = false
        }
      }))
      start.wall = false
      end.wall = false
    } else if (running) {
      msgAlert({
        heading: 'Oops!',
        message: 'Only able to generate walls when algorithm is not running',
        variant: 'danger'
      })
    } else {
      msgAlert({
        heading: 'Oops!',
        message: 'Only able to generate walls when in edit mode, click enable editing to begin',
        variant: 'danger'
      })
    }
  }
  return <PrimaryButton onClick={selectWalls}>Random Walls</PrimaryButton>
}

export default RandomWallsButton
