import React from 'react'
import { ToggleButton } from '../Shared/Styled_Components'

const BeginButton = props => {
  return <ToggleButton editing={props.editing} onClick={props.onClick}> {props.editing ? 'Disable Editing' : 'Enable Editing'} </ToggleButton>
}

export default BeginButton
