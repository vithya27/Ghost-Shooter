// Query Selectors
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const statusbar_div = document.querySelector("statusbar");
const cursor_div = document.querySelector(".cursor");

// Make canvas full screen
canvas.width = innerWidth;
canvas.height = innerHeight;

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
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  drawPlayer() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
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

// Create Enemies

class Enemy {
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

const enemies = [];

function createEnemies() {
  // create enemies every 1 second
  setInterval(() => {
    const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#B5EAD7", "#C7CEEA"];

    // target cannot be too small. sets a range 7-30
    const radius = Math.random() * (30 - 7) + 7;

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
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
    console.log(enemies);
  }, 2000);
}

createEnemies();

// Create Player
const player = new Player(canvas.width / 2, canvas.height, 40, "#E2F0CB");

// Create projectile array to imitate a stream of bullets
const projectiles = [];

// Animate projectiles
function animate() {
  // to loop animateProjectiles over and over again
  requestAnimationFrame(animate);
  // to see each individual particle drawn.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw player after so that player is not wiped out
  player.drawPlayer();
  projectiles.forEach((projectile) => {
    projectile.update();
  });

  enemies.forEach((enemy) => {
    enemy.update();
  });
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
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  // console.log(angle);

  projectiles.push(
    new Projectile(
      // to spawn from the player
      canvas.width / 2,
      canvas.height,
      5,
      "white",
      velocity
    )
  );
});

animate();
