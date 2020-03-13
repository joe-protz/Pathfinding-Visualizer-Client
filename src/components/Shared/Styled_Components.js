
import styled from 'styled-components'

export const PrimaryButton = styled.button`
         background: transparent;
         border-radius: 3px;
         margin: 1em;
         padding: 0.25em 1em;
         border: 2px solid deeppink;
         &:hover {
           background: deeppink;
           color: white;
         }
         ${props =>
    props.noMargin
      ? `
      margin:0;
        background: transparent;
      color: deeppink;
    `
      : `
      background: transparent;
      color: deeppink;
    `}
       `

export const DangerButton = styled.button`
         color: white;
         background: rgb(255, 0, 0, 50);
         border-radius: 3px;
         margin: 1em;
         padding: 0.25em 1em;
         border: 2px solid rgb(255, 0, 0, 50);
         &:hover {
           color: rgb(255, 0, 0, 50);
           background: transparent;
         }
       `
