import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const DepthButton = props => {
  return <PrimaryButton onClick={props.onClick}> Depth First </PrimaryButton>
}

export default DepthButton
