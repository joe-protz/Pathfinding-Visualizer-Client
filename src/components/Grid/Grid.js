import React, { Component } from 'react'
import Sketch from 'react-p5'
import Cell from './Cell'

export default class Grid extends Component {
  constructor () {
    super()
    this.state = {

    }
  }
  cells
  cols
  cellTest
  rows
  // TODO: Make breakpoints to have this be responsive on mobile:
  // scale down and also make the canvas resize if the window is under a certain width
  scale = 20
  componentDidMount () {
    this.setState({
    })
  }
  setup = (p5, canvasParentRef) => {
    // create canvas
    const myP5 = p5
    p5.createCanvas(600, 500).parent(
      canvasParentRef
    ) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    this.cols = Math.ceil(p5.width / this.scale)
    this.rows = Math.ceil(p5.height / this.scale)
    this.cells = new Array(this.cols)
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new Array(this.rows)
    }
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j] = new Cell(i, j, this.scale, myP5)
      }
    }
  }

  draw = p5 => {
    p5.background(0)
    if (p5.mouseIsPressed) {
      const mouseX = p5.mouseX
      const mouseY = p5.mouseY
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j].click(mouseX, mouseY)
        }
      }
    }
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
  }

  // mouseDragged = () => {
  //   for (let i = 0; i < this.cells.length; i++) {
  //     for (let j = 0; j < this.cells[i].length; j++) {
  //       this.cells[i][j].click()
  //     }
  //   }
  // }
  render () {
    return (
      <Sketch
        setup={this.setup}
        draw={this.draw}
        mouseDragged={this.mouseDragged}
      />
    )
  }
}
