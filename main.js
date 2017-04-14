const a = require('./alias');

//Aliases
const Container = a.Container,
    autoDetectRenderer = a.autoDetectRenderer,
    loader = a.loader,
    resources = a.resources,
    Sprite = a.Sprite,
    Text = a.Text,
    TextureCache = a.TextureCache;
const duckRightPath = a.duckRightPath;
const duckLeftPath = a.duckLeftPath;
const skyPath = a.skyPath;
const pearPath = a.pearPath;
const poisonApplePath = a.poisonApplePath;

const imageResources = [
      duckRightPath,
      duckLeftPath,
      skyPath,
      pearPath,
      poisonApplePath
      ];
let state;

const isMobile = require('./detectMobile');
const Player = require('./player');
const Fruits = require('./fruits');
const Poison = require('./poison');
let type = "WebGL";
const fontName = 'Press Start 2P';

// window.onload = function()
// {
// 	WebFont.load(
// 	{
// 		// this event is triggered when the fonts have been rendered
// 		active : function()
// 		{
// 			start();
// 		},

//         // when font is loaded do some magic, so font can be correctly rendered immediately after PIXI is initialized
// 		fontloading : doMagic,

// 		// multiple fonts can be passed here
// 		google :
// 		{
// 			families: [ fontName ]
// 		}
// 	});
// };

// function doMagic(){
// 	// create <p> tag with our font and render some text secretly
// 	var el = document.createElement('p');
// 	el.style.fontFamily = fontName;
// 	el.style.fontSize = "0px";
// 	el.style.visibility = "hidden";
// 	el.innerHTML = '.';
	
// 	document.body.appendChild(el);
// };

start();
function start(){
    let duckLeft, duckRight, sky;
    let player;
    const duck = new Container();
    const gameScene = new Container();
    const gameOverScene = new Container();
    const fruits = new Fruits(gameScene);
    const poison = new Poison(gameScene);

    const mobileMousePos = { x: -1, y: -1 };
    const touchCenter = { x: -1, y: -1};

    if(!PIXI.utils.isWebGLSupported()){
        type = "canvas";
    }

    PIXI.utils.sayHello(type);

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // set up document listeners
    if (isMobile){
        document.addEventListener("touchstart", onTouchStart, true);
        document.addEventListener("touchmove", onTouchMove, true);

        function onTouchStart(event){  
            if (state === play){
                mobileMousePos.x = event.touches[0].clientX;  
                mobileMousePos.y = event.touches[0].clientY;
                touchCenter.x = mobileMousePos.x;
                touchCenter.y = mobileMousePos.y;
                player.centerPos = {x: player.sprite.x, y: player.sprite.y};
            }
            else if (state === end){
                reset();
            }
        }
        function onTouchMove(event){
            if (state === play){
                mobileMousePos.x = event.touches[0].clientX;  
                mobileMousePos.y = event.touches[0].clientY;
                player.updatePositionMobile(touchCenter, {x: mobileMousePos.x, y: mobileMousePos.y});
            }
        }
    }else{
        document.addEventListener("click", onClick, true);
        function onClick(event){  
            if (state === end){
                reset();
            }
        }
    }

    //Create the renderer
    const renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, {
        antialias:false, transparent:false, resolution: 1
    });

    const mousePosition = renderer.plugins.interaction.mouse.global;
    renderer.autoResize = true;
    renderer.backgroundColor = 0x000000;

    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);

    //Create a container object called the `stage`
    const stage = new Container();

    // loading sprites
    loader
    .add(imageResources)
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

                player = isMobile? new Player(duck, mobileMousePos): new Player(duck, mousePosition);
                gameScene.addChild(duck);

                stage.addChild(gameScene);

                // set up gameOverScene
                gameOverScene.visible = false;
                const loseMessage = new Text(
                    "You lost!",
                    {font: "40px Press Start 2P", fill: "white"}
                );
                loseMessage.x = (window.innerWidth - loseMessage.width) / 2;
                loseMessage.y = window.innerHeight / 3;            
                gameOverScene.addChild(loseMessage);

                const restartMessage = new Text(
                    "Click to restart",
                    {font: "25px Press Start 2P", fill: "white"}
                );
                restartMessage.x = (window.innerWidth - restartMessage.width) / 2;
                restartMessage.y = window.innerHeight / 3 + loseMessage.height + 30;            
                gameOverScene.addChild(restartMessage);

                stage.addChild(gameOverScene);

                //Tell the `renderer` to `render` the `stage`
                renderer.render(stage);

                // start the game
                state = play;

                gameLoop();
    });

    // main game loop
    function gameLoop(){
        requestAnimationFrame(gameLoop);

        state();

        renderer.render(stage);
    };


    const fruitDropDelay = {
        default: 60,
        counter: 0,
        delay: 0,
        minDelay: 20
    };
    fruitDropDelay.delay = fruitDropDelay.default;
    function play(){
        if (!isMobile) player.updatePosition();
        if (fruits.update(player) || poison.update(player)){
            state = end;
        }
        fruitDropDelay.counter +=1;
        if (fruitDropDelay.counter >= fruitDropDelay.delay){
            if (fruitDropDelay.delay > fruitDropDelay.minDelay) {
                fruitDropDelay.delay -= 1;
            }
            fruitDropDelay.counter = 0;
            fruits.add(pearPath);
            poison.add(poisonApplePath);
        }
    }

    function end(){
        gameScene.visible = false;
        gameOverScene.visible = true;

        player.clear();
        fruits.clear();
        poison.clear();
    }

    function reset(){
        fruitDropDelay.delay = fruitDropDelay.default;
        state = play;
        gameOverScene.visible = false;
        gameScene.visible = true;
    }

};



