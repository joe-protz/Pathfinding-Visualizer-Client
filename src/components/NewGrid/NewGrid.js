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
  p5
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
  // Initialize end ------------------------------------------------
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
  // initiate and allow A* to run in 'draw'
  beginAStar = () => {
    this.setStartAndEnd()
    this.findAllNeighbors()
    this.openSet = []
    this.closedSet = []
    this.openSet.push(this.start)
    this.start.open = true
    this.setState({ algorithm: 'A*' })
  }
  // sets one cell to start and one cell to end the path
  setStartAndEnd= () => {
    this.start = this.cells[0][0]
    this.end = this.cells[this.cols - 1][12]
    this.start.start = true
    this.end.end = true
  }

  // loop through all cells and run findNeighbors()
findAllNeighbors = () => {
  this.cells.forEach(rowOfCells =>
    rowOfCells.forEach(cell => cell.findNeighbors(this.cells, this.cols, this.rows))
  )
}
  // used for A*, approximation of dist between cell and end
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
  // if algorithm hasnt started check grid for mouse press and change cells
  // to walls if clicked
  checkForClicks = (p5) => {
    if (p5.mouseIsPressed && !this.state.algorithm) {
      const mouseX = p5.mouseX
      const mouseY = p5.mouseY
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.cells[i][j].click(mouseX, mouseY)
        }
      }
    }
  }

  // reset Algorithm and continue loop
  resetBoard = () => {
    this.path = []
    this.setState({ algorithm: null })
  }
  // Data manipulation end-------------------------------------------------

  // set up the canvas
  setup = (p5, canvasParentRef) => {
    let { cols, rows } = this
    const { scale } = this
    // create canvas
    this.p5 = p5
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
    p5.background(0)

    this.checkForClicks(p5)
    const { openSet, closedSet, end } = this
    const { algorithm } = this.state
    // while the algo is A* and there are still cells in openSet
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
          console.log('done!')
        } else {
        // Remove from open set and add to closed, setting attr for visuals
          this.removeFromArray(openSet, current)
          current.open = false

          closedSet.push(current)
          current.closed = true
          // find al the neighbors of the closest cell
          const neighbors = current.neighbors
          // loop through neighbors
          neighbors.forEach((neighbor) => {
          // if it is in the closed set, skip it, it's already been calculated
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
              // if not, the tentative g score for that neighbor is current+1
              const tempG = current.g + 1
              // if it's in the open set, check if the new g is better
              // if so , set it
              if (openSet.includes(neighbor)) {
                if (tempG < neighbor.g) { neighbor.g = tempG }
              // if not in open set, just set it's g score without the check, and push into open set
              } else {
                neighbor.g = tempG
                openSet.push(neighbor)
                neighbor.open = true
              }
              // no matter what, find the new best heuristic of this neighbor
              // set the f score
              // set the previous for the path
              neighbor.h = this.heuristic(neighbor, end, p5)
              neighbor.f = neighbor.g + neighbor.h
              neighbor.previous = current
            }
          })
        }
      } else {
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
    // reset the previous of all cells so that the path doesn't accumulate
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].path = false
      }
    }
    // set path
    for (let i = 0; i < this.path.length; i++) {
      this.path[i].path = true
    }

    // continual loop to show all cells based on their state

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }
  }
  // end draw loop-------------------------------------------------

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
        <AStarButton onClick={this.beginAStar}/>
        <ResetButton resetBoard={this.resetBoard} cells={this.cells}/>
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  }
}
