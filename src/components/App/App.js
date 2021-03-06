import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Header from '../Header/Header'
import SignUp from '../SignUp/SignUp'
import SignIn from '../SignIn/SignIn'
import SignOut from '../SignOut/SignOut'
import ChangePassword from '../ChangePassword/ChangePassword'

// ------------------------------------
import Home from '../Home/Home'
import SavedGrid from '../SavedGrid/SavedGrid'
import NewGrid from '../NewGrid/NewGrid'
import GridsList from '../GridsList/GridsList'
import About from '../About/About'
// ------------------------------------

class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null,
      msgAlerts: []
    }
  }
  // set the user on login
  setUser = user => this.setState({ user })
  // used to let the app know a new user has visited the homepage at least once
  updateUser =() => {
    this.setState({ user: { ...this.state.user, firstTime: false } })
  }
  // used on logout
  clearUser = () => this.setState({ user: null })
  // pass down to any components as needed
  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] })
  }

  render () {
    const { msgAlerts, user } = this.state

    return (
      <Fragment>
        {/* Navbar */}
        <Header user={user} />
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <main className="container">
          {/* Auth Routes-------------------------------- */}
          <Route
            path="/sign-up"
            render={() => (
              <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
            )}
          />
          <Route
            path="/sign-in"
            render={() => (
              <SignIn msgAlert={this.msgAlert} setUser={this.setUser} />
            )}
          />
          <AuthenticatedRoute
            user={user}
            path="/sign-out"
            render={() => (
              <SignOut
                msgAlert={this.msgAlert}
                clearUser={this.clearUser}
                user={user}
              />
            )}
          />
          <AuthenticatedRoute
            user={user}
            path="/change-password"
            render={() => (
              <ChangePassword msgAlert={this.msgAlert} user={user} />
            )}
          />
          {/* Grid Routes-------------------------------- */}
          {/* Home Route handles both unauth and auth */}
          <Route
            exact
            path="/"
            render={() => (
              <Home
                msgAlert={this.msgAlert}
                user={user}
                updateUser={this.updateUser}
                setUser={this.setUser}
              />
            )}
          />
          {/* SHOW Grid */}
          <AuthenticatedRoute
            user={user}
            exact
            path="/grids/:id"
            render={({ match }) => (
              <SavedGrid msgAlert={this.msgAlert} match={match} user={user} />
            )}
          />
          {/* CREATED Grid */}
          <AuthenticatedRoute
            user={user}
            path="/new_grid"
            render={({ match }) => (
              <NewGrid msgAlert={this.msgAlert} match={match} user={user} />
            )}
          />
          <AuthenticatedRoute
            user={user}
            path="/my_grids"
            render={({ match }) => (
              <GridsList msgAlert={this.msgAlert} match={match} user={user} />
            )}
          />
          {/* About */}
          <Route
            path="/about"
            component={About}
          />
        </main>
      </Fragment>
    )
  }
}

export default App
