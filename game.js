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
canvas.className = "canvasGame maxSize";
//canvas.position = "absolute"
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
// canvas.width = 1024;
// canvas.height = 1024;

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
const NUMBER_MICE = 3;
const LIVES = 3;
let SIZE = 60;
const MON_HEIGHT = 60;
const MON_WIDTH = 55;
const RATIO = 20;
const V1 = 70;
const V2 = 150;
let currentBran = [];
let currentMice = [];
let lives = LIVES;

function getTime() {
  var d = new Date();
  var n = d.getTime();
  return n/1000;

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


    if (monX > canvas.width - MON_WIDTH/2) {
      monX = 0;
    }

    if (monX < 0) {
      monX = canvas.width - MON_WIDTH/2;
    }
    //

    monY = canvas.height - MON_HEIGHT;



    function randomX(){
      return SIZE/2 + Math.random()*(canvas.width-SIZE);
    }

    function getV(){
      return V1+(V2-V1)*Math.random();
    }


    // Create and Update cakes
      if(currentBran.length < NUMBER_OBJECTS){
          let cakeImg = new Image();
          cakeImg.src = "images/bran.png"
          cakeImg.toadoY = -SIZE/2;
          cakeImg.toadoX = randomX();
          cakeImg.veloc = getV();
          cakeImg.t1 = getTime();
          cakeImg.onload = function(){
            cakeImg.loaded = true;
          }
          currentBran.push(cakeImg)
      }
      currentBran.forEach((bran)=> {
        if (!((monX -bran.toadoX) > SIZE || (bran.toadoX - monX) > SIZE)
         && !((monY - bran.toadoY) > SIZE)
        ){
          score++;
          currentBran.splice(currentBran.indexOf(bran), 1);
        } 
        else if (bran.toadoY > canvas.height){
          currentBran.splice(currentBran.indexOf(bran), 1);
        }
        else{
          let t2 = getTime()
          bran.toadoY = -SIZE/2 + bran.veloc * (t2 - bran.t1)
        }
      })

      
    // Create and Update Mice
    if(currentMice.length < NUMBER_MICE){
      let mouseImg = new Image();
      mouseImg.src = "images/mouse.png"
      mouseImg.toadoY = -SIZE/2;
      mouseImg.toadoX = randomX();

      mouseImg.veloc = getV();
      mouseImg.t1 = getTime();
      mouseImg.onload = function(){
        mouseImg.loaded = true;
      }
      currentMice.push(mouseImg)
  }
  currentMice.forEach((mouse)=> {
    if (!((monX - mouse.toadoX) > SIZE || (mouse.toadoX - monX) > SIZE)
     && !((monY - mouse.toadoY) > SIZE)
    ){
      lives--;
      currentMice.splice(currentMice.indexOf(mouse), 1);
    }
     else if (mouse.toadoY > canvas.height){
      currentMice.splice(currentMice.indexOf(mouse), 1);
    }
    else{
      let t2 = getTime()
      mouse.toadoY = -SIZE/2 + mouse.veloc * (t2 - mouse.t1)
    }
  })




    // Check if player and monster collided. Our images
    // are about 32 pixels big.
    // if (
    //   monX <= (cakeX + 32)
    //   && cakeX <= (monX + 32)
    //   && monY <= (cakeY + 32)
    //   && cakeY <= (monY + 32)
    // ) {
    //   // Pick a new location for the monster.
    //   // Note: Change this to place the monster at a new, random location.
    //   cakeX = Math.random() * canvas.width;
    //   cakeY = Math.random() * canvas.width;
    //   score++;
    // }

  };




  /**
   * This function, render, runs as often as possible.
   */
  var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
    if (heroReady) {
      ctx.drawImage(monImage, monX, monY, MON_WIDTH, MON_HEIGHT);
    }

    currentBran.forEach((bran) => {
      if(bran.loaded){
        ctx.drawImage(bran, bran.toadoX, bran.toadoY);
      }
    })

    currentMice.forEach((mouse) => {
      if(mouse.loaded){
        ctx.drawImage(mouse, mouse.toadoX, mouse.toadoY);
      }
    })
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