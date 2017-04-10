var a = require('./alias');
var LinkedList = require('./node_modules/linkedlist/lib/linkedlist')

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

// defaults
var defaultVelCap = 4;
var velCap = 4;

function Fruits(gameScene){
    this.list = new LinkedList();
    this.gameScene = gameScene;
}

Fruits.prototype.add = function(){
    this.list.push(new Sprite(TextureCache[pearPath]));
    var newFruit = this.list.tail;
    newFruit.x = random(newFruit.width * 2, window.innerWidth -  newFruit.width * 2);
    newFruit.vy = random(2, velCap);
    if (velCap < 6) velCap += 0.005;
    this.gameScene.addChild(newFruit);
}

Fruits.prototype.updateFruits = function(player){
    this.list.resetCursor();
    while(this.list.next()){
        var fruit = this.list.current;
        fruit.y += fruit.vy;
        if (fruit.y >= window.innerHeight){
            while(this.list.length){
                var fruit = this.list.shift();
                this.gameScene.removeChild(fruit);
            }
            velCap = defaultVelCap;
            return true;
        }
        else if (player.hit(fruit)){
            fruit.visible = false;
            this.list.removeCurrent();
        }
    }
    return false;
}

function random(min, max){
    return Math.random() * (max - min) + min;
}

module.exports = Fruits;