// while the algo is A* and there are still cells in openSet

const runDepthFirst = function (p5) {
  const { openSet, end, closedSet } = this
  const { algorithm } = this.state

  if (algorithm === 'Depth First') {
    if (openSet.length > 0) {
      // in depth first, openSet is a stack
      // start by taking the top node off the stack
      const current = openSet.pop()
      current.open = false
      // drawing the current path
      this.path = []
      let temp = current
      this.path.push(temp)
      while (temp.previous) {
        this.path.push(temp.previous)
        temp = temp.previous
      }
      // we found a solution
      if (current === end) {
        this.setState({ start: false })
      }
      // if the node has yet to be marked as discovered, mark it
      if (!closedSet.includes(current)) {
        closedSet.push(current)
        current.closed = true
      }
      // if the neighbor if not a wall and is not in either stack, add it to
      // the open stack
      const neighbors = current.neighbors
      neighbors.forEach(neighbor => {
        if (
          !neighbor.wall &&
          !closedSet.includes(neighbor) &&
          !openSet.includes(neighbor)
        ) {
          openSet.push(neighbor)
          neighbor.open = true
          neighbor.previous = current
        }
      })
    } else {
      // no solution
      this.setState({ start: false })
    }
  }
}

export default runDepthFirst
