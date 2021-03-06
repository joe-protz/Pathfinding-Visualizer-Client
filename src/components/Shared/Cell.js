
export default class Cell {
  constructor (i, j, size, p5, wall, weighted) {
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
    // Djikstra
    this.d = Infinity
    // color vars
    this.weighted = weighted || false
    this.wall = wall || false
    this.closed = false
    this.open = false
    this.start = false
    this.end = false
  }
  show = () => {
    const { p5, x, y, size, wall, closed, open, start, end, weighted } = this
    if (start || end) {
      p5.fill(200, 0, 200)
    } else if (wall) {
      p5.fill('#343A40')
    } else if (open && weighted) {
      p5.fill(0, 255, 0)
    } else if (open) {
      p5.fill(0, 255, 0, 50)
    } else if (closed && weighted) {
      p5.fill(255, 0, 0)
    } else if (closed) {
      p5.fill(255, 0, 0, 50)
    } else if (weighted) {
      p5.fill(10, 55, 242)
    } else p5.fill(255)

    p5.noStroke()
    p5.ellipse(x + size / 2, y + size / 2, size)
  }
  // if the cell hasn't been clicked in the last second, toggle it's 'wall'
  // property
  click = (mouseX, mouseY, wgt) => {
    if (
      !this.weighted &&
      this.p5.dist(mouseX - this.size, mouseY - this.size, this.x, this.y) <
      this.size / 2 &&
      !this.recentlyClicked && !this.start && !this.end && !wgt
    ) {
      this.wall = !this.wall
      this.recentlyClicked = true
      setTimeout(() => { this.recentlyClicked = false }, 1000)
      // weighted
    } else if (!this.wall && wgt &&
      this.p5.dist(mouseX - this.size, mouseY - this.size, this.x, this.y) <
      this.size / 2 &&
      !this.recentlyClicked && !this.start && !this.end
    ) {
      this.weighted = !this.weighted
      this.recentlyClicked = true
      setTimeout(() => {
        this.recentlyClicked = false
      }, 1000)
    }
  }
  reset = () => {
    this.path = false
    this.open = false
    this.closed = false
    this.previous = undefined
  }
  resetCell = () => {
    this.wall = false
    this.weighted = false
  }

  setSize = (size) => {
    this.size = size
    this.x = this.i * size
    this.y = this.j * size
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
