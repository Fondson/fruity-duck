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
        var fruit = this.arr[i];
        fruit.y += 1;
        if (fruit.y === window.innerHeight){
            console.log("fruit out of bounds");
            this.arr.splice(i, 1);
            --i;
        }
        else if (player.hit(fruit)){
            fruit.visible = false;
            this.arr.splice(i, 1);
            --i;
        }
    }
}

function random(min, max){
    return Math.random() * (max - min) + min;
}

module.exports = Fruits;