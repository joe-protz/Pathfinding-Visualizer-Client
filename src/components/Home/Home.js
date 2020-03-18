import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
// --------------- libraries
import axios from 'axios'
// ---------------url
import apiUrl from '../../apiConfig'
import ThumbnailGrid from '../ThumbnailGrid/ThumbnailGrid'
import Welcome from '../Welcome/Welcome'
import FirstVisit from '../FirstVisit/FirstVisit'
import { PrimaryButton } from '../Shared/Styled_Components'

const Home = (props) => {
  const [grids, setGrids] = useState([null])
  const { user, updateUser } = props
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

  // If the user is signed in, map over the grids, otherwise just display a welcome component
  let ownedOne = false
  let ownedHtml
  let gridsFeed
  // if there is a user and there is  at least one grid
  if (user && grids[0]) {
    // find all user's grids
    const myGrids = grids.filter(grid => grid.editable)
    // set the ownedOne var to true
    if (myGrids.length > 0) { ownedOne = true }
    // create thumbnail grid for owned grids
    ownedHtml = myGrids
      .slice(0, 9)
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
      // create thumbnail grid for 9 recent community grids
    gridsFeed = grids
      .filter(grid => !grid.editable)
      .slice(0, 9)
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
  // if the user is logged in and has never visited
  if (user && user.firstTime) {
    return (
      <FirstVisit updateUser={updateUser} gridsFeed={gridsFeed}user={user}/>
    )
    // otherwise, if there are any grids
  } else if (grids[0]) {
    return (
      <div className="allGrids">
        {/* as long as the user owns one grid */}
        {user && ownedOne && (
          <Link to={'/new_grid'}>
            <PrimaryButton>New Grid</PrimaryButton>
          </Link>
        )}
        {ownedOne && (
          <span>
            <Link to={'/my_grids'}>
              <PrimaryButton>My Grids</PrimaryButton>
            </Link>
            <h2>Here are your most recent grids</h2>
          </span>
        )}
        {/* special button for user's with no grids */}
        {!ownedOne && (
          <Link to={'/new_grid'}>
            <PrimaryButton className={'btn btn-primary'}>
              You do not own any grids, click here to begin!
            </PrimaryButton>
          </Link>
        )}
        {/* show  owned grids and community grids */}
        <div className="row">{ownedHtml}</div>
        {user && <h2>Here are some recently made community grids!</h2>}
        <div className="row">{gridsFeed}</div>
      </div>
    )
    // if user logs in and there are 0 grids, everybody must have deleted theirs and a special message is needed
  } else if (!grids.length && user) {
    return (
      <Link to={'/new_grid'}>
        <PrimaryButton>Wow you are the first user, click here to create a grid!</PrimaryButton>
      </Link>
    )
    // if the axios req hasnt finished
  } else if (user) {
    return (
      'Loading...'
    )
    // if no user(logged out), show welcome component
  } else return (<Welcome/>)
}

export default withRouter(Home)
