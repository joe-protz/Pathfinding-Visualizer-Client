import React, { Fragment } from 'react'
import AStar from '../../images/Example.png'
const About = props => {
  return (
    <Fragment>
      <h3>About!</h3>
      <p>
        This app is intended to be a fun way to visualize how search algorithms
        work. Here is a brief summary of each.
      </p>
      <p>
        <h4>A*</h4>
        A* is a search algorithm that is based off of Dijkstras Algorithm, which
        was less efficient. A* achieves this efficiency by using a heuristic
        approach, where every loop the algorithm is checking to see the next
        closest neighbor and going from there, where in Djikstras algorithm you
        search every possibility until you find the shortest path.
      </p>
      <p>
        A* uses two data structures , an open set and a closed set. My algorithm
        uses arrays, but there are more efficient ways to do this. In the open
        set are all of the possible nodes that we will be evaluating on the next
        loop. In the closed set are all nodes, or often nodes, that have already
        been calculated and do not need to be checked again.
      </p>
      <p>
        The open set starts with just the start node. We begin by checking if
        the node is the end node. If so, great were done! If not, continue.a1 We
        then loop through the open set to find the node with the lowest F score.
      </p>
      <p>
        F score is derived from the formula F = G + H, where G is how long it
        took to get to your current position, and H is an educated guess at how
        long it will take to get to the end.
      </p>
      <p>
        Once we have found the best candidate in the open set, it is removed from the open set and pushed into the closed set, as we will not be evaluating this node again.
      </p>
      <p>
        The next step is to check every neighbor of the current node. If the neighbor is already in the closed set, just ignore it, otherwise we need to do some calculations. We create a temporary new G score using the distance from the last node to the current node, and if this neighbor is in the open set, we compare the new temporary G to the old G, and take the lower of the two.
      </p>
      <p>If the neighbor is not in the open set, we give it that new G score, and push it into the open set. Finally, if the g score was updated, we calculate the H score of the neighbor using the distance from it to the end, and then calculate the new F score. Once we do that, we make sure that this node knows which node it came from. We can then know at any time what the current best path is, and at the end, we can go backwards from the end node to each of the previous nodes and know the optimal path</p>
      <p>In the visualization tool, a red cell represents the closed set, a green cell represents the open set, and the path is drawn in pink.</p>
      <img src={AStar}></img>
    </Fragment>
  )
}

export default About
