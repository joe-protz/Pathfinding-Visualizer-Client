import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import ResetBoardButton from './ResetBoardButton'
import RandomWallsButton from './RandomWallsButton'
import RandomWeightsButton from './RandomWeightsButton'
import ResetCellsButton from './ResetCellsButton'
import AStarButton from './AStarButton'
import BreadthButton from './BreadthButton'
import DepthButton from './DepthButton'
import DjikstraButton from './DjikstraButton'
import BeginButton from './BeginButton'
import EditButton from './EditButton'

const AllButtons = props => {
  const { algorithm, running, cells, start, end, resetBoard, beginAStar, beginBreadth, beginDepth, beginDjikstra, begin, msgAlert, toggleEditing, editing } = props
  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto ml-auto">
          <Nav.Item as={BeginButton} onClick={begin}></Nav.Item>
          <Nav.Item as={EditButton} editing={editing} onClick={toggleEditing}></Nav.Item>
        </Nav>

        <Nav className="mr-auto ml-auto">
          <NavDropdown title={algorithm || 'Select Algorithm'}>
            <NavDropdown.Item
              onClick={beginAStar}
              as={AStarButton}
            ></NavDropdown.Item>

            <NavDropdown.Item
              as={BreadthButton}
              onClick={beginBreadth}
            ></NavDropdown.Item>

            <NavDropdown.Item
              as={DepthButton}
              onClick={beginDepth}
            ></NavDropdown.Item>

            <NavDropdown.Item
              as={DjikstraButton}
              onClick={beginDjikstra}
            ></NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      {/* Generate Buttons */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className=" mr-auto ml-auto">
          <NavDropdown title="Generate">
            <NavDropdown.Item
              as={RandomWallsButton}
              running={running}
              cells={cells}
              start={start}
              end={end}
              editing={editing}
              msgAlert={msgAlert}
            ></NavDropdown.Item>

            <NavDropdown.Item
              as={RandomWeightsButton}
              running={running}
              cells={cells}
              start={start}
              end={end}
              msgAlert={msgAlert}
              editing={editing}
            ></NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      {/* Reset Buttons */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto ml-auto">
          <NavDropdown title="Resets">
            <NavDropdown.Item
              as={ResetCellsButton}
              running={running}
              cells={cells}
              msgAlert={msgAlert}
            ></NavDropdown.Item>

            <NavDropdown.Item
              as={ResetBoardButton}
              resetBoard={resetBoard}
              cells={cells}
            ></NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default AllButtons
