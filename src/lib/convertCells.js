import AStarCell from '../components/Shared/A_StarCell'

const convertCells = (cells, algorithm) => {
  cells.forEach((row, i) => row.forEach((cell, j) => {
    if (algorithm === 'A*') {
      cells[i][j] = new AStarCell(cell.i, cell.j, cell.size, cell.p5, cell.wall)
    }
  }))
  return cells
}

export default convertCells
