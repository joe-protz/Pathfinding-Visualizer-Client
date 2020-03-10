import React from 'react'
const GridForm = ({ grid, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <label>Title</label>
    <input
      name="name"
      placeholder="name me!"
      value={grid.name}
      onChange={handleChange}
    />
    <button type="submit">Save</button>
  </form>
)
export default GridForm
