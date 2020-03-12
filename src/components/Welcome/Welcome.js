import React, { Fragment } from 'react'
const Welcome = (props) => {
  return (
    <Fragment>
      <h3>
      Welcome to my interactive pathfinding app!
      </h3>
      <p>Please sign up to begin!</p>
      <p>In this app, you will be able to create and modify grids with walls by dragging your mouse. When you tell the animation to begin by clicking on a button designated to an algorithm , for example A*, the algorithm will begin drawing a path from the top left to the bottom right corner while avoiding walls. For this demonstration, it is able to pass through diagonal walls if they do not form a corner. There may be be other colors to help you understand what is happening based on the algorithm.</p>
    </Fragment>
  )
}

export default Welcome
