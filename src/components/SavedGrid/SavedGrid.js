import React, { Component } from 'react'
import Sketch from 'react-p5'
import { withRouter } from 'react-router-dom'
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
import toggleEditing from '../../lib/toggleEditing'
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

import '../NewGrid/Grids.scss'

// -----------Libraries
import axios from 'axios'
// -----------API URL
import apiUrl from '../../apiConfig'
// -----------GridForm
import GridForm from '../Shared/GridForm'

class SavedGrid extends Component {
  constructor () {
    super()
    this.state = {
      found: false,
      owned: false,
      deleted: false,
      initiated: false,
      algorithm: null,
      saved: false,
      start: false
    }
  }
  // variables are initialized outside of the constructor if they're used with sketch
  updated = false
  p5
  start
  path = []
  end
  cells
  weights
  cols
  rows
  current
  scale = 10
  hasntBeenWarned = true

  // shared modules -----------------
  setStartAndEnd = setStartAndEnd.bind(this)
  beginAStar = beginAStar.bind(this)
  findAllNeighbors = findAllNeighbors.bind(this)
  resetBoard = resetBoard.bind(this)
  checkForClicks = checkForClicks.bind(this)
  runAStar = runAStar.bind(this)
  runBreadthFirst = runBreadthFirst.bind(this)
  beginBreadth = beginBreadth.bind(this)
  beginDepth = beginDepth.bind(this)
  drawPath = drawPath.bind(this)
  begin = begin.bind(this)
  beginDjikstra = beginDjikstra.bind(this)
  runDjikstra = runDjikstra.bind(this)
  toggleEditing = toggleEditing.bind(this)

  runDepthFirst = runDepthFirst.bind(this)

  // TODO: Make breakpoints to have this be responsive on mobile:
  // scale down and also make the canvas resize if the window is under a certain width
  // get the grid
  componentDidMount () {
    axios({
      url: apiUrl + '/grids/' + this.props.match.params.id,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .then(res => {
        // set cells to the res data
        this.cells = res.data.grid.walls
        this.weights = res.data.grid.weights

        // sets this components state using res data
        this.setState({
          found: true,
          owned: res.data.grid.editable,
          grid: { name: res.data.grid.name },
          gridId: res.data.grid._id
        })
      })
      .catch(console.error)
  }
  // when a grid is saved, get that data!
  componentDidUpdate () {
    if (this.state.saved) {
      this.setState({ saved: false }, () => {
        axios({
          url: apiUrl + '/grids/' + this.state.newGridId,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.props.user.token}`
          }
        })
          .then(res => {
            // set cells to the res data
            this.cells = res.data.grid.walls
            this.weights = res.data.grid.weights
            this.updated = false
            // sets this components state using res data
            this.setState(
              {
                found: true,
                owned: res.data.grid.editable,
                grid: { name: res.data.grid.name },
                gridId: res.data.grid._id,
                saved: false,
                editing: false
              },
              () => this.p5.loop()
            )
          })
          .catch(console.error)
      })
    }
  }
  // End initialize -------------------------------------

  // used to alter state and the form's values
  handleChange = event => {
    const { name, value } = event.target
    const updatedField = {
      [name]: value
    }
    const editedGrid = Object.assign(this.state.grid, updatedField)
    this.setState({ grid: editedGrid })
  }

  // event handler to update grid's name and walls
  updateGrid = event => {
    event.preventDefault()
    const name = this.state.grid.name
    const walls = this.cells.map(row => row.map(cell => cell.wall))
    const weights = this.cells.map(row => row.map(cell => cell.weighted))
    axios({
      url: `${apiUrl}/grids/` + this.props.match.params.id,
      method: 'PATCH',
      data: { grid: { walls: walls, name: name, weights: weights } },
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .then(res => {
        this.props.msgAlert({
          heading: 'Successfully Updated Grid',
          message: 'Your Grid was successfully saved to our Database',
          variant: 'success'
        })
      })
      .catch(res => {
        this.props.msgAlert({
          heading: 'Failed to Update Grid',
          message:
            'There may be a problem with your connection, please try refreshing the page',
          variant: 'danger'
        })
      })
  }

  saveAsNew = event => {
    event.preventDefault()
    const name = this.state.grid.name
    const walls = this.cells.map(row => row.map(cell => cell.wall))
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
          newGridId: res.data.grid._id
        })
      })
      .catch(console.error)
  }
  // delete grid if user has already been warned, redirect to home
  deleteGrid = () => {
    const { props } = this
    const { msgAlert, match, user } = props
    if (this.hasntBeenWarned) {
      this.hasntBeenWarned = false
      msgAlert({
        heading: 'Warning!!',
        message: 'You are about to delete your grid. This is permanent!',
        variant: 'danger'
      })
    } else {
      axios({
        url: `${apiUrl}/grids/` + match.params.id,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
        .then(() => this.setState({ deleted: true }))
        .catch(console.error)
    }
  }

  // End data manipulation --------------------------------

  // set up the canvas
  setup = (p5, canvasParentRef) => {
    const { scale } = this
    this.p5 = p5
    // create canvas
    // canvas is 500x500px
    p5.createCanvas(500, 500).parent(canvasParentRef) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    this.cols = Math.ceil(p5.width / scale)
    this.rows = Math.ceil(p5.height / scale)

    // initialize  start and end position
    this.setState({ initiated: true })
  }

  draw = p5 => {
    const { editing, start } = this.state
    // this needs to be done here because component did mount happens
    // after setup, so in order to use the response data I created a
    // boolean check since draw is a continual loop
    if (this.state.found && !this.updated) {
      const myP5 = p5
      this.updated = true
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          let weighted = false
          if (this.weights) {
            weighted = this.weights[i][j]
          }
          this.cells[i][j] = new Cell(i, j, this.scale, myP5, this.cells[i][j], weighted)
        }
      }
      this.setStartAndEnd()
      this.setState({ initiated: true })
    }
    p5.background(255)
    if (start) {
      this.runAStar(p5)
      this.runBreadthFirst(p5)
      this.runDepthFirst(p5)
      this.runDjikstra(p5)
    }
    if (editing) {
      this.checkForClicks(p5)
    }
    // continual loop to show all cells based on their state

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }

    this.drawPath(p5)
  }

  // end draw loop-------------------------------------------------

  render () {
    const { deleted, found, grid, owned, saved, newGridId } = this.state
    const { history } = this.props
    const deleteBool = owned
    if (saved) {
      history.push('/grids/' + newGridId)
    }
    if (deleted) {
      history.push('/')
    }
    if (found) {
      return (
        <div>
          <div className="inner-grid text-center">
            <div>
              Drag mouse to create walls. Hold shift to create weighted cells.
            </div>
            <GridForm
              grid={grid}
              handleChange={this.handleChange}
              handleSubmit={this.updateGrid}
              owned={owned}
              deleteGrid={this.deleteGrid}
              saveAsNew={this.saveAsNew}
              deleteBool={deleteBool}
            />
          </div>
          <div className="inner-grid text-center">
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
              editing={this.state.editing}
              toggleEditing={this.toggleEditing}
            />
            <div className="row">
              <div className="col-12 m-3">
                <Legend />
              </div>
              <div className="col">
                <Sketch
                  className=" react-p5"
                  setup={this.setup}
                  draw={this.draw}
                />
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading....</div>
    }
  }
}
export default withRouter(SavedGrid)
