import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
// --------------- libraries
import axios from 'axios'
// ---------------url
import apiUrl from '../../apiConfig'
import ThumbnailGrid from '../ThumbnailGrid/ThumbnailGrid'
const Home = (props) => {
  const [grids, setGrids] = useState([null])
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
  let ownedOne = false
  let ownedHtml
  let gridsFeed
  if (user && grids[0]) {
    const myGrids = grids.filter(grid => grid.editable)
    if (myGrids.length > 0) { ownedOne = true }
    // owned grids
    ownedHtml = myGrids
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
  if (grids[0]) {
    return (
      <div className="allGrids">
        {user && (
          <Link to={'/new_grid'}>
            <button>New Grid</button>
          </Link>
        )}
        {ownedOne && <Link to={'/my_grids'}>My Newest Grids</Link>}
        {!ownedOne && (
          <Link to={'/new_grid'}>
            You do not own any grids, click here to begin!
          </Link>
        )}
        <div className="row">{ownedHtml}</div>
        {user && <div>Grids Feed</div>}
        <div className="row">{gridsFeed}</div>
      </div>
    )
  } else if (!grids.length && user) {
    return (
      <Link to={'/new_grid'}>
        <button>Wow you are the first user, click here to create a grid!</button>
      </Link>
    )
  } else if (user) {
    return (
      'Loading...'
    )
  } else return <div>Welcome to my Pathfinding Visualization App!!!</div>
}

export default withRouter(Home)
