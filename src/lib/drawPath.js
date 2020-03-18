const drawPath = function (p5) {
  // draw the current path

  p5.noFill()
  p5.stroke(100, 10, 210)
  p5.strokeWeight(5)
  p5.beginShape()
  for (let i = 0; i < this.path.length; i++) {
    const current = this.path[i]
    p5.vertex(current.x + current.size / 2, current.y + current.size / 2)
  }
  p5.endShape()
}

export default drawPath
