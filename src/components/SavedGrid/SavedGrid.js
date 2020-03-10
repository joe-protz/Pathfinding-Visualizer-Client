import React, { Component } from 'react'
import Sketch from 'react-p5'
import { withRouter } from 'react-router-dom'
// -----------Cell Class
import Cell from '../Shared/Cell'
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
      updated: false,
      deleted: false
    }
  }
  // variables are initialized outside of the constructor if they're used with sketch
hasntBeenWarned = true
cells
cols
cellTest
rows
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
// used to alter state and the form's values
handleChange = event => {
  const { name, value } = event.target
  const updatedField = {
    [name]: value
  }
  const editedGrid = Object.assign(
    this.state.grid,
    updatedField
  )
  this.setState({ grid: editedGrid })
}

// set up the canvas
setup = (p5, canvasParentRef) => {
  // create canvas
  // canvas is 600x500px
  p5.createCanvas(600, 500).parent(canvasParentRef) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  this.cols = Math.ceil(p5.width / this.scale)
  this.rows = Math.ceil(p5.height / this.scale)
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
  }
  p5.background(0)
  // allows the user to set cells to 'walls' on click/drag
  if (p5.mouseIsPressed) {
    const mouseX = p5.mouseX
    const mouseY = p5.mouseY
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].click(mouseX, mouseY)
      }
    }
  }
  // show all cells
  for (let i = 0; i < this.cells.length; i++) {
    for (let j = 0; j < this.cells[i].length; j++) {
      this.cells[i][j].show()
    }
  }
  // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
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
        message: 'There may be a problem with your connection, please try refreshing the page',
        variant: 'danger'
      })
    })
}
// delete grid if user has already been warned, redirect to home
deleteGrid =() => {
  if (this.hasntBeenWarned) {
    this.hasntBeenWarned = false
    this.props.msgAlert({
      heading: 'Warning!!',
      message:
      'You are about to delete your grid. This is permanent!',
      variant: 'danger'
    })
  } else {
    axios({
      url: `${apiUrl}/grids/` + this.props.match.params.id,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .then(() => this.setState({ deleted: true }))
      .catch(console.error)
  }
}

render () {
  if (this.state.deleted) { this.props.history.push('/') }
  if (this.state.found) {
    return (
      <div>
        {this.state.owned && (
          <GridForm
            grid={this.state.grid}
            handleChange={this.handleChange}
            handleSubmit={this.updateGrid}
          />
        )}
        {this.state.owned && <button onClick={this.deleteGrid}>Delete Your Beautiful Creation</button>}
        <Sketch setup={this.setup} draw={this.draw} />
      </div>
    )
  } else {
    return <div>Loading....</div>
  }
}
}
export default withRouter(SavedGrid)
