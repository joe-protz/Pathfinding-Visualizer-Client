// while the algo is A* and there are still cells in openSet

const runDepthFirst = function (p5) {
  const { openSet, end, closedSet } = this
  const { algorithm } = this.state

  if (algorithm === 'depthFirst') {
    if (openSet.length > 0) {
      const current = openSet.pop()
      current.open = false

      this.path = []
      let temp = current
      this.path.push(temp)
      while (temp.previous) {
        this.path.push(temp.previous)
        temp = temp.previous
      }
      if (current === end) {
        this.setState({ algorithm: null })
      }
      if (!closedSet.includes(current)) {
        closedSet.push(current)
        current.closed = true
      }

      const neighbors = current.neighbors
      neighbors.forEach(neighbor => {
        if (!neighbor.wall && !closedSet.includes(neighbor) && !openSet.includes(neighbor)) {
          openSet.push(neighbor)
          neighbor.open = true
          neighbor.previous = current
        }
      })

      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j].path = false
        }
      }

      // for (let i = 0; i < this.path.length; i++) {
      //   this.path[i].path = true
      // }
    } else {
      // no solution
      this.setState({ algorithm: null })
    }
  }
}

export default runDepthFirst
