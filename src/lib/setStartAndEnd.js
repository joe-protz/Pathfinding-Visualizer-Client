// sets one cell to start and one cell to end the path
const setStartAndEnd = function () {
  this.start = this.cells[5][5]
  this.end = this.cells[this.cols - 5][this.rows - 5]
  this.start.start = true
  this.end.end = true
}

export default setStartAndEnd
