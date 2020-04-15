import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
// --------------- libraries
import axios from 'axios'
// ---------------url
import apiUrl from '../../apiConfig'
import ThumbnailGrid from '../ThumbnailGrid/ThumbnailGrid'

import './GridsList.scss'

const GridsList = (props) => {
  const [grids, setGrids] = useState([])
  const { user } = props
  // Only do the axios req if user is signed in-------------
  useEffect(() => {
    axios({
      url: `${apiUrl}/my/grids`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(res => setGrids(res.data.grids))
      .catch(console.error)
  }, [])

  const ownedHtml = grids
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
  if (grids.length) {
    return (
      <div className='row grids-list'>
        {ownedHtml}
      </div>
    )
  } else return 'Loading...'
}

export default withRouter(GridsList)
