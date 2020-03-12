import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
// --------------- libraries
import axios from 'axios'
// ---------------url
import apiUrl from '../../apiConfig'
import ThumbnailGrid from '../ThumbnailGrid/ThumbnailGrid'
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

  let ownedHtml
  let gridsFeed
  if (user) {
    // owned grids
    ownedHtml = grids
      .filter(grid => grid.editable)
      .slice(0, 12)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((grid, index) => (
        <Link className="col-md-4" key={grid.id} to={`/grids/${grid._id}`}>
          <ThumbnailGrid
            className="thumbnail"
            name={grid.name}
            key={grid.id}
            gridId={grid._id}
            user={user}
          />
        </Link>
      ))
    gridsFeed = grids
      .filter(grid => !grid.editable)
      .slice(0, 12)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((grid, index) => (
        <Link className="col-md-4" key={grid.id} to={`/grids/${grid._id}`}>
          <ThumbnailGrid
            className="thumbnail"
            name={grid.name}
            key={grid.id}
            gridId={grid._id}
            user={user}
          />
        </Link>
      ))
  }
  if (grids.length) {
    return (
      <div className="allGrids">
        {user && (
          <Link to={'/new_grid'}>
            <button>New Grid</button>
          </Link>
        )}
        {user && <Link to={'/my_grids'}>My Newest Grids</Link>}

        <div className="row">{ownedHtml}</div>
        {user && <div>Grids Feed</div>}
        <div className="row">{gridsFeed}</div>
      </div>
    )
  } else if (user) {
    return (
      'Loading...'
    )
  } else return <div>Welcome to my Pathfinding Visualization App!!!</div>
}

export default withRouter(Home)
