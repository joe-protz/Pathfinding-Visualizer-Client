import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
const Welcome = (props) => {
  return (
    <Fragment>
      <h3>
      Welcome to my interactive pathfinding app!
      </h3>
      <p>Please sign up or sign in to begin!</p>
      <p>In this app, while editing is enabled you will be able to create and modify grids with walls by dragging your mouse.  In addition, you may hold the shift button while dragging to add terrain. Walls are not able to be passed, while terrain costs more to go through. Some Algorithms, like Djikstra&apos;s will consider terrain, while others, like Breadth First will not consider it at all. Click on the <Link to={'/about'}>about</Link> link to learn more.

      </p>

      <p>The first step is choosing an algorithm, as the Begin button will not do anything until you have chosen an algorithm to visualize. There are also buttons to generate a random selection of walls or weighted cells. When you tell the animation to begin by clicking on the [Begin/Reset] button the algorithm will begin drawing a path from the top left to the bottom right corner while avoiding walls. For this demonstration, it is able to pass through diagonal walls if they do not form a corner. There is a legend to help you understand what is being visualized. In all algorithms, the open set contains cells being considered in the loop, while the closed set contains all cells that have already been evaluated. If there is no solution because of walls, it will stop at the best solution found.</p>
    </Fragment>
  )
}

export default Welcome
