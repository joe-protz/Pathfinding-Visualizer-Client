import React, { Component } from 'react'
import Sketch from 'react-p5'
// -----------Cell Class
import Cell from '../Shared/Cell'
// -----------Libraries
import axios from 'axios'
// -----------API URL
import apiUrl from '../../apiConfig'

export default class SavedGrid extends Component {
  constructor () {
    super()
    this.state = {
      found: false,
      owned: false
    }
  }
  cells
  cols
  cellTest
  rows
  changed = false
  scale = 20
  // TODO: Make breakpoints to have this be responsive on mobile:
  // scale down and also make the canvas resize if the window is under a certain width

  componentDidMount () {
    // get the grid by id
    axios({
      url: apiUrl + '/grids/' + this.props.match.params.id,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .then(res => {
        console.log(res.data.grid)
        this.cells = res.data.grid.walls
        this.setState({ found: true,
          owned: res.data.grid.editable
        })
      })
      .catch(console.error)
  }
  // set up the canvas
  setup = (p5, canvasParentRef) => {
    // create canvas
    const myP5 = p5
    // canvas is 600x500px
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
    if (!this.changed && this.state.found) {
      const myP5 = p5
      this.changed = true
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j] = new Cell(i, j, this.scale, myP5, this.cells[i][j])
        }
      }
    }
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
  saveGrid = (event) => {
    const map = this.cells.map(row => row.map(cell => cell.wall))
    axios({
      url: `${apiUrl}/grids/` + this.props.match.params.id,
      method: 'PATCH',
      data: { grid: { walls: map } },
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .then(res => {
        console.log('yay :)')
        // this.setState({ created: true, gridId: res.data.grid._id })
      })
      .catch(console.error)
  }
  render () {
    return (
      <div>
        <Sketch
          setup={this.setup}
          draw={this.draw}
        />
        {this.state.owned && <button onClick={this.saveGrid}>Save Changes</button>}
      </div>
    )
  }
}
