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

var Poison = Object.create(Fruits);
Poison.appearanceRate = 30 // out of 100

Poison.create = function(gameScene){
    this.init(gameScene);
    // swap
    [this.reachedEnd, this.hitPlayer] = 
        [this.hitPlayer, this.reachedEnd];
    return this;
};

Poison.add = function(path){
    var rand = random(0,100);
    if (rand <= this.appearanceRate){
        this.__proto__.add.apply(this, [path]);
    }
};

module.exports = Poison;