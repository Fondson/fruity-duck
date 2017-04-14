class ScaleSprite{
    static fromHeightRatio(sprite, spriteToScreenHeightRatio) {
        const newSpriteHeight = window.innerHeight / spriteToScreenHeightRatio;
        const scaleRatio = sprite.height / newSpriteHeight;
        sprite.height = newSpriteHeight;
        sprite.width = sprite.width / scaleRatio;
    }
    static fromWidthRatio(sprite, spriteToScreenWidthRatio){
        const newSpriteWidth = window.innerWidth / spriteToScreenWidthRatio;
        const scaleRatio = sprite.width / newSpriteWidth;
        sprite.width = newSpriteWidth;
        sprite.height = sprite.height / scaleRatio;
    }
}

module.exports = ScaleSprite;