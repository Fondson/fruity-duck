var a = require('./alias');

//Aliases
var Container = a.Container,
    autoDetectRenderer = a.autoDetectRenderer,
    loader = a.loader,
    resources = a.resources,
    Sprite = a.Sprite,
    Text = a.Text,
    TextureCache = a.TextureCache;
var duckRightPath = a.duckRightPath;
var duckLeftPath = a.duckLeftPath;
var skyPath = a.skyPath;
var pearPath = a.pearPath;

var resources = [
      duckRightPath,
      duckLeftPath,
      skyPath,
      pearPath
      ];
var state;

var isMobile = require('./detectMobile');
var Player = require('./player');
var Fruits = require('./fruits');
var player;
var type = "WebGL";

var duckLeft, duckRight, sky;
var duck = new Container();
var gameScene = new Container();
var gameOverScene = new Container();
var fruits = new Fruits(gameScene);

var mobileMousePos = { x: -1, y: -1 };
var touchCenter;

if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
}

PIXI.utils.sayHello(type);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

if (isMobile){
    document.addEventListener("touchstart", onTouchStart, true);
    //document.addEventListener("touchend", onTouchEnd, true);  
    document.addEventListener("touchmove", onTouchMove, true);

    function onTouchStart(event){  
        if (state === play){
            mobileMousePos.x = event.touches[0].clientX;  
            mobileMousePos.y = event.touches[0].clientY;
            touchCenter = {x: mobileMousePos.x, y: mobileMousePos.y};
            player.centerPos = {x: player.sprite.x, y: player.sprite.y};
        }
        else if (state === end){
            reset();
        }
    }
    function onTouchMove(event){  
        mobileMousePos.x = event.touches[0].clientX;  
        mobileMousePos.y = event.touches[0].clientY;
        player.updatePositionMobile(touchCenter, {x: mobileMousePos.x, y: mobileMousePos.y});
        //console.log(event.touches[0].clientX);
    }
    // function onTouchEnd(event){  
    //     mobileMousePos.x = event.touches[0].clientX;  
    //     mobileMousePos.y = event.touches[0].clientY;
    // }
}else{
    document.addEventListener("click", onClick, true);
    function onClick(event){  
        if (state === end){
            reset();
        }
    }
}

//Create the renderer
var renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, {
    antialias:false, transparent:false, resolution:1
});

var mousePosition = renderer.plugins.interaction.mouse.global;
renderer.autoResize = true;
renderer.backgroundColor = 0x3FBFFF;

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new Container();

// loading sprites
loader
  .add(resources)
  .load(function setup() {
            // set up gameScene
            sky = new PIXI.TilingSprite(TextureCache[skyPath], window.innerWidth, window.innerHeight);
            gameScene.addChild(sky);

            duckRight = new Sprite(TextureCache[duckRightPath]);
            duckLeft = new Sprite(TextureCache[duckLeftPath]);
            duck.addChild(duckRight);
            duck.addChild(duckLeft);
            if (isMobile) {
              duck.position.set((window.innerWidth - duck.width) / 2, 
                window.innerHeight - duck.height - 20);
            }
            else duck.position.set(mousePosition.x, mousePosition.y);
            duck.interactive = true;
            duck.on('pointermove', function(){
                duck.x
            });
            //duck.pivot.set(duck.width/2, duck.height/2); // setting the pivot messes up hit detection

            player = isMobile? new Player(duck, mobileMousePos): new Player(duck, mousePosition);
            gameScene.addChild(duck);

            stage.addChild(gameScene);

            // set up gameOverScene
            gameOverScene.visible = false;
            var loseMessage = new Text(
                "You lost!",
                {font: "64px Futura", fill: "black"}
            );
            loseMessage.x = (window.innerWidth - loseMessage.width) / 2;
            loseMessage.y = window.innerHeight / 3;            
            gameOverScene.addChild(loseMessage);

            var restartMessage = new Text(
                "Click to restart",
                {font: "50px Futura", fill: "black"}
            );
            restartMessage.x = (window.innerWidth - restartMessage.width) / 2;
            restartMessage.y = window.innerHeight / 3 + loseMessage.height + 30;            
            gameOverScene.addChild(restartMessage);

            stage.addChild(gameOverScene);

            //Tell the `renderer` to `render` the `stage`
            renderer.render(stage);

            renderer.view.width = window.innerWidth;
            renderer.view.height = window.innerHeight;
            
            state = play;

            gameLoop();
});

function gameLoop(){
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
};

var fruitCounter = 0;
var defatulFruitDropDelay = 60;
var fruitDropDelay = defatulFruitDropDelay;
function play(){
    if (!isMobile) player.updatePosition();
    if (fruits.updateFruits(player)){
        state = end;
    }
    fruitCounter +=1;
    if (fruitCounter >= fruitDropDelay){
        if (fruitDropDelay > 15) {
            fruitDropDelay -= 1;
        }
        fruitCounter = 0;
        fruits.add();
    }
}

function end(){
    gameScene.visible = false;
    gameOverScene.visible = true;

    player.clear();
}

function reset(){
    fruitDropDelay = defatulFruitDropDelay;
    state = play;
    gameOverScene.visible = false;
    gameScene.visible = true;
}

window.addEventListener("resize", function(event){
    renderer.view.style.width = window.innerWidth + 'px';
    renderer.view.style.height = window.innerHeight + 'px';
});


