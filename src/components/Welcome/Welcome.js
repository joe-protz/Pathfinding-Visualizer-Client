import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { PrimaryButton } from '../Shared/Styled_Components'

import { signIn } from '../../api/auth'
import messages from '../AutoDismissAlert/messages'

import './Welcome.scss'

const Welcome = (props) => {
  const { msgAlert, history, setUser } = props

  const login = () => {
    signIn({
      email: '1@1',
      password: '1'
    })
      .then(res => setUser(res.data.user))
      .then(() => history.push('/'))
      .catch(error => {
        msgAlert({
          heading: 'Sign In Failed with error: ' + error.message,
          message: messages.signInFailure,
          variant: 'danger'
        })
      })
  }
  return (
    <div className='welcome-box'>
      <h3 className='mt-3 mb-3'>
      Welcome to my interactive pathfinding app!
      </h3>
      <p>Please sign up or sign in to begin! You may also click on the button below to sign in with my test account.</p>
      <p className='text-center'>
        <PrimaryButton onClick={login} >Test Account</PrimaryButton>
      </p>

      <p>In this app, while editing is enabled you will be able to create and modify grids with walls by dragging your mouse.  In addition, you may hold the shift button while dragging to add terrain. Walls are not able to be passed, while terrain costs more to go through. Some Algorithms, like Djikstra&apos;s will consider terrain, while others, like Breadth First will not consider it at all. Click on the <Link to={'/about'}>about</Link> link to learn more.

      </p>

      <p>The first step is choosing an algorithm, as the Begin button will not do anything until you have chosen an algorithm to visualize. There are also buttons to generate a random selection of walls or weighted cells. When you tell the animation to begin by clicking on the [Begin/Reset] button the algorithm will begin drawing a path from the top left to the bottom right corner while avoiding walls. For this demonstration, it is able to pass through diagonal walls if they do not form a corner. There is a legend to help you understand what is being visualized. In all algorithms, the open set contains cells being considered in the loop, while the closed set contains all cells that have already been evaluated. If there is no solution because of walls, it will stop at the best solution found.</p>
    </div>
  )
}

export default withRouter(Welcome)
