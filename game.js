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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

console.log(screen.width)
console.log(screen.height)
let tt;

let bgReady, monReady, monsterReady;
let bgImage, monImage, cakeImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 60;
let elapsedTime = 0;
let score = 0;
let userName;
let requestId;
const NUMBER_OBJECTS = 50;
const NUMBER_MICE = 15;
const LIVES = 5;
const MON_HEIGHT = canvas.height/7;
const MON_WIDTH = 0.9*MON_HEIGHT;
const CAKE_SIZE = 60;
const MOUSE_SIZE = 60
const RATIO = 20;
const V1 = 100;
const V2 = 250;
let currentBran = [];
let currentMice = [];
let lives = LIVES;
let playing = false;
let gameOverParent = document.getElementById("GameOver");
let audio = document.getElementsByTagName("audio")[0];
let history = [];
const HISTORY_MAX =3;

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

function createElement(tagName, className){
    let element = document.createElement(tagName);
    element.className = className.join(" ");
    return element;
}

function appendNewElementToBody(tagName, className){
    let element = createElement(tagName, className);
    document.body.appendChild(element);
    return element;
}

function compareObj(a, b) {
  return a.score - b.score;
}
function compareObjR(a, b) {
  return b.score - a.score;
}



function addUserHistory (){
  let obj ={
    name: userName,
    score: score
  }

  if(history.length < HISTORY_MAX){
    history.push(obj);
  }else if(history.length === HISTORY_MAX){
     history.sort(compareObj);
     let smallest = history[0];
    if(smallest.score < score){
        history[0] = obj;
    }
  }
};

function appendGameOver(){
  //let coverDiv = appendNewElementToBody("div", ["dflex", "column", "align_center"])
  let gameOverElem = document.createElement("h1");
  gameOverElem.innerHTML = "GAME OVER";
  gameOverElem.className = "style_gameOver"
  gameOverParent.appendChild(gameOverElem);
  // gameOverElem.style.zIndex = 1000;
}



function loadBgImage() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgImage.loaded = true;
  };
  bgImage.src = "images/br-p.jpg";
}

function renderBg(){
    if (bgImage.loaded) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
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
    monReady = true;
  };
  monImage.src = "images/dr-n-st.png";

  cakeImage = new Image();
  cakeImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  cakeImage.src = "images/bran.png";

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

let update = function () {
  if(tt){
    let temp = Date.now()
    if ((temp - tt) < 10) return;
    tt = temp;

  }
  else {
    tt = Date.now();
  }
  // Update the time.


  if ((SECONDS_PER_ROUND - elapsedTime) <= 0) {
    gameOver = false;
    return;
  }
  if (lives <= 0){
    return;
  }
  if(!playing){
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
    monImage.src = "images/dr-n2-l.png";

  }
  if (40 in keysDown) { // Player is holding down key
    //monY += 5;
    monImage.src = "images/dr-n1.png";
  }
  if (37 in keysDown) { // Player is holding left key
    monX -= 5;
    monImage.src = "images/dr-n-st.png";
  }
  if (39 in keysDown) { // Player is holding right key
    monX += 5;
    monImage.src = "images/title1.png";
  }


  if (monX > canvas.width - MON_WIDTH/2) {
    monX = 0;
  }

  if (monX < 0) {
    monX = canvas.width - MON_WIDTH/2;
  }
  //

  monY = canvas.height - MON_HEIGHT;



  function cakeRandomX(){
    return CAKE_SIZE/2 + Math.random()*(canvas.width-CAKE_SIZE);
  }

  function mouseRandomX(){
    return CAKE_SIZE/2 + Math.random()*(canvas.width-CAKE_SIZE);
  }

  function getV(){
    return V1+(V2-V1)*Math.random();
  }


  // Create and Update cakes
    if(currentBran.length < NUMBER_OBJECTS){
        let cakeImg = new Image();
        cakeImg.src = "images/bran.png"
        cakeImg.toadoY = -CAKE_SIZE/2;
        cakeImg.toadoX = cakeRandomX();
        cakeImg.veloc = getV();
        cakeImg.t1 = getTime();
        cakeImg.onload = function(){
          cakeImg.loaded = true;
        }
        currentBran.push(cakeImg)
    }
    currentBran.forEach((bran)=> {
      if (!((monX -bran.toadoX) > CAKE_SIZE || (bran.toadoX - monX) > MON_WIDTH)
       && !((monY - bran.toadoY) > CAKE_SIZE)
      ){
        score++;
        currentBran.splice(currentBran.indexOf(bran), 1);
      } 
      else if (bran.toadoY > canvas.height){
        currentBran.splice(currentBran.indexOf(bran), 1);
      }
      else{
        let t2 = getTime()
        bran.toadoY = -CAKE_SIZE/2 + bran.veloc * (t2 - bran.t1)
      }
    })

    
  // Create and Update Mice
  if(currentMice.length < NUMBER_MICE){
    let mouseImg = new Image();
    mouseImg.src = "images/mouse.png"
    mouseImg.toadoY = -MOUSE_SIZE/2;
    mouseImg.toadoX = mouseRandomX();

    mouseImg.veloc = getV();
    mouseImg.t1 = getTime();
    mouseImg.onload = function(){
      mouseImg.loaded = true;
    }
    currentMice.push(mouseImg)
}
currentMice.forEach((mouse)=> {
  if (!((monX - mouse.toadoX) > MOUSE_SIZE || (mouse.toadoX - monX) > MON_WIDTH)
   && !((monY - mouse.toadoY) > MOUSE_SIZE)
  ){
    lives--;
    if (lives === 0){
        appendGameOver();
        document.getElementById("resetBtn").disabled = false;
        addUserHistory();
        
    }
    currentMice.splice(currentMice.indexOf(mouse), 1);
  }
   else if (mouse.toadoY > canvas.height){
    currentMice.splice(currentMice.indexOf(mouse), 1);
  }
  else{
    let t2 = getTime()
    mouse.toadoY = -MOUSE_SIZE/2 + mouse.veloc * (t2 - mouse.t1)
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
    if (monReady) {
      ctx.drawImage(monImage, monX, monY, MON_WIDTH, MON_HEIGHT);
    }

    currentBran.forEach((bran) => {
      if(bran.loaded){
        ctx.drawImage(bran, bran.toadoX, bran.toadoY, CAKE_SIZE, CAKE_SIZE);
      }
    })

    currentMice.forEach((mouse) => {
      if(mouse.loaded){
        ctx.drawImage(mouse, mouse.toadoX, mouse.toadoY, MOUSE_SIZE, MOUSE_SIZE);
      }
    })
    if ((SECONDS_PER_ROUND - elapsedTime) < 0) {

      return;
    }

    if ((SECONDS_PER_ROUND - elapsedTime) === 0) {

      appendGameOver();
      addUserHistory();
      document.getElementById("resetBtn").disabled = false;
      
      elapsedTime++;
    }
    ctx.fillText(`You have ${lives} lives left`, 20, 175);
    ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 150);
    ctx.fillText(`Score: ${score}`, 20, 125);
    ctx.fillText(`User Name: ${userName}`, 20, 100);
    history.sort(compareObjR);
    ctx.fillText(`History:`, 20, 200);
    history[0] && ctx.fillText(`${history[0].name}: ${history[0].score}`, 30, 225);
    history[1] && ctx.fillText(`${history[1].name}: ${history[1].score}`, 30, 250);
    history[2] && ctx.fillText(`${history[2].name}: ${history[2].score}`, 30, 275);
  };

let gameOver = true;
var main = function () {
    update();
    render();
    // Request to do this again ASAP. This is a special method
    // for web browsers.
    if(!requestId) 
       requestId = requestAnimationFrame(main);
    else requestAnimationFrame(main);
  };

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

function getReady() {
  playing = true;
  audio.play();
  userName = document.getElementById("userName").value;
  document.getElementById("userName").remove();
  document.getElementById("getReadyBtn").disabled = true;






  /**
   *  Update game objects - change player position based on key pressed
   *  and check to see if the monster has been caught!
   *  
   *  If you change the value of 5, the player will move at a different rate.
   */

  


  /**
   * The main game loop. Most every game will have two distinct parts:
   * update (updates the state of the game, in this case our hero and monster)
   * render (based on the state of our game, draw the right things)
   */


  // Cross-browser support for requestAnimationFrame.
  // Safely ignore this line. It's mostly here for people with old web browsers.

}

function reset() {
  //location.reload();
  startTime = Date.now();
  elapsedTime = 0;
  score = 0;
  currentBran = [];
  currentMice = [];
  lives = LIVES;
  playing = false;
  audio.pause();
  if(requestId){
    window.cancelAnimationFrame(requestId);
    requestId = undefined;
  }
  document.getElementById("getReadyBtn").disabled = true;

  gameOverParent.innerHTML = "";
  let input = document.createElement("input");
  input.id = "userName";
  input.placeholder = "Enter username to begin";
  input.type = "text"
  input.style.zIndex = 10;
  input.oninput = function(){inputHandle();};
  var old = document.getElementById("userName");
  if(old) old.remove();
  document.body.prepend(input);
  document.getElementById("resetBtn").disabled = true;
}

// loadBgImage();
// setTimeout(function(){renderBg();}, 100);

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// Let's play this game!
loadImages();
setupKeyboardListeners();
main();