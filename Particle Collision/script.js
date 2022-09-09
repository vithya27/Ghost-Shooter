//Query Selectors
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Make canvas full screen
canvas.width = innerWidth;
canvas.height = innerHeight;

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

// Create Player
const player = new Player(canvas.width / 2, canvas.height, 40, "white");

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

  console.log(angle);

  projectiles.push(
    new Projectile(
      // to spawn from the player
      canvas.width / 2,
      canvas.height,
      5,
      "red",
      velocity
    )
  );
});

animate();
