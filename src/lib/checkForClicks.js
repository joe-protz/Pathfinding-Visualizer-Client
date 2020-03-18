// if algorithm hasnt started check grid for mouse press and change cells
// to walls if clicked
const checkForClicks = function (p5) {
  if (p5.keyIsDown(p5.SHIFT) && p5.mouseIsPressed && !this.state.start) {
    const mouseX = p5.mouseX
    const mouseY = p5.mouseY
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].click(mouseX, mouseY, 'wgt')
      }
    }
  } else if (p5.mouseIsPressed && !this.state.start) {
    const mouseX = p5.mouseX
    const mouseY = p5.mouseY
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].click(mouseX, mouseY)
      }
    }
  }
}

export default checkForClicks
