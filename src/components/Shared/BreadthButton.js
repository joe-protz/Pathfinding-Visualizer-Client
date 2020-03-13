import React from 'react'
import { PrimaryButton } from '../Shared/Styled_Components'

const BreadthButton = props => {
  return <PrimaryButton onClick={props.onClick}> Breadth First </PrimaryButton>
}

export default BreadthButton
