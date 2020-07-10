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

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 2049;
canvas.height = 1152;
document.body.appendChild(canvas);
console.log(screen.width)
console.log(screen.height)


let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let score = 0;

// function loadImages() {
//   bgImage = new Image();
//   bgImage.onload = function () {
//     // show the background image
//     bgReady = true;
//   };
//   bgImage.src = "images/Not Others.jpg";
//   heroImage = new Image();
//   heroImage.onload = function () {
//     // show the hero image
//     heroReady = true;
//   };
//   heroImage.src = "images/s_them_pod.png";

//   monsterImage = new Image();
//   monsterImage.onload = function () {
//     // show the monster image
//     monsterReady = true;
//   };
//   monsterImage.src = "images/monster.png";
// }
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/bg.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/siren-bh.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
  monsterImage.src = "images/shiva1.png";

}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function getReady (){
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
let gameOver= true;
let update = function () {
  // Update the time.


if((SECONDS_PER_ROUND-elapsedTime)<= 0){
  gameOver=false;
  return;
}
elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  // if (38 in keysDown) { // Player is holding up key
  //   heroY -= 5;
  // }
  // if (40 in keysDown) { // Player is holding down key
  //   heroY += 5;
  // }
  // if (37 in keysDown) { // Player is holding left key
  //   heroX -= 5;
  // }
  // if (39 in keysDown) { // Player is holding right key
  //   heroX += 5;
  // }
  if (38 in keysDown) { // Player is holding up key
    heroY -= 5;
    heroImage.src = "images/siren-bh.png";

  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 5;
    heroImage.src = "images/siren-fr.png";
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 5;
    heroImage.src = "images/siren-l.png";
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 5;
    heroImage.src = "images/siren-r.png";
  }


  if(heroX > canvas.width-32){
    heroX= 0;
  }
  
  if(heroX < 0){
    heroX = canvas.width-32;
  }
   //

  if(heroY < 0 ){
    heroY = canvas.height-32;
  }

  if(heroY > canvas.height-32){
    heroY = 0;
  }
  /////
  if(monsterX > canvas.width-32){
    monsterX= 0;
  }
  
  if(monsterX < 0){
    monsterX = canvas.width-32;
  }
   //

  if(monsterY < 0 ){
    monsterY = canvas.height-32;
  }

  if(monsterY > canvas.height-32){
    monsterY = 0;
  }
  
  
  

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = Math.random()*canvas.width;
    monsterY = Math.random()*canvas.width;
    score++;
  }
  
};





/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if((SECONDS_PER_ROUND-elapsedTime) == 0){

    ctx.fillText(`Game Over`, 20, 130);
  }
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
  ctx.fillText(`Score: ${score}`, 20, 150);
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update(); 
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
}

function reset() {
  location.reload();
}