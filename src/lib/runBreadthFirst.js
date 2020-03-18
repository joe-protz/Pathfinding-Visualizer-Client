// runs the Breadth First Algorithm and animates it, must pass in p5 from the grid component to allow drawing capabilities

const runBreadthFirst = function (p5) {
  const { openSet, closedSet, end } = this
  const { algorithm } = this.state

  if (algorithm === 'Breadth First') {
    // loop on the stack while it isnt empty
    if (openSet.length > 0) {
      const current = openSet[0]
      // remove current from openSet and add to closed
      openSet.shift()
      closedSet.push(current)

      // setting color vars
      current.open = false
      current.closed = true

      const neighbors = current.neighbors
      // if the neighbor is not in the closed set and is not a wall
      // add it to the closed set
      neighbors.forEach(neighbor => {
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          closedSet.push(neighbor)
          neighbor.closed = true
          // if we find the end, stop the algorithm
          if (neighbor === end) {
            neighbor.previous = current
            this.setState({ start: false })
            // otherwise, add each neighbor to the openset
          } else {
            openSet.push(neighbor)
            neighbor.open = true
            neighbor.previous = current
          }
          // for the draw loop
          this.path = []
          let temp = neighbor
          this.path.push(temp)
          while (temp.previous) {
            this.path.push(temp.previous)
            temp = temp.previous
          }
        }
      })
    } else {
      // no solution
      this.setState({ start: false })
    }
  }
}

export default runBreadthFirst
