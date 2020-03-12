import React, { Component } from 'react'
import Sketch from 'react-p5'
import { withRouter } from 'react-router-dom'
// -----------Shared
import Cell from '../Shared/Cell'
import ResetBoardButton from '../Shared/ResetBoardButton'
import RandomWallsButton from '../Shared/RandomWallsButton'
import ResetWallsButton from '../Shared/ResetWallsButton'
import AStarButton from '../Shared/AStarButton'
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
            this.setState({
              found: true,
              owned: res.data.grid.editable,
              grid: { name: res.data.grid.name },
              gridId: res.data.grid._id,
              saved: false
            }, () => this.p5.loop())
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

  beginAStar = () => {
    this.resetBoard()
    this.cells.forEach(row => row.forEach(cell => cell.reset()))
    this.findAllNeighbors()
    this.openSet = []
    this.closedSet = []
    this.openSet.push(this.start)
    this.start.open = true
    this.setState({ algorithm: 'A*' })
  }
  // sets one cell to start and one cell to end the path
  setStartAndEnd = () => {
    this.start = this.cells[0][0]
    this.end = this.cells[this.cols - 1][this.rows - 1]
    this.start.start = true
    this.end.end = true
  }

  // loop through all cells and run findNeighbors()
  findAllNeighbors = () => {
    this.cells.forEach(rowOfCells =>
      rowOfCells.forEach(cell =>
        cell.findNeighbors(this.cells, this.cols, this.rows)
      )
    )
  }
  // used for A*, approximation of dist between cell and end
  heuristic = (a, b, p5) => {
    return p5.dist(a.x, a.y, b.x, b.y)
    // return Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
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
  checkForClicks = p5 => {
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
          this.cells[i][j] = new Cell(
            i,
            j,
            this.scale,
            myP5,
            this.cells[i][j]
          )
        }
      }
      this.setStartAndEnd()
    }
    p5.background(255)

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
          this.setState({ algorithm: null })
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
              const tempG = current.g + this.heuristic(current, neighbor, p5)
              let newPath = false
              // if it's in the open set, check if the new g is better
              // if so , set it
              if (openSet.includes(neighbor)) {
                if (tempG < neighbor.g) {
                  neighbor.g = tempG
                  newPath = true
                }

                // if not in open set, just set it's g score without the check, and push into open set
              } else {
                newPath = true
                neighbor.g = tempG
                openSet.push(neighbor)
                neighbor.open = true
              }
              // no matter what, find the new best heuristic of this neighbor
              // set the f score
              // set the previous for the path
              if (newPath) {
                neighbor.h = this.heuristic(neighbor, end, p5)
                neighbor.f = neighbor.g + neighbor.h
                neighbor.previous = current
              }
            }
          })
        }
      } else {
        this.setState({ algorithm: null })

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
    // TODO: FIX THIS REDIRECT!!!!!!!!
    if (saved) {
      history.push('/grids/' + newGridId)
    }
    if (deleted) {
      history.push('/')
    }
    if (found) {
      return (
        <div>
          {owned && (
            <div>
              <GridForm
                grid={grid}
                handleChange={this.handleChange}
                handleSubmit={this.updateGrid}
                owned={owned}
                deleteGrid={this.deleteGrid}
                saveAsNew={this.saveAsNew}
              />
            </div>
          )}
          <div className="center">
            <AStarButton onClick={this.beginAStar} />
            <ResetBoardButton resetBoard={this.resetBoard} cells={this.cells} />
            <ResetWallsButton
              running={this.state.algorithm}
              cells={this.cells}
            />
            <RandomWallsButton
              running={this.state.algorithm}
              cells={this.cells}
              start={this.start}
              end={this.end}
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
