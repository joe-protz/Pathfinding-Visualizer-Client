// while the algo is A* and there are still cells in openSet
import heuristic from './heuristic'
import removeFromArray from './removeFromArray'

const runDjikstra = function (p5) {
  const { openSet, closedSet, end } = this
  const { algorithm } = this.state
  if (algorithm === 'Djikstra') {
    if (openSet.length > 0) {
      let winner = 0
      // find the lowest score in the openSet (closest cell to end)
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].d < openSet[winner].d) winner = i
      }

      const current = openSet[winner]

      const neighbors = current.neighbors
      neighbors.forEach(neighbor => {
        // if it is in the closed set, skip it, it's already been calculated
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          // if not, the tentative d score for that neighbor is current+1
          const tempD = current.d + heuristic(current, neighbor, p5)
          if (openSet.includes(neighbor)) {
            if (tempD < neighbor.d) {
              neighbor.d = tempD
              neighbor.previous = current
            }
          } else {
            neighbor.d = tempD
            openSet.push(neighbor)
            neighbor.open = true
            neighbor.previous = current
          }
        }
      })
      removeFromArray(openSet, current)
      current.open = false

      closedSet.push(current)
      current.closed = true
      if (current === end) {
        this.setState({ algorithm: null })
      }
      this.path = []
      let temp = current
      this.path.push(temp)
      while (temp.previous) {
        this.path.push(temp.previous)
        temp = temp.previous
      }
    }
  }
}

export default runDjikstra
