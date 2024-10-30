function BackgroundTile(position, sprite) {
  powerupjs.SpriteGameObject.call(this, sprite, 2, 0, ID.layer_backgrounds);
  this.position = position
  this.velocity.y = 32;
}

BackgroundTile.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

BackgroundTile.prototype.update = function(delta) {
  powerupjs.SpriteGameObject.prototype.update.call(this, delta);
  if (this.position.y > 768) {
    this.position.y = -128
  }
} 
