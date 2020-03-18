// helper to toggle state of grid to editing or !editing

const toggleEditing = function () {
  this.setState({
    editing: !this.state.editing,
    start: this.state.editing
  })
  this.resetBoard()
}
export default toggleEditing
