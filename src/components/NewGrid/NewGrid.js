import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Sketch from 'react-p5'
// -----------Shared
import Cell from '../Shared/Cell'
import ResetButton from '../Shared/ResetButton'
// -----------Libraries
import axios from 'axios'
// -----------API URL
import apiUrl from '../../apiConfig'
// -----------Update/Create Form
import GridForm from '../Shared/GridForm'

export default class NewGrid extends Component {
  constructor () {
    super()
    this.state = {
      saved: false,
      grid: {
        name: ''
      }
    }
  }
  cells
  cols
  rows
  scale = 20
  // TODO: Make breakpoints to have this be responsive on mobile:
  // scale down and also make the canvas resize if the window is under a certain width

handleChange = (event) => {
  const { name, value } = event.target
  const { grid } = this.state
  const updatedField = {
    [name]: value
  }
  const editedGrid = Object.assign(grid, updatedField)
  this.setState({ grid: editedGrid })
}

  // set up the canvas
  setup = (p5, canvasParentRef) => {
    let { cols, rows } = this
    const { scale } = this
    // create canvas
    const myP5 = p5
    // canvas is 600x500px
    p5.createCanvas(600, 500).parent(canvasParentRef) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    cols = Math.ceil(p5.width / scale)
    rows = Math.ceil(p5.height / scale)

    // make a new 2d Array of cells, all set to not be walls
    this.cells = new Array(cols)
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new Array(rows)
    }
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j] = new Cell(i, j, scale, myP5)
      }
    }
    this.setState({ initiated: true })
  }

  draw = p5 => {
    p5.background(0)
    // how we set the cells to be walls
    if (p5.mouseIsPressed) {
      const mouseX = p5.mouseX
      const mouseY = p5.mouseY
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j].click(mouseX, mouseY)
        }
      }
    }
    // continual loop to show all cells based on their state
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
  }
  // event handler to save the grid to the user's grids collection
  saveGrid = event => {
    event.preventDefault()
    const name = this.state.grid.name
    const map = this.cells.map(row =>
      row.map(cell => cell.wall)
    )
    axios({
      url: `${apiUrl}/grids`,
      method: 'POST',
      data: { grid: { walls: map, name: name } },
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .then(res => {
        // with state set to saved the render function will route to show/${this}
        this.setState({
          saved: true,
          gridId: res.data.grid._id
        })
      })
      .catch(console.error)
  }

  render () {
    const { gridId, saved, grid } = this.state
    //  redirect if grid has been saved to db
    if (saved) {
      return (<Redirect to={{ pathname: '/grids/' + gridId }}/>)
    }
    // the sketch component making the canvas is rendered here
    return (
      <div>
        <GridForm
          grid={grid}
          handleChange={this.handleChange}
          handleSubmit={this.saveGrid}
        />
        <ResetButton cells={this.cells}/>
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
