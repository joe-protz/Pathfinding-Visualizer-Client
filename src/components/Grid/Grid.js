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
  scale = 10
  componentDidMount () {
    this.setState({
    })
  }
  setup = (p5, canvasParentRef) => {
    // create canvas
    const myP5 = p5
    p5.createCanvas(400, 400).parent(
      canvasParentRef
    ) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    this.cols = p5.width / this.scale
    this.rows = p5.height / this.scale
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
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
  }

  mouseClicked = () => {

  }

  render () {
    return (
      <Sketch
        setup={this.setup}
        draw={this.draw}
        mouseClicked={this.mouseClicked}
      />
    )
  }
}
