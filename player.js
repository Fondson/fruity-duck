var math = require('mathjs');
var isMobile = require('./detectMobile');

const RIGHT = 0;
const LEFT = 1;
var Player = {
    mousePosition: [], // delayed array of coordinates
    create: function(sprite, mousePos){
        var instance = Object.create(this);
        instance.sprite = sprite;
        instance.mousePos = mousePos; // original mousePosition obj
        instance.centerPos = { x: sprite.x,
            y: sprite.y} // used in mobile positioning
        instance.turnRight();
        return instance;
    },
    turnRight: function(){
        this.sprite.children[RIGHT].visible = true;
        this.sprite.children[LEFT].visible = false;
    },
    turnLeft: function(){
        this.sprite.children[RIGHT].visible = false;
        this.sprite.children[LEFT].visible = true;
    },
    hit: function hitTestRectangle(r2) {
        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        this.sprite.centerX = this.sprite.x + this.sprite.width / 2;
        this.sprite.centerY = this.sprite.y + this.sprite.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        this.sprite.halfWidth = this.sprite.width / 2;
        this.sprite.halfHeight = this.sprite.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = this.sprite.centerX - r2.centerX;
        vy = this.sprite.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = this.sprite.halfWidth + r2.halfWidth;
        combinedHalfHeights = this.sprite.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    },
    updatePositionMobile: function(centerMousePos, curMousePos){
        var globalDiffX = curMousePos.x - centerMousePos.x;
        var globalDiffY = curMousePos.y - centerMousePos.y;
        var newX = this.centerPos.x + globalDiffX;
        var newY = this.centerPos.y + globalDiffY;
        if (math.abs(newX - this.sprite.x) < 3){}
        else if (newX < this.sprite.x){
            this.turnLeft();
        }else{
            this.turnRight();
        }
        this.sprite.x = newX;
        this.sprite.y = newY;
    },
    updatePosition: function(){
        if (this.mousePosition.length >= 5){
            var curMousePosition = this.mousePosition.shift();
            this.sprite.vx = math.abs(curMousePosition.x - this.sprite.x);
            this.sprite.vy = math.abs(curMousePosition.y - this.sprite.y);

            if (math.abs(this.sprite.x - curMousePosition.x) <= 3){} // do nothing if x's are essentially the same
            else if (this.sprite.x < curMousePosition.x){
                this.sprite.x += this.sprite.vx;
                this.turnRight();
            }
            else if (this.sprite.x > curMousePosition.x){
                this.sprite.x -= this.sprite.vx;
                this.turnLeft();
            }

            if (math.abs(this.sprite.y - curMousePosition.y) <= 3){} // do nothing if y's are essentially the same
            else if (this.sprite.y < curMousePosition.y){
                this.sprite.y += this.sprite.vy;
            }
            else if (this.sprite.y > curMousePosition.y){
                this.sprite.y -= this.sprite.vy;
            }
        }

        this.mousePosition.push({x: this.mousePos.x, y: this.mousePos.y});
    },
    clear: function(){
        this.mousePosition = [];
        // reset player position
        if (isMobile){
            this.sprite.position.set((window.innerWidth - this.sprite.width) / 2, 
                    window.innerHeight - this.sprite.height - 20);
        }else{
            this.sprite.position.set(this.mousePos.x, this.mousePos.y);
        }
    }

}

module.exports = Player;


