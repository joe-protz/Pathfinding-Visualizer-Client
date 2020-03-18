// stop the draw loop and reset the path
const resetBoard = function () {
  this.path = []
  this.setState({ start: false })
}
export default resetBoard
