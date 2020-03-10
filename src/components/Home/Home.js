import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
// ---------------
import axios from 'axios'
// ---------------
import apiUrl from '../../apiConfig'
class Home extends Component {
  constructor () {
    super()
    this.state = {
      grids: []
    }
  }
  // Only do the axios req if user is signed in-------------
  componentDidMount () {
    console.log(this.props.user)
    if (this.props.user) {
      axios({
        url: `${apiUrl}/grids`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.props.user.token}`
        }
      })
        .then(res => this.setState({ grids: res.data.grids }))
        .catch(console.error)
    }
  }

  // If the user is signed in, map over the grids, otherwise just display a welcome component (html for now) ---------------

  render () {
    let gridsHtml
    if (this.props.user) {
      gridsHtml = this.state.grids.map(grid => (
        <li key={grid.id}>
          <Link to={`/grids/${grid._id}`}>{grid.name}</Link>
        </li>
      ))
    } else {
      // TODO: Change this to a component
      gridsHtml = <div>Welcome to my Pathfinding Visualization App!!!</div>
    }

    return (
      <div>
        {this.props.user && <h4>All Grids</h4>}
        {this.props.user && (
          <Link to={'/new_grid'}>
            <button >New Grid</button>
          </Link>
        )}
        <ul>{gridsHtml}</ul>
      </div>
    )
  }
}

export default withRouter(Home)
