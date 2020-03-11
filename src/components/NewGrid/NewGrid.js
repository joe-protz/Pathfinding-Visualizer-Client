import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Sketch from 'react-p5'
// -----------Shared
import Cell from '../Shared/Cell'
import ResetButton from '../Shared/ResetButton'
import AStarButton from '../Shared/AStarButton'
// import convertCells from '../../lib/convertCells'
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
      },
      initiated: false,
      algorithm: null
    }
  }
  start
  path = []
  end
  cells
  cols
  rows
  current
  scale = 20
  // TODO: Make breakpoints to have this be responsive on mobile:
  // scale down and also make the canvas resize if the window is under a certain width
  // ------------------------------------------------
  handleChange = (event) => {
    const { name, value } = event.target
    const { grid } = this.state
    const updatedField = {
      [name]: value
    }
    const editedGrid = Object.assign(grid, updatedField)
    this.setState({ grid: editedGrid })
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
  convertAStar = () => {
    // this.cells = convertCells(this.cells, 'A*')
    this.setStartAndEnd()
    this.findAllNeighbors()
    this.openSet = []
    this.closedSet = []
    this.openSet.push(this.start)
    this.start.open = true
    this.setState({ algorithm: 'A*' })
  }

  setStartAndEnd= () => {
    this.start = this.cells[0][0]
    this.end = this.cells[this.cols - 1][12]
    this.start.start = true
    this.end.end = true
  }
findAllNeighbors = () => {
  this.cells.forEach(rowOfCells =>
    rowOfCells.forEach(cell => cell.findNeighbors(this.cells, this.cols, this.rows))
  )
}
  heuristic = (a, b, p5) => {
    // return p5.dist(a.x, a.y, b.x, b.y)
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
  }
  removeFromArray = (arr, elt) => {
    // loops through backwards so that the removal does not cause a
    // skipped item
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === elt) arr.splice(i, 1)
    }
  }
  // -------------------------------------------------

  // set up the canvas
  setup = (p5, canvasParentRef) => {
    let { cols, rows } = this
    const { scale } = this
    // create canvas
    const myP5 = p5
    // canvas is 600x500px
    p5.createCanvas(600, 500).parent(canvasParentRef) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    cols = this.cols = Math.ceil(p5.width / scale)
    rows = this.rows = Math.ceil(p5.height / scale)

    // make a new 2d Array of cells, all set to not be walls
    this.cells = new Array(cols)
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new Array(rows)
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.cells[i][j] = new Cell(i, j, scale, myP5)
      }
    }
    // initialize  start and end position
    this.setState({ initiated: true })
  }

  draw = p5 => {
    const { openSet, end } = this
    const { algorithm } = this.state
    // while the algo is A* and there are still cells in openSet
    if (algorithm === 'A*') {
      if (openSet.length > 0) {
        let winner = 0
        // find the lowest score in the openSet
        for (let i = 0; i < openSet.length; i++) {
          if (openSet[i].f < openSet[winner].f) winner = i
        }
        console.log(winner)
        this.current = openSet[winner]
        const { current } = this
        // if we found the solution...
        if (current === end) {
          console.log('done!')
          p5.noLoop()
        } else {
          this.removeFromArray(this.openSet, this.current)
          current.open = false

          this.closedSet.push(this.current)
          current.closed = true

          const neighbors = this.current.neighbors
          neighbors.forEach((neighbor, i) => {
            if (!this.closedSet.includes(neighbors[i])) {
              const tempG = current.g + 1
              if (this.openSet.includes(neighbors[i])) {
                if (tempG < neighbor.g) { neighbors[i].g = tempG }
              } else {
                neighbors[i].g = tempG
                this.openSet.push(neighbors[i])
                neighbors[i].open = true
              }
              neighbors[i].h = this.heuristic(neighbors[i], this.end, p5)
              neighbors[i].f = neighbors[i].g + neighbors[i].h
              neighbors[i].previous = current
            }
          })
        }
      } else {
        // no solution
      }
      this.path = []
      let temp = this.current
      this.path.push(temp)
      while (temp.previous) {
        this.path.push(temp.previous)
        temp = temp.previous
      }
    }
    const { cols, rows } = this

    p5.background(0)
    // how we set the cells to be walls
    if (p5.mouseIsPressed) {
      const mouseX = p5.mouseX
      const mouseY = p5.mouseY
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          this.cells[i][j].click(mouseX, mouseY)
        }
      }
    }

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].path = false
      }
    }
    // draw path
    for (let i = 0; i < this.path.length; i++) {
      this.path[i].path = true
    }

    // continual loop to show all cells based on their state

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }

    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
  }
  // -------------------------------------------------

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
        <AStarButton onClick={this.convertAStar}/>
        <ResetButton cells={this.cells}/>
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
