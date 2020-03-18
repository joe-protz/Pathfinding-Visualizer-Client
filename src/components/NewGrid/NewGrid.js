import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Sketch from 'react-p5'
// -----------Shared
import Cell from '../Shared/Cell'
import AllButtons from '../Shared/AllButtons'
import Legend from '../Shared/Legend'
// ----------- Shared functions
// helpers
import setStartAndEnd from '../../lib/setStartAndEnd'
import findAllNeighbors from '../../lib/findAllNeighbors'
import resetBoard from '../../lib/resetBoard'
import checkForClicks from '../../lib/checkForClicks'
import drawPath from '../../lib/drawPath'
// used for algorithm setting
import beginAStar from '../../lib/beginAStar'
import beginBreadth from '../../lib/beginBreadth'
import beginDepth from '../../lib/beginDepth'
import beginDjikstra from '../../lib/beginDjikstra'
import begin from '../../lib/begin'
// actual algorithm code
import runDepthFirst from '../../lib/runDepthFirst'
import runBreadthFirst from '../../lib/runBreadthFirst'
import runAStar from '../../lib/runAStar'
import runDjikstra from '../../lib/runDjikstra'
// -----------Libraries
import axios from 'axios'
// -----------API URL
import apiUrl from '../../apiConfig'
// -----------Update/Create Form
import GridForm from '../Shared/GridForm'

// newGrid is a component that shows any time a user clicks 'new grid'
export default class NewGrid extends Component {
  constructor () {
    super()
    this.state = {
      saved: false,
      grid: {
        name: ''
      },
      initiated: false,
      algorithm: null,
      start: false
    }
  }
  // shared variables the p5 functions
  p5
  start
  path = []
  end
  cells
  cols
  rows
  current
  scale =10

  // shared modules -----------------
  setStartAndEnd = setStartAndEnd.bind(this)
  begin = begin.bind(this)

  // sets the algorithm states
  beginAStar = beginAStar.bind(this)
  beginBreadth = beginBreadth.bind(this)
  beginDepth = beginDepth.bind(this)
  beginDjikstra = beginDjikstra.bind(this)

  // loops through every cell to have them check their neighbors
  findAllNeighbors = findAllNeighbors.bind(this)
  resetBoard = resetBoard.bind(this)
  checkForClicks = checkForClicks.bind(this)

  drawPath = drawPath.bind(this)
  runDjikstra = runDjikstra.bind(this)
  runAStar = runAStar.bind(this)
  runBreadthFirst = runBreadthFirst.bind(this)
  runDepthFirst = runDepthFirst.bind(this)

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
    const walls = this.cells.map(row =>
      row.map(cell => cell.wall)
    )
    const weights = this.cells.map(row => row.map(cell => cell.weighted))
    axios({
      url: `${apiUrl}/grids`,
      method: 'POST',
      data: { grid: { walls: walls, name: name, weights: weights } },
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

  // Data manipulation end-------------------------------------------------

  // set up the canvas
  setup = (p5, canvasParentRef) => {
    let { cols, rows } = this
    const { scale } = this
    // create canvas
    this.p5 = p5
    const myP5 = p5
    // canvas is 500x500px
    p5.createCanvas(500, 500).parent(canvasParentRef) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
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
    this.setStartAndEnd()
    // bugs out without a state change at the end of setup
    this.setState({ initiated: true })
  }

  draw = p5 => {
    p5.background(255)
    // continual loop to show all cells based on their state

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }
    // once state is started, begin running the algorithms.
    // the algorithms themselves check for the 'algorithm' state
    if (this.state.start) {
      this.runAStar(p5)
      this.runBreadthFirst(p5)
      this.runDepthFirst(p5)
      this.runDjikstra(p5)
    }
    this.checkForClicks(p5)

    this.drawPath(p5)
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
          newGrid={true}
          owned={true}
          deleteGrid={false}
        />
        {/* navbar  */}
        <AllButtons
          algorithm={this.state.algorithm}
          beginAStar={this.beginAStar}
          beginBreadth={this.beginBreadth}
          beginDepth={this.beginDepth}
          beginDjikstra={this.beginDjikstra}
          running={this.state.start}
          cells={this.cells}
          start={this.start}
          end={this.end}
          resetBoard={this.resetBoard}
          begin={this.begin}
          msgAlert={this.props.msgAlert}
        />
        <div className = 'row'>
          <Legend />
          <Sketch className = 'col-9 react-p5' setup={this.setup} draw={this.draw} />
        </div>
      </div>
    )
  }
}
