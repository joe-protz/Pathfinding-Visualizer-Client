import React, { Component } from 'react'
import Sketch from 'react-p5'
import { withRouter } from 'react-router-dom'
// -----------Shared
import Cell from '../Shared/Cell'
import ResetBoardButton from '../Shared/ResetBoardButton'
import RandomWallsButton from '../Shared/RandomWallsButton'
import ResetWallsButton from '../Shared/ResetWallsButton'
import AStarButton from '../Shared/AStarButton'
// -----------Shared functions
import setStartAndEnd from '../../lib/setStartAndEnd'
import beginAStar from '../../lib/beginAStar'
import findAllNeighbors from '../../lib/findAllNeighbors'
import resetBoard from '../../lib/resetBoard'
import checkForClicks from '../../lib/checkForClicks'

import runAStar from '../../lib/runAStar'

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
      saved: false
    }
  }
  // variables are initialized outside of the constructor if they're used with sketch
  updated = false
  p5
  start
  path = []
  end
  cells
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
            this.updated = false
            // sets this components state using res data
            this.setState(
              {
                found: true,
                owned: res.data.grid.editable,
                grid: { name: res.data.grid.name },
                gridId: res.data.grid._id,
                saved: false
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
    const map = this.cells.map(row => row.map(cell => cell.wall))
    axios({
      url: `${apiUrl}/grids/` + this.props.match.params.id,
      method: 'PATCH',
      data: { grid: { walls: map, name: name } },
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
    const map = this.cells.map(row => row.map(cell => cell.wall))
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
    // this needs to be done here because component did mount happens
    // after setup, so in order to use the response data I created a
    // boolean check since draw is a continual loop
    if (this.state.found && !this.updated) {
      const myP5 = p5
      this.updated = true
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j] = new Cell(i, j, this.scale, myP5, this.cells[i][j])
        }
      }
      this.setStartAndEnd()
      this.setState({ initiated: true })
    }
    p5.background(255)

    this.checkForClicks(p5)
    this.runAStar(p5)

    // continual loop to show all cells based on their state

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }

    p5.noFill()
    p5.stroke(255, 0, 200)
    p5.strokeWeight(5)
    p5.beginShape()
    for (let i = 0; i < this.path.length; i++) {
      const current = this.path[i]
      p5.vertex(current.x + current.size / 2, current.y + current.size / 2)
    }
    p5.endShape()
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
          <GridForm
            grid={grid}
            handleChange={this.handleChange}
            handleSubmit={this.updateGrid}
            owned={owned}
            deleteGrid={this.deleteGrid}
            saveAsNew={this.saveAsNew}
            deleteBool={deleteBool}
          />

          <div className="center">
            <AStarButton onClick={this.beginAStar} />
            <RandomWallsButton
              running={this.state.algorithm}
              cells={this.cells}
              start={this.start}
              end={this.end}
            />
            <ResetBoardButton resetBoard={this.resetBoard} cells={this.cells} />
            <ResetWallsButton
              running={this.state.algorithm}
              cells={this.cells}
            />
          </div>
          <Sketch setup={this.setup} draw={this.draw} />
        </div>
      )
    } else {
      return <div>Loading....</div>
    }
  }
}
export default withRouter(SavedGrid)
