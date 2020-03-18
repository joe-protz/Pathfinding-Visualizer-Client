// initiate and allow A* to run in 'draw'
const beginBreadth = function () {
  this.resetBoard()
  this.cells.forEach(row => row.forEach(cell => cell.reset()))
  this.findAllNeighbors()
  this.openSet = []
  this.closedSet = []
  this.openSet.push(this.start)
  this.start.open = true
  this.setState({ algorithm: 'Breadth First' })
}

export default beginBreadth
