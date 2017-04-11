var a = require('./alias');
var LinkedList = require('./node_modules/linkedlist/lib/linkedlist')
var Fruits = require('./fruits');
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
var skyPath = a.skyPath;
var pearPath = a.pearPath;

var Poison = {
    appearanceRate: 90, // out of 100
    instance: null,
    create: function(gameScene){
        var instance = Fruits.create(gameScene);
        this.instance = instance;
        this.instance.reachedEnd = this.reachedEnd;
        this.instance.hitPlayer = this.hitPlayer;
        return this;
    },
    add: function(path){
        var rand = random(0,100);
        if (rand <= this.appearanceRate){
            this.instance.add(path);
        }
    },
    update: function(player){
        return this.instance.update(player);
    },
    reachedEnd: function(fruit, funcArgs){
        fruit.visible = false;
        this.list.removeCurrent();
        funcArgs.returnVal = false;
    },
    hitPlayer: function(fruits, funcArgs){
        funcArgs.done = true;
        funcArgs.returnVal = true;
    },
    clear: function(){
        this.instance.clear();
    }
}

module.exports = Poison;