import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const BeginButton = props => {
  return <PrimaryButton onClick={props.onClick}> Begin/Restart </PrimaryButton>
}

export default BeginButton
