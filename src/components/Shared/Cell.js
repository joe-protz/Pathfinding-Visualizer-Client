
export default class Cell {
  constructor (i, j, size, p5, wall) {
    // we add a reference to the p5 used in Grid.js to allow the cell to use p5 functions like 'square()'
    this.p5 = p5
    this.i = i
    this.j = j
    this.x = i * size
    this.y = j * size
    this.size = size
    this.wall = wall || false
    this.recentlyClicked = false
  }
  show = () => {
    const { p5, x, y, size } = this
    if (this.wall) p5.fill(0)
    if (!this.wall) p5.fill(255)
    p5.square(x, y, size)
  }
  click = (mouseX, mouseY) => {
    if (
      this.p5.dist(mouseX - this.size / 2, mouseY - this.size / 2, this.x, this.y) <
      this.size / 2 &&
      !this.recentlyClicked
    ) {
      this.wall = !this.wall
      this.recentlyClicked = true
      setTimeout(() => { this.recentlyClicked = false }, 1000)
    }
  }
}
