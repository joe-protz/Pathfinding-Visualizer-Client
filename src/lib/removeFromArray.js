// permanently removes an item from an arr
const removeFromArray = (arr, elt) => {
  // loops through backwards so that the removal does not cause a
  // skipped item
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) arr.splice(i, 1)
  }
}

export default removeFromArray
