import React from 'react'

const RandomWallsButton = props => {
  const { cells, start, end } = props

  const selectWalls = () => {
    if (!props.running) {
      cells.forEach(row => row.forEach(cell => {
        if (Math.random() < 0.3) {
          cell.wall = true
        } else {
          cell.wall = false
        }
      }))
    }
    start.wall = false
    end.wall = false
  }
  return <button onClick={selectWalls}>Random Walls</button>
}

export default RandomWallsButton
