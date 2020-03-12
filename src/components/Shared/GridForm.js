import React from 'react'
import { PrimaryButton, DangerButton } from '../Shared/Styled_Components'
import Form from 'react-bootstrap/Form'

const GridForm = ({ grid, handleChange, handleSubmit, owned, deleteGrid, saveAsNew }) => (
  <span>
    <Form
      style={{ margin: '2rem auto .3rem', width: '60%' }}
      onSubmit={handleSubmit}
    >
      <Form.Control
        name="name"
        placeholder="name me!"
        value={grid.name}
        onChange={handleChange}
      />
      <PrimaryButton type="submit">Save</PrimaryButton>
      <PrimaryButton onClick={saveAsNew}>Save as new!</PrimaryButton>

      {owned && (
        <DangerButton
          type="button"
          onClick={deleteGrid}
        >
          Delete
        </DangerButton>
      )}
    </Form>
  </span>
)
export default GridForm
