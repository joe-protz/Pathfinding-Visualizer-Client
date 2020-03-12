
export default class Cell {
  constructor (i, j, size, p5, wall) {
    // we add a reference to the p5 used in Grid.js to allow the cell to use p5 functions like 'square()'
    this.p5 = p5
    this.i = i
    this.j = j
    this.x = i * size
    this.y = j * size
    this.neighbors = []
    this.size = size
    this.recentlyClicked = false
    this.previous = undefined
    // A*
    this.f = 0
    this.g = 0
    this.h = 0
    // color vars
    this.wall = wall || false
    this.path = false
    this.closed = false
    this.open = false
    this.start = false
    this.end = false
  }
  show = () => {
    const { p5, x, y, size, wall, path, closed, open, start, end } = this
    if (path) return
    if (start || end) {
      p5.fill(200, 0, 200)
    } else if (wall) {
      p5.fill('#343A40')
    } else if (closed) {
      p5.fill(255, 0, 0, 50)
    } else if (open) {
      p5.fill(0, 255, 0, 50)
    } else p5.fill(255)

    p5.noStroke()
    p5.ellipse(x + size / 2, y + size / 2, size)
  }

  click = (mouseX, mouseY) => {
    if (
      this.p5.dist(mouseX - this.size, mouseY - this.size, this.x, this.y) <
      this.size / 2 &&
      !this.recentlyClicked
    ) {
      this.wall = !this.wall
      this.recentlyClicked = true
      setTimeout(() => { this.recentlyClicked = false }, 1000)
    }
  }
  reset = () => {
    this.path = false
    this.open = false
    this.closed = false
    this.previous = undefined
  }
  resetWalls = () => {
    this.wall = false
  }
  findNeighbors = (cells, cols, rows) => {
    const { i, j } = this
    if (i < cols - 1) this.neighbors.push(cells[i + 1][j])
    if (i > 0) this.neighbors.push(cells[i - 1][j])
    if (j < rows - 1) this.neighbors.push(cells[i][j + 1])
    if (j > 0) this.neighbors.push(cells[i][j - 1])
    // Diagonals below--------------------------------------------
    if (i > 0 && j > 0) {
      this.neighbors.push(cells[i - 1][j - 1])
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(cells[i + 1][j - 1])
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(cells[i - 1][j + 1])
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(cells[i + 1][j + 1])
    }
  }
}
