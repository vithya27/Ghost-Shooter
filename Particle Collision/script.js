// Query Selectors
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const statusbar_div = document.querySelector("statusbar");
const cursor_div = document.querySelector(".cursor");
const health_progress = document.getElementById("health");
const score_span = document.getElementById("score");
const damage = document.getElementById("flash-red");
const modal_container = document.querySelector(".modal-container");
const startGame2_button = document.getElementById("start-game2");
const gameover_modal = document.querySelector(".gameover-container");
const restart_button = document.getElementById("restart");
const finalScore_h2 = document.querySelector(".finalScore");
const stylesheet = document.querySelector("#style");
const jsfile = document.querySelector("#script");
const gunSound_wav = new Audio("audio/gunsound.wav");

// start game modal
addEventListener("load", () => {
  modal_container.classList.add("show");
});

// Make canvas full screen
canvas.width = innerWidth;
canvas.height = innerHeight - 50;

// Dark mode/light mode
// function lightModeFiles() {
//   stylesheet.setAttribute("href", "lightmode.css");
//   jsfile.setAttribute("src", "scriptdarkmode.js");
//   console.log(stylesheet);
//   console.log(jsfile);
// }

// lightModeFiles();

// Create Player Class
class Player {
  constructor(x, y, radius, health) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.health = health;

    this.image = new Image();
    this.image.src = "img/planet3.png";

    // this.image = image;
    this.image.onload = () => {
      this.isLoaded = true;
    };
    this.width = 100;
    this.height = 100;
  }

  drawPlayer() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    this.isLoaded && ctx.drawImage(this.image, this.x - 100, this.y - 100);
  }
}

// Reduce health
function reduceHealth() {
  player.health = player.health - 5;
  health_progress.value = player.health;
  damage.classList.add("player-damage");
  setTimeout(function () {
    damage.classList.remove("player-damage");
  }, 300);
}

function increaseHealth() {
  player.health += 20;
  health_progress.value = player.health;
}

// Create projectile array to imitate a stream of bullets
let projectiles = [];

// Create particles array
let particles = [];

// Create ghosts array
let ghosts = [];

let hearts = [];
// Create Player
let player = new Player(canvas.width / 2, canvas.height, 40, 100);

// Create Projectiles class

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  drawProjectile() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.drawProjectile();

    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Particle {
  constructor(x, y, radius, color, velocity, alpha = 0.01) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = alpha;
  }
  drawParticle() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.drawParticle();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// Create Ghosts

class Ghost {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  // same logic as projectiles
  drawGhost() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.moveTo(this.x - this.radius, this.y);
    ctx.lineTo(this.x + this.radius * 2, this.y);

    const angle = Math.PI / 180;
    if (this.radius === 30) {
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.arc(this.x, this.y, this.radius, angle * 180, angle * 0, false);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.lineTo(this.x + this.radius - 10, this.y + this.radius - 10);
      ctx.lineTo(this.x + this.radius - 20, this.y + this.radius);
      ctx.lineTo(this.x, this.y + this.radius - 10);
      ctx.lineTo(this.x - 10, this.y + this.radius);
      ctx.lineTo(this.x - 20, this.y + this.radius - 10);
      ctx.lineTo(this.x - this.radius, this.y + this.radius);
      ctx.lineTo(this.x - this.radius, this.y);
      ctx.stroke();
      ctx.arc(this.x - 15, this.y, 2.5, angle * 180, angle * 360, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.arc(this.x + 15, this.y, 2.5, angle * 180, angle * 360, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    } else if (this.radius == 20) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.arc(this.x, this.y, this.radius, angle * 180, angle * 0, false);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.lineTo(this.x + this.radius - 6.7, this.y + this.radius - 6.7);
      ctx.lineTo(this.x + this.radius - 13.3, this.y + this.radius);
      ctx.lineTo(this.x, this.y + this.radius - 6.7);
      ctx.lineTo(this.x - 6.7, this.y + this.radius);
      ctx.lineTo(this.x - 13.3, this.y + this.radius - 6.7);
      ctx.lineTo(this.x - this.radius, this.y + this.radius);
      ctx.lineTo(this.x - this.radius, this.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.arc(this.x - 10, this.y, 2, angle * 0, angle * 360, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.arc(this.x + 10, this.y, 2, angle * 0, angle * 360, false);
      ctx.stroke();
    }
    // else {
    //   ctx.beginPath();
    //   ctx.strokeStyle = this.color;
    //   ctx.lineWidth = 3;
    //   ctx.arc(this.x, this.y, this.radius, angle * 180, angle * 0, false);
    //   ctx.lineTo(this.x + this.radius, this.y + this.radius);
    //   ctx.lineTo(this.x + this.radius, this.y + this.radius);
    //   ctx.lineTo(this.x + this.radius - 2.5, this.y + this.radius - 2.5);
    //   ctx.lineTo(this.x + this.radius - 5, this.y + this.radius);
    //   ctx.lineTo(this.x, this.y + this.radius - 2.5);
    //   ctx.lineTo(this.x - 2.5, this.y + this.radius);
    //   ctx.lineTo(this.x - 5, this.y + this.radius - 2.5);
    //   ctx.lineTo(this.x - this.radius, this.y + this.radius);
    //   ctx.lineTo(this.x - this.radius, this.y);
    //   ctx.stroke();
    // }

    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // ctx.fillStyle = this.color;
    // ctx.fill();
  }

  update() {
    this.drawGhost();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Heart {
  constructor(x, y, width, height, color = "red", velocity) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocity = velocity;
  }

  // Draw heart
  drawHeart() {
    ctx.beginPath();
    let topCurveHeight = this.height * 0.3;
    ctx.moveTo(this.x, this.y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
      this.x,
      this.y,
      this.x - this.width / 2,
      this.y,
      this.x - this.width / 2,
      this.y + topCurveHeight
    );

    // bottom left curve
    ctx.bezierCurveTo(
      this.x - this.width / 2,
      this.y + (this.height + topCurveHeight) / 2,
      this.x,
      this.y + (this.height + topCurveHeight) / 2,
      this.x,
      this.y + this.height
    );

    // bottom right curve
    ctx.bezierCurveTo(
      this.x,
      this.y + (this.height + topCurveHeight) / 2,
      this.x + this.width / 2,
      this.y + (this.height + topCurveHeight) / 2,
      this.x + this.width / 2,
      this.y + topCurveHeight
    );

    // top right curve
    ctx.bezierCurveTo(
      this.x + this.width / 2,
      this.y,
      this.x,
      this.y,
      this.x,
      this.y + topCurveHeight
    );

    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.drawHeart();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

let interval;

function createGhosts(intervalTime) {
  clearInterval(interval);
  interval = setInterval(() => {
    const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#B5EAD7", "#C7CEEA"];

    // target cannot be too small. sets a range 7-30
    const radii = [30, 20];
    const radius = radii[Math.floor(Math.random() * radii.length)];

    // must spawn outside the canvas and not too near the player itself.

    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -60 : canvas.width + 60;
      y = Math.random() * canvas.height - 50;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? -50 : null;
    }

    const color = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.atan2(canvas.height - y, canvas.width / 2 - x);

    // set velocity
    const velocity = {
      x: Math.cos(angle) * 1.5,
      y: Math.sin(angle) * 1.5,
    };

    ghosts.push(new Ghost(x, y, radius, color, velocity));
  }, intervalTime);
}

let heartInterval;

function createHearts() {
  clearInterval(heartInterval);
  heartInterval = setInterval(() => {
    // must spawn outside the canvas and not too near the player itself.
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - this.width : canvas.width + this.width;
      y = Math.random() * canvas.height - this.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - this.height : null;
    }

    const angle = Math.atan2(canvas.height - y, canvas.width / 2 - x);

    // set velocity
    const velocity = {
      x: Math.cos(angle) * 1.5,
      y: Math.sin(angle) * 1.5,
    };

    hearts.push(new Heart(x, y, 50, 50, undefined, velocity));
  }, 20000);
}

// Animate projectiles
let requestID;
let score = 0;
function animate() {
  // to loop animate over and over again
  const requestID = requestAnimationFrame(animate);
  // to see each individual particle drawn.
  ctx.fillStyle = "rgba(3, 8, 31,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw player after so that player is not wiped out
  player.drawPlayer();

  particles.forEach((particle, index) => {
    particle.update();
    if (
      particle.x - particle.radius < 0 ||
      particle.x + particle.radius > canvas.width ||
      particle.y + particle.radius < 0 ||
      particle.y - particle.radius > canvas.height
    ) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();
    // remove projectiles from edge of screen
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x + projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  hearts.forEach((heart, index) => {
    heart.update();
    const distance = Math.hypot(player.x - heart.x, player.y - heart.y);
    // calculate distance between player and ghost

    if (distance - heart.height - player.radius < 1) {
      hearts.splice(index, 1);
      increaseHealth();
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - heart.x,
        projectile.y - heart.y
      );
      if (distance - heart.height - projectile.radius < 1) {
        hearts.splice(index, 1);
        projectile.splice(projectileIndex, 1);
      }
    });
  });

  ghosts.forEach((ghost, index) => {
    ghost.update();
    const distance = Math.hypot(player.x - ghost.x, player.y - ghost.y);
    // console.log(distance - ghost.radius - player.radius);
    // calculate distance between player and ghost

    if (distance - ghost.radius - player.radius < 1) {
      ghosts.splice(index, 1);
      reduceHealth();
    }

    // test distance between projectile and ghost in the parojectile array.
    // Math.hypot tests distance between two items
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - ghost.x,
        projectile.y - ghost.y
      );
      // projectile and ghost touch then remove that particular ghost and projectile.
      if (distance - ghost.radius - projectile.radius < 1) {
        // create explosion
        for (let index = 0; index < ghost.radius / 2; index++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              ghost.color,
              { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 },
              undefined
            )
          );
        }

        // to prevent animate from trying to draw the removed items
        if (ghost.radius - 10 > 10) {
          // score
          score += 50;
          score_span.innerHTML = `Score: ${score}`;
          ghost.radius -= 10;
          projectiles.splice(projectileIndex, 1);
        } else {
          score += 150;
          score_span.innerHTML = `Score: ${score}`;
          ghosts.splice(index, 1);
          projectiles.splice(projectileIndex, 1);
        }
      }
    });
  });

  // end game
  if (player.health === 0) {
    cancelAnimationFrame(requestID);
    gameover_modal.classList.add("show");
    finalScore_h2.innerHTML = score;
  }
}

// Add Event Listener for click event and take the projectile and pass into array to simulate bullets
addEventListener("click", (event) => {
  //console.log(event.clientX,event.clientY)

  gunSound_wav.play();
  // angle from center of player to mouse
  const angle = Math.atan2(
    event.clientY - canvas.height,
    event.clientX - canvas.width / 2
  );

  // set velocity
  const velocity = {
    x: Math.cos(angle) * 3,
    y: Math.sin(angle) * 3,
  };

  // console.log(angle);

  projectiles.push(
    new Projectile(
      // to spawn from the player
      canvas.width / 2,
      canvas.height,
      5,
      "#e2f0cb",
      velocity
    )
  );
});

startGame2_button.addEventListener("click", () => {
  modal_container.classList.remove("show");
  animate();
  createGhosts(2000);
  createHearts();
  // if you just put setTimeout, it will run it immediately
  // have to put it as an anonymous function
  setTimeout(() => {
    createGhosts(1000);
  }, 10000);
  setTimeout(() => {
    createGhosts(500);
  }, 20000);
});

function restart() {
  // Create Player
  player = new Player(canvas.width / 2, canvas.height, 40, 100);

  // Create projectile array to imitate a stream of bullets
  projectiles = [];

  // Create particles array
  particles = [];

  // Create ghosts array
  ghosts = [];

  hearts = [];

  score = 0;
  score_span.innerHTML = `Score: ${score}`;
  finalScore_h2.innerHTML = score;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animate();
  createGhosts(2000);
  createHearts();
  // if you just put setTimeout, it will run it immediately
  // have to put it as an anonymous function
  setTimeout(() => {
    createGhosts(1000);
  }, 10000);
  setTimeout(() => {
    createGhosts(500);
  }, 20000);
}

restart_button &&
  restart_button.addEventListener("click", () => {
    gameover_modal.classList.remove("show");
    restart();
  });
