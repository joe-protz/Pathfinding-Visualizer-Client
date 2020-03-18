// reset the board and start the current algorithm visualization
const begin = function () {
  if (!this.state.algorithm) {
    this.props.msgAlert({
      heading: 'Oops!',
      message: 'Please Select an Algorithm First!',
      variant: 'danger'
    })
  } else {
    this.resetBoard()
    this.cells.forEach(row => row.forEach(cell => cell.reset()))
    this.findAllNeighbors()
    this.openSet = []
    this.closedSet = []
    this.openSet.push(this.start)
    this.start.open = true
    this.start.d = 0

    this.setState({ start: true,
      editing: false })
  }
}

export default begin
