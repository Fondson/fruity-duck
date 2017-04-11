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
    appearanceRate: 30, // out of 100
    super_: null,
    create: function(gameScene){
        var super_ = Fruits.create(gameScene);
        this.super_ = super_;
        [this.super_.reachedEnd, this.super_.hitPlayer] = 
            [this.super_.hitPlayer, this.super_.reachedEnd];
        return this;
    },
    add: function(path){
        var rand = random(0,100);
        if (rand <= this.appearanceRate){
            this.super_.add(path);
        }
    },
    update: function(player){
        return this.super_.update(player);
    },
    clear: function(){
        this.super_.clear();
    }
}

module.exports = Poison;