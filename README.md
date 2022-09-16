# Project Title

Ghost Shooter

# Project Description

Ghost Shooter is a game I developed as my first project for General Assembly's software engineering bootcamp. It is a canvas-based game where you shoot at Pac-Man ghosts as they come at you.

Bigger ghosts have a shield and require more bullets. Everytime you hit a big ghost, you get 50 points. If you hit a small ghost, you get 150 points.

The player has 100 health points. If the ghost touches you, you lose 5 health points.

To restore 10 health points, do not shoot the heart if it appears.

# Approach Taken
Classes were used to create the different items seen on screen.

The ghost, projectile, particle and heart were each drawn and pushed into arrays. The ghost and heart were drawn and updated with velocity based on intervals. The projectile is drawn and updated with velocity when there is a click event from the user. The particle is drawn and updated with velocity when the projectile collides with the ghost. 

Each of the items above were spliced out either upon collision or when they leave the boundaries of the canvas. 

# Next Steps
These are some features I hope to implement in the future:

- Dark mode/light mode toggle
- Stages
- Adding more characters with different hit points
- Adding powerups

# Credits and Acknowledgements

Kenney.nl
Chris Courses on YouTube
