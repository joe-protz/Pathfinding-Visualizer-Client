// loop through all cells and run findNeighbors()
const findAllNeighbors = function () {
  this.cells.forEach(rowOfCells =>
    rowOfCells.forEach(cell =>
      cell.findNeighbors(this.cells, this.cols, this.rows)
    )
  )
}

export default findAllNeighbors
