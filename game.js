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
canvas.width = 700;
canvas.height = 500;
document.body.appendChild(canvas);
console.log(screen.width)
console.log(screen.height)

let bgReady, heroReady, monsterReady;
let bgImage, monImage, cakeImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let score = 0;
let userName = document.getElementById("userName").innerHTML;
const NUMBER_OBJECTS = 5;
const SIZE = 60;
const V1 = 10;
const V2 = 15;
let currentNumber = 0;

function getTime() {
  var d = new Date();
  var n = d.getTime();
  return n;

}

function getY(image, v) {
  let currentTime = getTime();
  let Y = v * (currentTime - startTime);
  return Y;
}



function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/br-p.jpg";
  monImage = new Image();
  monImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  monImage.src = "images/dr-st.png";

  cakeImage = new Image();
  cakeImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  cakeImage.src = "images/bran.png";

  cake2Image = new Image();
  cake2Image.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  cake2Image.src = "images/bran.png";

}

/** 
 * Setting up our characters.
 * 
 * Note that monX represents the X position of our hero.
 * monY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let monX = canvas.width / 2;
let monY = canvas.height / 2;

let cakeX = 0;
let cakeY = 0;


/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function getReady() {
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
  let gameOver = true;
  let update = function () {
    // Update the time.


    if ((SECONDS_PER_ROUND - elapsedTime) <= 0) {
      gameOver = false;
      return;
    }
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    // if (38 in keysDown) { // Player is holding up key
    //   monY -= 5;
    // }
    // if (40 in keysDown) { // Player is holding down key
    //   monY += 5;
    // }
    // if (37 in keysDown) { // Player is holding left key
    //   monX -= 5;
    // }
    // if (39 in keysDown) { // Player is holding right key
    //   monX += 5;
    // }
    if (38 in keysDown) { // Player is holding up key
      //monY -= 5;
      monImage.src = "images/dr-st.png";

    }
    if (40 in keysDown) { // Player is holding down key
      //monY += 5;
      monImage.src = "images/dr-1.png";
    }
    if (37 in keysDown) { // Player is holding left key
      monX -= 5;
      monImage.src = "images/dr-l.png";
    }
    if (39 in keysDown) { // Player is holding right key
      monX += 5;
      monImage.src = "images/dr-r.png";
    }


    if (monX > canvas.width - 32) {
      monX = 0;
    }

    if (monX < 0) {
      monX = canvas.width - 32;
    }
    //

    monY = canvas.height - 62;


    if (cakeX > canvas.width - 32) {
      cakeX = 0;
    }

    if (cakeX < 0) {
      cakeX = canvas.width - 32;
    }
    //

    if (cakeY < 0) {
      cakeY = canvas.height - 32;
    }

    if (cakeY > canvas.height - 32) {
      cakeY = 0;
    }


    // Create and Update cakes
      if(currentNumber < NUMBER_OBJECTS){
          let cakeImage = new Image();
          cakeImage.src = "images/bran.png"
          cakeImage.y = canvas.height/2;
          function random(){
            return Math.random()*canvas.width;
          }
          cakeImage.x = random();

          function getV(){
            return V1+(V2-V1)*Math.random();
          }

          cakeImage.v = getV();
          cakeImage.t0 = getTime();
          // cakeImage.onload = function(){
            ctx.drawImage(cakeImage, cakeImage.x, cakeImage.y);
          //}
          currentNumber++;
      }




    // Check if player and monster collided. Our images
    // are about 32 pixels big.
    if (
      monX <= (cakeX + 32)
      && cakeX <= (monX + 32)
      && monY <= (cakeY + 32)
      && cakeY <= (monY + 32)
    ) {
      // Pick a new location for the monster.
      // Note: Change this to place the monster at a new, random location.
      cakeX = Math.random() * canvas.width;
      cakeY = Math.random() * canvas.width;
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
      ctx.drawImage(monImage, monX, monY);
    }
    if (monsterReady) {
      ctx.drawImage(cakeImage, cakeX, cakeY);
    }
    if ((SECONDS_PER_ROUND - elapsedTime) == 0) {

      ctx.fillText(`Game Over`, 20, 130);
    }
    ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
    ctx.fillText(`Score: ${score}`, 20, 150);
    ctx.fillText(`User Name: ${userName}`, 20, 130);
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

// function reset() {
//   location.reload();
// }