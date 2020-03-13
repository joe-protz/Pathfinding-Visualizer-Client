// used for A*, approximation of dist between cell and end
const heuristic = (a, b, p5) => {
  return p5.dist(a.x, a.y, b.x, b.y)
  // return Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
}

export default heuristic
