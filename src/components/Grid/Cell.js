
export default class Cell {
  constructor (i, j, size, p5) {
    // we add a reference to the p5 used in Grid.js to allow the cell to use p5 functions like 'square()'
    this.p5 = p5
    this.i = i
    this.j = j
    this.x = i * size
    this.y = j * size
    this.size = size
  }
  show = () => {
    const { p5, x, y, size } = this

    p5.fill(255, 0, 0)

    p5.square(x, y, size)
  }
}
