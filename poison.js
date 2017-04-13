const a = require('./alias');
const LinkedList = require('./node_modules/linkedlist/lib/linkedlist');
const Fruits = require('./fruits');
const random = require('./random');

//Aliases
const Container = a.Container,
    autoDetectRenderer = a.autoDetectRenderer,
    loader = a.loader,
    resources = a.resources,
    Sprite = a.Sprite,
    TextureCache = a.TextureCache;
const duckRightPath = a.duckRightPath;
const duckLeftPath = a.duckLeftPath;
const skyPath = a.skyPath;
const pearPath = a.pearPath;

class Poison extends Fruits{
    constructor(gameScene){
        super(gameScene);
        // swap
        [this.reachedEnd, this.hitPlayer] = 
            [this.hitPlayer, this.reachedEnd];
    }
    add(path){
        const rand = random(0,100);
        if (rand <= this.appearanceRate){
            super.add(path);
        }
    }
    get appearanceRate(){
        return 30;
    }
}

module.exports = Poison;