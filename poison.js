var a = require('./alias');
var LinkedList = require('./node_modules/linkedlist/lib/linkedlist');
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

class Poison extends Fruits{
    constructor(gameScene){
        super(gameScene);
        // swap
        [this.reachedEnd, this.hitPlayer] = 
            [this.hitPlayer, this.reachedEnd];
    }
    add(path){
        var rand = random(0,100);
        if (rand <= this.appearanceRate){
            super.add(path);
        }
    }
    get appearanceRate(){
        return 30;
    }
}

module.exports = Poison;