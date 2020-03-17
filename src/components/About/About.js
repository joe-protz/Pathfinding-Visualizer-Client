import React, { Fragment } from 'react'
import AStar from '../../images/A.png'
import Breadth from '../../images/BreadthWithWght.png'
import Djikstra from '../../images/Djikstra.png'
import Depth from '../../images/Depth.png'
import Legend from '../../components/Shared/Legend'
const About = props => {
  return (
    <Fragment>
      <h3>About!</h3>
      <p>
        This app is intended to be a fun way to visualize how search algorithms
        work. Here is a brief summary of each. In each set, you can consider a
        nodes marked closed as nodes who have already been visited. Nodes marked
        as open are in the current set being evaluated.
      </p>
      <Legend />
      <h4>Breadth First Search</h4>
      <p>
        Breadth First Search is a search algorithm that does not attempt to be
        clever in how it finds the target. It is in most cases, extremely slow.
        The idea behind it is that you create a queue starting with just the
        start node, and then as you search you add each neighbor to the top of
        the queue. In this way, we are sure to check ALL neighbors of a single
        node before moving on. You can think of it as simply checking all
        possible neighbors before moving deeper by a single level.
      </p>
      <p>
        Breadth first search will not take into account the cost of getting from
        one node to another, so in the case of this app, you will see no matter
        how much terrain you add, it will not change the path at all. In other
        words, it is a brute force search to find any solution. In the picture
        below, note that it simply passed straight through the dark red nodes
        instead of going around.
      </p>
      <img src={Breadth}></img>
      <h4>Depth First Search</h4>
      <p>
        Depth First search is very similar to Breadth first, except for instead
        of searching as wide as possible, it attempts to go as deep as possible
        until finding the target or getting stuck. If it gets stuck it will
        backtrack until it finds an unvisited neighbor, and then go as deep as
        possible from there. Instead of a queue, it has a stack, where each
        neighbor is added to the stack as you go.
      </p>

      <p>
        Just like Breadth first search, take note that while it does avoid
        obstacles, it does not care about terrain or an optimal solution, it is
        a brute force algorithm that is very inefficient.
      </p>
      <img src={Depth}></img>
      <h4>Djikstra Shortest Path</h4>
      <p>
        With Djikstra&apos;s Shortest Path algorithm, we finally make some
        progress towards being smart with how we search. Djiksta&apos; s
        Algorithm will always find the , or one of, the shortest path(s). It
        does this by using the distance that it took to get to each neighbor
        starting from the beginning. In this way, we know that if we find a
        shorter way to get to the same node, we can update it&apos;s distance and where it came from to reflect this shortest path. In addition, this algorithm is able to consider cost of getting to each node. So in this implementation, every weighted cell will add 30 to the cost needed to traverse through. For reference, going up and down a normal cell will cost 10, and a diagonal will cost 14. You can see below, that while the algorithm still had to search nearly as much as the previous two, it found a much shorter path by going around the dark red cells. You could consider these cells like a traffic jam on a highway, where the distance is lower, but the time it would take is longer.
      </p>
      <img src={Djikstra}></img>

      <h4>A*</h4>
      <p>
        A* is a search algorithm that aims to extend Dijkstra&apos;s Algorithm,
        which was less efficient. A* achieves this efficiency by using a
        heuristic approach, where in addition to knowing how long it took to get to the current node, it will take a guess as to how far away it is from the end. In every loop the algorithm is checking to see
        which node has the best odds of taking you to the shortest path, and going from there. You can see below, that not only did it find the shortest path, but it also had a much smaller closed set, represented by red and light red cells.

      </p>

      <img src={AStar}></img>
    </Fragment>
  )
}

export default About
