# Pathfinding Visualization Client
This App is meant to be an interactive way for a user to learn and visualize pathfinding algorithms. The user is able to see a feed of community grids as well as CRUD their own grids, making it fun to see how pathfinding interacts with whatever they chose.
![My App](https://imgur.com/Lnm5YHX.png)

## Installation
- Download this repo as a zip or fork and clone it
- Unzip if necessary
- Run NPM Install
- Change  apiConfig to your point towards your API , fork and clone the API repo below to use 
- Run npm start to launch development client in browser
Run npm run deploy
## Important Links
- [Deployed Client](https://joe-protz.github.io/Pathfinding-Visualizer-Client/)
- [Client Repo](https://github.com/joe-protz/Pathfinding-Visualizer-Client)
- [API Repo](https://github.com/joe-protz/Pathfinding-API)
- [Deployed Heroku Link](https://glacial-bastion-01354.herokuapp.com)
- [React-p5](https://www.npmjs.com/package/react-p5)

## Planning Story

I began the development of this application with the idea of being able to visualize many pathfinding algorithms, potentially side by side. I also wanted to get familiar with React, so naturally I began with that. However, I had a critical decision to make, I needed to decide whether I wanted to use a library to visualize the animation or simply use react components. In the end, I decided to include p5 for several reasons.
- Ease of mobile responsiveness
  - I envisioned it being very hard to have a grid of divs scale properly with various sizes
- Increased flexibility in animation
- Familiarity

Despite this, React is not natively compatible with P5.js, so I included a dependency of react-p5, which let me include p5 sketches in a component. 

This was great, but not as nice as native p5, nor standard react alone. However, I was determined to make it work, so I kept trucking along.

A few big issues I ran into were how the draw loop seems to work with react-p5. It really hates having multiple things being drawn from the same object in a single draw loop. Standard p5 has no issues with this. As a result each cell has a single 'show' function, and I use states within the cell itself to decide what to draw. In a way, this is more react-y.

In addition, you do not have access to p5 across files as normal, which makes things difficult. I pass a reference to p5 to my class file of cell as an argument. A bit hacky, but it was the only solution working. 

In addition, p5 and react are fundamentally different. P5 loves to be fluid and change things around and share files, react wants everything to be a state or a prop. This took a bit of finesse to get working as intended.

In the end, I am happy with the end result and hope you can enjoy the visualizations, I find it quite mesmerizing. 

### Technologies Used

- React
- HTML/CSS
- Bootstrap
- Javascript
- Axios
- SCSS 
- p5.js
- react-p5


### Catalog of Client Routes

URI Pattern        |	View
------------ | -------------
/sign-up | Sign up form
/sign-in | Sign in form
/sign-out | Home
/change-password | Change password form
/ | Home, view recent grids for user and community feed
/grids/:id | Unique grid
/my_grids | Show all user's grids in a thumbnail view
/about | About page

## User Stories
<!-- Authentication  -->
- As a unauthenticated  user I want to be able to sign up and sign in
- As an authenticated user I want to be able to change my password and sign out

<!-- CRUD -->
- As an authenticated user:
  - I want to be able to click on a grid to add walls to it
  - I want to be able to click a button to reset the walls
  - I want to be able to save a grid with a title 
  - I want to be able to see all of my grids as thumbnails
  - I want to be able to select a grid to see it animated with various pathfinding algorithms
  - I want to be able to see a feed of all user's saved grids
  - STRETCH: Let users favorite grids , sort by most favorited
  - As I would like to be able to see the public feed of grids

<!-- Visualization  -->
- As a user I would like to be able to click a button to start the visualization process of various pathfinding algorithms
- As a user I would like to be able to click a restart button to visualize the algorithm again

## Wireframes 
![Unauthenticated homepage](https://imgur.com/C9gOeSi.png)
![Authenticated homepage first visit](https://imgur.com/6wB4xfI.png)
![Authenticated homepage](https://imgur.com/bl52JCE.png)
![Single Owned View](https://imgur.com/MYwBK76.png)
![Single UnAuth View](https://imgur.com/y3ULW2R.png)

### Unsolved Problems
In the future:
- More pathfinding algorithms will be included
- Favorites will be added
- About page will explain more algorithms
- Maze generation button
- 'Pages' For a user to load 20 thumbnails at a time
