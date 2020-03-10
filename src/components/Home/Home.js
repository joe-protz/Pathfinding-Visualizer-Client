import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
// --------------- libraries
import axios from 'axios'
// ---------------url
import apiUrl from '../../apiConfig'

const Home = (props) => {
  const [grids, setGrids] = useState([])
  const { user } = props
  // Only do the axios req if user is signed in-------------
  useEffect(() => {
    if (user) {
      axios({
        url: `${apiUrl}/grids`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
        .then(res => setGrids(res.data.grids))
        .catch(console.error)
    }
  }, [])

  // If the user is signed in, map over the grids, otherwise just display a welcome component (html for now) ---------------

  let gridsHtml
  if (user) {
    gridsHtml = grids.map(grid => (
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
      {user && <h4>All Grids</h4>}
      {user && (
        <Link to={'/new_grid'}>
          <button >New Grid</button>
        </Link>
      )}
      <ul>{gridsHtml}</ul>
    </div>
  )
}

export default withRouter(Home)
