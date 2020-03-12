import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../../apiConfig'

class FirstVisit extends Component {
  componentDidMount () {
    axios({
      url: `${apiUrl}/userVisit`,
      method: 'patch',
      headers: {
        Authorization: `Bearer ${this.props.user.token}`
      }
    })
      .catch(console.error)
  }
  componentWillUnmount () {
    this.props.updateUser()
  }
  render () {
    return (
      <div className='col'>
        <h3>First time using this app?</h3>
        <p>
        Begin by either clicking on a grid from the community feed, or by
        clicking on New Grid to create your own! Once you are in the grid view,
        you may Save any grid as your own copy so that you never lose your
        favorites.
        </p>
        <Link to={'/new_grid'}>
          <button>New Grid</button>
        </Link>
        <div>Grids Feed</div>
        <div className="row">{this.props.gridsFeed}</div>
      </div>
    )
  }
}

export default FirstVisit
