var a = require('./alias');
var LinkedList = require('./node_modules/linkedlist/lib/linkedlist');
var random = require('./random');

//Aliases
var Container = a.Container,
    autoDetectRenderer = a.autoDetectRenderer,
    loader = a.loader,
    resources = a.resources,
    Sprite = a.Sprite,
    TextureCache = a.TextureCache;
var duckRightPath = a.duckRightPath;
var duckLeftPath = a.duckLeftPath;

class Fruits{
    constructor(gameScene){
        this.gameScene = gameScene;
        this.velCap = 4;
        this.list = new LinkedList();
    }
    add(path){
        this.list.push(new Sprite(TextureCache[path]));
        var newFruit = this.list.tail;
        newFruit.x = random(newFruit.width * 2, window.innerWidth -  newFruit.width * 2);
        newFruit.vy = random(1, this.velCap);
        if (this.velCap < 6) this.velCap += 0.005;
        this.gameScene.addChild(newFruit);
    }
    update(player){
        this.list.resetCursor();
        var funcArgs = {done: false, returnVal: false};
        while(this.list.next() && !funcArgs.done){
            var fruit = this.list.current;
            fruit.y += fruit.vy;
            if (fruit.y >= window.innerHeight){
                this.reachedEnd(fruit, funcArgs);
            }
            else if (player.hit(fruit)){
                this.hitPlayer(fruit, funcArgs);
            }
        }
        return funcArgs.returnVal;
    }
    reachedEnd(fruit, funcArgs){
        funcArgs.done = true;
        funcArgs.returnVal = true;
    }
    hitPlayer(fruit, funcArgs){
        fruit.visible = false;
        this.list.removeCurrent();
        funcArgs.returnVal = false;
    }
    clear(){
        while(this.list.length){
            var curFruit = this.list.shift();
            this.gameScene.removeChild(curFruit);
        }
        this.velCap = this.defaultVelCap;
    }
    get defaultVelCap(){
        return 4;
    }
}

module.exports = Fruits;