var a = require('./alias');

//Aliases
var Container = a.Container,
    autoDetectRenderer = a.autoDetectRenderer,
    loader = a.loader,
    resources = a.resources,
    Sprite = a.Sprite,
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

var Player = require('./player');
var Fruits = require('./fruits');
var player;
var type = "WebGL";

if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
}

PIXI.utils.sayHello(type);


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
var duckLeft, duckRight, sky;
var fruitsArr = [];
var fruits = new Fruits(fruitsArr);
var duck = new Container();
loader
  .add(resources)
  .load(function setup() {
            sky = new PIXI.TilingSprite(TextureCache[skyPath], window.innerWidth, window.innerHeight);
            stage.addChild(sky);

            duckRight = new Sprite(TextureCache[duckRightPath]);
            duckLeft = new Sprite(TextureCache[duckLeftPath]);
            duck.addChild(duckRight);
            duck.addChild(duckLeft);

            player = new Player(duck, mousePosition);
            duck.position.set(100,100);
            //duck.pivot.set(duck.width/2, duck.height/2); // setting the pivot messes up hit detection
            stage.addChild(duck);

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
function play(){
    player.updatePosition();
    fruits.updateFruits(player);
    fruitCounter +=1;
    if (fruitCounter >= 60){
        fruitCounter = 0;
        fruits.add(stage);
    }
}

window.addEventListener("resize", function(event){
    renderer.view.style.width = window.innerWidth + 'px';
    renderer.view.style.height = window.innerHeight + 'px';
});


