const a = require('./alias');
const LinkedList = require('./node_modules/linkedlist/lib/linkedlist');
const random = require('./random');
const ScaleSprite = require('./scaleSprite');

//Aliases
const Container = a.Container,
    autoDetectRenderer = a.autoDetectRenderer,
    loader = a.loader,
    resources = a.resources,
    Sprite = a.Sprite,
    TextureCache = a.TextureCache;
const duckRightPath = a.duckRightPath;
const duckLeftPath = a.duckLeftPath;

class Fruits{
    constructor(gameScene){
        this.gameScene = gameScene;
        this.velCap = this.defaultVelCap;
        this.list = new LinkedList();
    }
    add(path){
        const newFruit = new Sprite(TextureCache[path])
        ScaleSprite.fromHeightRatio(newFruit, this.fruitToScreenHeightRatio);
        newFruit.x = random(newFruit.width * 2, window.innerWidth -  newFruit.width * 2);
        newFruit.vy = random(1, this.velCap);
        this.list.push(newFruit);
        if (this.velCap < 6) this.velCap += 0.005;
        this.gameScene.addChild(newFruit);
    }
    update(player){
        this.list.resetCursor();
        const funcArgs = {done: false, returnVal: false};
        while(this.list.next() && !funcArgs.done){
            const fruit = this.list.current;
            fruit.y += fruit.vy;
            if (fruit.y >= window.innerHeight){
                this.reachedEnd(fruit, funcArgs, player);
            }
            else if (player.hit(fruit)){
                this.hitPlayer(fruit, funcArgs, player);
            }
        }
        return funcArgs.returnVal;
    }
    reachedEnd(fruit, funcArgs, player){
        funcArgs.done = true;
        funcArgs.returnVal = true;
    }
    hitPlayer(fruit, funcArgs, player){
        fruit.visible = false;
        this.list.removeCurrent();
        funcArgs.returnVal = false;
        player.score += 1;
    }
    clear(){
        while(this.list.length){
            const curFruit = this.list.shift();
            this.gameScene.removeChild(curFruit);
        }
        this.velCap = this.defaultVelCap;
    }
    get defaultVelCap(){
        return 3;
    }
    get fruitToScreenHeightRatio(){
        return 18;
    }
}

module.exports = Fruits;