// while the algo is A* and there are still cells in openSet
import heuristic from './heuristic'
import removeFromArray from './removeFromArray'

const runAStar = function (p5) {
  const { openSet, closedSet, end } = this
  const { algorithm } = this.state
  if (algorithm === 'A*') {
    if (openSet.length > 0) {
      let winner = 0
      // find the lowest score in the openSet (closest cell to end)
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) winner = i
      }

      this.current = openSet[winner]
      const { current } = this
      // if we found the solution...
      if (current === end) {
        this.setState({ algorithm: null })
      } else {
      // Remove from open set and add to closed, setting attr for visuals
        removeFromArray(openSet, current)
        current.open = false

        closedSet.push(current)
        current.closed = true
        // find al the neighbors of the closest cell
        const neighbors = current.neighbors
        // loop through neighbors

        neighbors.forEach(neighbor => {
        // if it is in the closed set, skip it, it's already been calculated
          if (!closedSet.includes(neighbor) && !neighbor.wall) {
          // if not, the tentative g score for that neighbor is current+1
            let tempG = current.g + heuristic(current, neighbor, p5)
            if (neighbor.weighted) tempG += 30
            let newPath = false
            // if it's in the open set, check if the new g is better
            // if so , set it
            if (openSet.includes(neighbor)) {
              if (tempG < neighbor.g) {
                neighbor.g = tempG
                newPath = true
              }

            // if not in open set, just set it's g score without the check, and push into open set
            } else {
              newPath = true
              neighbor.g = tempG
              openSet.push(neighbor)
              neighbor.open = true
            }
            // no matter what, find the new best heuristic of this neighbor
            // set the f score
            // set the previous for the path
            if (newPath) {
              neighbor.h = heuristic(neighbor, end, p5)
              neighbor.f = neighbor.g + neighbor.h
              neighbor.previous = current
            }
          }
        })
      }
    } else {
      this.setState({ algorithm: null })

    // no solution
    }
    // on all loops, calculate the current best path
    this.path = []
    let temp = this.current
    this.path.push(temp)
    while (temp.previous) {
      this.path.push(temp.previous)
      temp = temp.previous
    }
  }
}

export default runAStar
