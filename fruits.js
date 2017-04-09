//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache;
var pearPath = 'images/pear.png';

function Fruits(arr){
    this.arr = arr;
}

Fruits.prototype.add = function(stage){
    this.arr.push(new Sprite(TextureCache[pearPath]));
    var newFruit = this.arr[this.arr.length -1];
    newFruit.x = random(0, window.innerWidth -  20);
    stage.addChild(newFruit);
}

Fruits.prototype.updateFruits = function(player){
    for (var i = 0; i < this.arr.length; ++i){
        this.arr[i].y += 1;
        if (player.hit(this.arr[i])){
            this.arr[i].visible = false;
            this.arr.splice(i, 1);
            --i;
        }
    }
}

function random(min, max){
    return Math.random() * (max - min) + min;
}

module.exports = Fruits;