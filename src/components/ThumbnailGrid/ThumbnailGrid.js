import React, { Component } from 'react'
import Sketch from 'react-p5'
import { withRouter } from 'react-router-dom'
// -----------Shared
import Cell from '../Shared/Cell'
// -----------Libraries
import axios from 'axios'
// -----------API URL
import apiUrl from '../../apiConfig'

class ThumbnailGrid extends Component {
  constructor () {
    super()
    this.state = {
      found: false,
      owned: false,
      initiated: false
    }
  }

  updated = false
  cells = []
  cols
  rows
  scale = 2

  componentDidMount () {
    axios({
      url: apiUrl + '/grids/' + this.props.gridId,
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

  // set up the canvas
  setup = (p5, canvasParentRef) => {
    const { scale } = this
    this.p5 = p5
    // create canvas
    p5.createCanvas(100, 100).parent(canvasParentRef) // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    this.cols = Math.ceil(p5.width / scale)
    this.rows = Math.ceil(p5.height / scale)

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
    }

    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].show()
      }
    }
    if (this.updated) {
      p5.noLoop()
    }
  }

  render () {
    return (
      <div className="align">
        {this.props.name}
        <Sketch setup={this.setup} draw={this.draw} />
      </div>)
  }
}

export default withRouter(ThumbnailGrid)
