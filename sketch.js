var runner, runnerRunning, runnerCollided
var backgroundImage
var hurdle, hurdleImage, hurdlesGroup
var score = 0
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound;
var collidedSound
var invisibleGround
var gameOver, restart, gameOverImg, restartImg

function preload() {
  runnerRunning = loadAnimation("runningman.png");
  runnerCollided = loadAnimation("collided.png");

  hurdleImage = loadImage("hurdle.png")
  backgroundImage = loadImage("background.png")
  jumpSound = loadSound("jump.mp3")
  collidedSound = loadSound("die.mp3")

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

}

function setup() {
  createCanvas(1200,750)
  runner = createSprite(200,550,200,700)
  runner.scale = 0.7
  runner.setCollider("rectangle",0,0,170,430);
  runner.debug = false
  runner.addAnimation("running", runnerRunning);
  runner.addAnimation("collided", runnerCollided);

  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.visible = false

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

  hurdlesGroup = new Group();

  score = 0

  gameOver.visible = false;
  restart.visible = false;

}

function draw() {
  background(backgroundImage)
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);    
    if((touches.length > 0 || keyDown("SPACE")) && runner.y  >= height-225) {
      jumpSound.play( )
      runner.velocityY = -25;
       touches = [];
    }
    
    runner.velocityY = runner.velocityY + 0.8

  
    runner.collide(invisibleGround);

    if(hurdlesGroup.isTouching(runner)){
       collidedSound.play()
       gameState = END;
   }
    
  
  
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    runner.velocityY = 0;
    hurdlesGroup.setVelocityXEach(0);

    runner.changeAnimation("collided",runnerCollided);
    
    //set lifetime of the game objects so that they are never destroyed
    hurdlesGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  

  spawnHurdles()




  drawSprites()
}



function spawnHurdles() {
  if(frameCount % 99 === 0) {
    var hurdle  = createSprite(1300,520,300,900);
    hurdle.setCollider("rectangle",17,85,70,215);
    hurdle.debug = false
  
    hurdle.velocityX = -(7.5 + 3*score/100);

    hurdle.addImage(hurdleImage)
    
    
    hurdle.lifetime = 600;
    hurdle.depth = runner.depth;
    runner.depth +=1;

    hurdlesGroup.add(hurdle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  hurdlesGroup.destroyEach();
    
  score = 0;

  runner.changeAnimation("running",runnerRunning);
  
}
