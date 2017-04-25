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
const cherryPath = a.cherryPath;
const bananaPath = a.bananaPath;
const pineapplePath = a.pineapplePath;
const strawberryPath = a.strawberryPath;
const poisonApplePath = a.poisonApplePath;


const fruitResources = [
      pearPath,
      cherryPath,
      bananaPath,
      pineapplePath,
      strawberryPath
];
const imageResources = [
      duckRightPath,
      duckLeftPath,
      skyPath,
      poisonApplePath
].concat(fruitResources);
let state;

const isMobile = require('./detectMobile');
const Player = require('./player');
const Fruits = require('./fruits');
const Poison = require('./poison');
const ScaleSprite = require('./scaleSprite');
const random = require('./random');
let type = "WebGL";
const fontName = 'Press Start 2P';
const duckToScreenHeightRatio = 9;

window.onload = function()
{
	WebFont.load(
	{
		// this event is triggered when the fonts have been rendered
		active : function()
		{
			start();
		},

        // when font is loaded do some magic, so font can be correctly rendered immediately after PIXI is initialized
		fontloading : doMagic,

		// multiple fonts can be passed here
		google :
		{
			families: [ fontName ]
		}
	});
};

function doMagic(){
	// create <p> tag with our font and render some text secretly
	var el = document.createElement('p');
	el.style.fontFamily = fontName;
	el.style.fontSize = "0px";
	el.style.visibility = "hidden";
	el.innerHTML = '.';
	
	document.body.appendChild(el);
};

function start(){
    let duckLeft, duckRight, sky;
    let player;
    const duck = new Container();
    const gameScene = new Container();
    const playableGameObjects = new Container();
    const gameOverScene = new Container();
    const fruits = new Fruits(gameScene);
    const poison = new Poison(gameScene);
    const stage = new Container();
    let scoreText;
    let endScoreText;
    let loseMessage;
    let restartMessage;

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

    // loading sprites
    loader
    .add(imageResources)
    .load(function setup() {
                // set up gameScene
                var skyTexture = TextureCache[skyPath];
                sky = new PIXI.TilingSprite(TextureCache[skyPath], window.innerWidth, window.innerHeight);
                const newSpriteHeight = window.innerHeight / 1.5;
                const scaleRatio = sky.tileScale.y / newSpriteHeight;
                sky.tileScale.y = 0.75;
                sky.tileScale.x = 0.75;
                playableGameObjects.addChild(sky);

                duckRight = new Sprite(TextureCache[duckRightPath]);
                duckLeft = new Sprite(TextureCache[duckLeftPath]);
                duck.addChild(duckRight);
                duck.addChild(duckLeft);
                ScaleSprite.fromHeightRatio(duck, duckToScreenHeightRatio);
                if (isMobile) {
                duck.position.set((window.innerWidth - duck.width) / 2, 
                    window.innerHeight - duck.height - 20);
                }
                else duck.position.set(mousePosition.x, mousePosition.y);

                player = isMobile? new Player(duck, mobileMousePos): new Player(duck, mousePosition);
                playableGameObjects.addChild(duck);

                scoreTextFont = window.innerHeight / 15;
                scoreText = new Text(
                    "0",
                    {font: scoreTextFont + "px Press Start 2P", fill: "black"}
                );
                scoreText.y = window.innerHeight - scoreText.height * 1.2;
                scoreText.x = 10;
                
                gameScene.addChild(playableGameObjects);
                gameScene.addChild(scoreText);

                stage.addChild(gameScene);

                // set up gameOverScene
                endScoreText = new Text(
                    '0',
                    {font: window.innerHeight / 5 + "px Press Start 2P", fill: "white"}
                );
                endScoreText.x = (window.innerWidth - endScoreText.width) / 2;
                endScoreText.y = window.innerHeight / 3;

                loseMessage = new Text(
                    "You lost!",
                    {font: "50px Press Start 2P", fill: "white"}
                );

                ScaleSprite.fromWidthRatio(loseMessage, 2.5);
                loseMessage.x = (window.innerWidth - loseMessage.width) / 2;
                gameOverScene.addChild(loseMessage);
                
                restartMessage = new Text(
                    "Click to restart",
                    {font: "50px Press Start 2P", fill: "white"}
                );
                ScaleSprite.fromWidthRatio(restartMessage, 2);
                restartMessage.x = (window.innerWidth - restartMessage.width) / 2;
                gameOverScene.addChild(restartMessage);
                gameOverScene.addChild(endScoreText);

                gameOverScene.visible = false;
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
            const path = fruitResources[parseInt(random(0, fruitResources.length - 1))];
            fruits.add(path);
            console.log(path);
            poison.add(poisonApplePath);
        }
        scoreText.setText(player.score);
    }

    function end(){
        // layout gameOverScene text
        endScoreText.x = (window.innerWidth - endScoreText.width) / 2;
        endScoreText.setText(player.score);
        if (endScoreText.width >= window.innerWidth){
            ScaleSprite.fromWidthRatio(endScoreText, 1.2);
        }else{
            endScoreText.scale.x = endScoreText.scale.y;
        }
        loseMessage.y = endScoreText.y + endScoreText.height + 20;
        restartMessage.y = loseMessage.y + loseMessage.height + 10;  

        gameScene.visible = false;
        gameOverScene.visible = true;

        fruits.clear();
        poison.clear();
    }

    function reset(){
        fruitDropDelay.delay = fruitDropDelay.default;
        state = play;
        gameOverScene.visible = false;
        gameScene.visible = true;
        player.clear();
    }

    window.addEventListener("resize", function(event){
        renderer.view.style.width = window.innerWidth + 'px';
        renderer.view.style.height = window.innerHeight + 'px';
    });
};



