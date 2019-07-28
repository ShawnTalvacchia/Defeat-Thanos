/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;
let isOver = false;
let isWon = false;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 656;
document.getElementById("game-container").appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

const randomNumberWidth = () => Math.floor(Math.random() * 700)
const randomNumberHeight = () => Math.floor(Math.random() * 656)


function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  
  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/** 
 * Setting up our characters.
 */

let heroX = randomNumberWidth() - 50;
let heroY = randomNumberHeight() - 50;

let monsterX = randomNumberWidth() - 50;
let monsterY = randomNumberHeight() - 50;
let hitNumber = 0;

/** 
 * Keyboard Listeners
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  
  if (hitNumber >= 20) {
    isWon = true;
  }
  else if (elapsedTime >= SECONDS_PER_ROUND) {
    isOver = true;
  }

  if (38 in keysDown && heroY > 1) { // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown && heroY < 604) { // Player is holding down key
    heroY += 7;
  }
  if (37 in keysDown && heroX > 1) { // Player is holding left key
    heroX -= 6;
  }
  if (39 in keysDown && heroX < 650) { // Player is holding right key
    heroX += 6;
  }
  
  const heroIsTouchingMonster = heroX <= (monsterX + 90)
  && monsterX <= (heroX + 90)
  && heroY <= (monsterY + 90)
  && monsterY <= (heroY + 90)

  if (heroIsTouchingMonster)
   {
    monsterX = randomNumberWidth() - 50;
    monsterY = randomNumberHeight() - 50;
    hitNumber +=1;
  }
};

var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0)
    
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }

  if (isOver) {
    document.getElementById("Title").innerHTML = `Thanos got away!`;
  }
  if (isWon) {
    document.getElementById("Title").innerHTML = `You saved Earth!`;
  }


  document.getElementById("Time").innerHTML = `Time: ${SECONDS_PER_ROUND - elapsedTime}`
  document.getElementById("Hits").innerHTML = `Hits: ${hitNumber}`
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  if(!isOver && !isWon) {
    update();
  } 
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();