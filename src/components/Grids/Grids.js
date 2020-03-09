import React, { Component } from 'react'
import Sketch from 'react-p5'

export default class Grids extends Component {
  constructor () {
    super()
    this.state = {

    }
  }
  x = 50
  y = 50
  componentDidMount () {
    console.log('mounted')
    this.setState({
      bob: 'bob'
    })
  }
  setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth - 100, window.innerHeight - 100).parent(
      canvasParentRef
    ) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    console.log('setup')
  }

  draw = p5 => {
    p5.background(0)
    p5.ellipse(this.x, this.y, 70, 70)
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
    if (this.x > window.innerWidth - 100) {
      this.x = 0
    }
    if (this.y > window.innerHeight - 100) {
      this.y = 0
    }
    this.x++
    this.y++
  }
  windowResized = p5 => {
    console.log('resize')
    p5.resizeCanvas(window.innerWidth - 100, window.innerHeight - 100)
  }
  mouseClicked = () => {
    console.log('hi')
    this.setState({ x: this.x })
  }

  render () {
    return (
      <Sketch
        setup={this.setup}
        draw={this.draw}
        windowResized={this.windowResized}
        mouseClicked={this.mouseClicked}
      />
    )
  }
}
