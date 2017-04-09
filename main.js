//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache;
var duckRightPath = 'images/duck_right.png';
var duckLeftPath = 'images/duck_left.png';
var skyPath = 'images/sky.png';
var state;

var Player = require('./player');
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
renderer.backgroundColor = 0x3fbfff;

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new Container();

// loading sprites
var duckLeft, duckRight, sky;
var duck = new Container();
var dummy;
loader
  .add([
      duckRightPath,
      duckLeftPath,
      skyPath
      ])
  .load(function setup() {
        sky = new Sprite(TextureCache[skyPath]);
        stage.addChild(sky);

        duckRight = new Sprite(TextureCache[duckRightPath]);
        duckLeft = new Sprite(TextureCache[duckLeftPath]);
        duck.addChild(duckRight);
        duck.addChild(duckLeft);

        player = new Player(duck, mousePosition);
        duck.position.set(100,100);
        //duck.pivot.set(duck.width/2, duck.height/2); // setting the pivot messes up hit detection
        stage.addChild(duck);

        dummy = new Sprite(TextureCache[duckLeftPath]);
        dummy.position.set(500,500);
        stage.addChild(dummy);

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

function play(){
    console.log(duck.position);
    player.updatePosition();
    if (player.hit(dummy)){
        dummy.tint = 0xff3300;
    }else{
        dummy.tint = 0xccff99;
    }
}

window.addEventListener("resize", function(event){
    sky.x = (window.innerWidth - sky.width) / 2;
    sky.y = (window.innerHeight - sky.height) / 2;
    renderer.view.width = window.innerWidth;
    renderer.view.height = window.innerHeight;
});


