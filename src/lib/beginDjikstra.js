// initiate and allow A* to run in 'draw'
const beginDjikstra = function () {
  this.resetBoard()
  this.cells.forEach(row => row.forEach(cell => cell.reset()))
  this.findAllNeighbors()
  this.openSet = []
  this.closedSet = []
  this.openSet.push(this.start)
  this.start.open = true
  this.start.d = 0
  this.setState({ algorithm: 'Djikstra' })
}

export default beginDjikstra
