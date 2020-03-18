// approximation of dist between two cells
const heuristic = (a, b, p5) => {
  return p5.dist(a.x, a.y, b.x, b.y)
}

export default heuristic
