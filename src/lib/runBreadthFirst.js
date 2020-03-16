// while the algo is A* and there are still cells in openSet

const runBreadthFirst = function (p5) {
  const { openSet, closedSet, end } = this
  const { algorithm } = this.state
  if (algorithm === 'BreadthFirst') {
    // loop on the queue while it isnt empty
    if (openSet.length > 0) {
      const current = openSet[0]
      openSet.shift()
      current.open = false
      current.closed = true
      closedSet.push(current)
      const neighbors = current.neighbors

      neighbors.forEach(neighbor => {
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          closedSet.push(neighbor)
          neighbor.closed = true
          if (neighbor === end) {
            neighbor.previous = current

            this.setState({ algorithm: null })
          } else {
            openSet.push(neighbor)
            neighbor.open = true
            neighbor.previous = current
          }
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
      this.setState({ algorithm: null })
    }
  }
}

export default runBreadthFirst
