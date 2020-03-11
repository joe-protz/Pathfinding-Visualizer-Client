import Cell from './Cell'

class AStarCell extends Cell {
  constructor (i, j, size, p5, wall) {
    super(i, j, size, p5, wall)
    this.f = 0
    this.g = 0
    this.h = 0
  }

  showClosed = () => {
    this.dontShow = true
    const { p5, x, y, size } = this
    p5.fill(255, 0, 0)
    p5.square(x, y, size)
  }
  showOpen = () => {
    this.dontShow = true
    const { p5, x, y, size } = this
    p5.fill(0, 255, 0)
    p5.square(x, y, size)
  }
  showPath = () => {
    this.dontShow = true
    const { p5, x, y, size } = this
    p5.fill(0, 0, 255)
    p5.square(x, y, size)
  }
}

export default AStarCell
