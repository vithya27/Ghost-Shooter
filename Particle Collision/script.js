// Query Selectors
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const statusbar_div = document.querySelector("statusbar");
const cursor_div = document.querySelector(".cursor");
const health_progress = document.getElementById("health");
const score_span = document.getElementById("score");
const startGame_button = document.getElementById("pause-game");

// Make canvas full screen
canvas.width = innerWidth;
canvas.height = innerHeight - 50;

// Pause Game/start Game

// Create a viewfinder
document.body.style.cursor = "none";

function moveMouse(e) {
  const x = e.clientX;
  const y = e.clientY;

  cursor_div.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
}

document.addEventListener("mousemove", moveMouse);

// Create Player Class
class Player {
  constructor(x, y, radius, color, health) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.health = health;
  }
  drawPlayer() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Create Player
const player = new Player(canvas.width / 2, canvas.height, 40, "#E2F0CB", 100);

// Reduce health
function reduceHealth() {
  player.health = player.health - 5;
  health_progress.value = player.health;
}

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

// Create projectile array to imitate a stream of bullets
const projectiles = [];

// Create particles
const particles = [];

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

// Create Enemies

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  // same logic as projectiles
  drawEnemy() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.drawEnemy();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const enemies = [];
let interval;

function createEnemies() {
  // create enemies every 1 second
  interval = setInterval(() => {
    const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#B5EAD7", "#C7CEEA"];

    // target cannot be too small. sets a range 7-30
    const radius = Math.random() * (30 - 10) + 10;

    // must spawn outside the canvas and not too near the player itself.

    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height - 100;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : null;
    }

    const color = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.atan2(canvas.height - y, canvas.width / 2 - x);

    // set velocity
    const velocity = {
      x: Math.cos(angle) * 1.5,
      y: Math.sin(angle) * 1.5,
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1500);
}

createEnemies();

// Animate projectiles
let requestID;
let score = 0;
function animate() {
  // to loop animate over and over again
  const requestID = requestAnimationFrame(animate);
  // to see each individual particle drawn.

  function startGame() {
    console.log("start game");
  }
  ctx.fillStyle = "rgba(3, 8, 31,0.1)";
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

  enemies.forEach((enemy, index) => {
    enemy.update();
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // console.log(distance - enemy.radius - player.radius);
    // calculate distance between player and enemy

    if (distance - enemy.radius - player.radius < 1) {
      enemies.splice(index, 1);
      reduceHealth();
    }

    // test distance between each of the projectiles in the parojectile array.
    // Math.hypot tests distance between two items
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      // projectile and enemy touch then remove that particular enemy and projectile.
      if (distance - enemy.radius - projectile.radius < 1) {
        // create explosion
        for (let index = 0; index < enemy.radius / 2; index++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 },
              undefined
            )
          );
        }

        // to prevent animate from trying to draw the removed items
        if (enemy.radius - 10 > 5) {
          // score
          score += 50;
          score_span.innerHTML = `Score: ${score}`;
          enemy.radius -= 10;
          projectiles.splice(projectileIndex, 1);
        } else {
          score += 150;
          score_span.innerHTML = `Score: ${score}`;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });

  if (player.health === 0) {
    cancelAnimationFrame(requestID);
    clearInterval(interval);
  }
}

// Add Event Listener for click event and take the projectile and pass into array to simulate bullets
addEventListener("click", (event) => {
  //console.log(event.clientX,event.clientY)

  // angle from center of player to mouse
  const angle = Math.atan2(
    event.clientY - canvas.height,
    event.clientX - canvas.width / 2
  );

  // set velocity
  const velocity = {
    x: Math.cos(angle) * 2,
    y: Math.sin(angle) * 2,
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

animate();
