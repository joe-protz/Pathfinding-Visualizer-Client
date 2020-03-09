## Important Links
https://www.npmjs.com/package/react-p5
https://git.generalassemb.ly/ga-wdi-boston/react-styling


### Technologies Used

- React
- HTML/CSS
- Bootstrap
- Javascript
- Axios
- SCSS 
- p5.js
- react-p5
- 

### Catalog of Routes

Verb         |	URI Pattern
------------ | -------------
GET | /grids
GET | /grids/:id
POST | /grids
PATCH | /grids/:id
DELETE | /grids/:id

### Catalog of Client Routes

URI Pattern        |	View
------------ | -------------
/sign-up | Sign Up Form
/sign-in | Sign In Form
/sign-out | Home
/change-password | Change Password form
/all | All grids
/grids | All User's grids
/grids/:id | Unique grid
/grids/:id/edit | Submits changes to user's grid
/grids/:id/delete | Delete's user's grid and redirects to all grids


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

- As an unauthenticated user I would like to be able to see the public feed of grids

<!-- Visualization  -->
- As a user I would like to be able to click a button to start the visualization process of various pathfinding algorithms
- As a user i would like to be able to click a restart button to visualize the algorithm again

## ERD

![ERD](https://imgur.com/z7O1MIA.png)

## Wireframes 
![Unauthenticated homepage](https://imgur.com/C9gOeSi.png)
![Authenticated homepage first visit](https://imgur.com/6wB4xfI.png)
![Authenticated homepage](https://imgur.com/bl52JCE.png)
![Single Owned View](https://imgur.com/MYwBK76.png)
![Single UnAuth View](https://imgur.com/y3ULW2R.png)

