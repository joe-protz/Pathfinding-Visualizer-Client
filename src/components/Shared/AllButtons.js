import React from 'react'
import ResetBoardButton from './ResetBoardButton'
import RandomWallsButton from './RandomWallsButton'
import ResetWallsButton from './ResetWallsButton'
import AStarButton from './AStarButton'
import BreadthButton from './BreadthButton'
import DepthButton from './DepthButton'
const AllButtons = props => {
  const { running, cells, start, end, resetBoard, beginAStar, beginBreadth, beginDepth } = props
  return (
    <div className="center row">
      <AStarButton className="col-md-3" onClick={beginAStar} />
      <BreadthButton className="col-md-3" onClick={beginBreadth} />
      <DepthButton className="col-md-3" onClick={beginDepth} />
      <RandomWallsButton
        className="col-md-3"
        running={running}
        cells={cells}
        start={start}
        end={end}
      />

      <ResetBoardButton
        className="col-md-3"
        resetBoard={resetBoard}
        cells={cells}
      />
      <ResetWallsButton
        className="col-md-3"
        running={running}
        cells={cells}
      />
    </div>
  )
}

export default AllButtons
