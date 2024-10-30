var powerupjs = (function (powerupjs) {


function Button(sprite, layer) {
  powerupjs.SpriteGameObject.call(this, sprite, 0.8, 0, layer);
  this.pressed = false;
}

Button.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

Button.prototype.handleInput = function(delta) {
  powerupjs.SpriteGameObject.prototype.handleInput.call(this, delta);
  this.pressed = this.visible && powerupjs.Mouse.containsMousePress(this.boundingBox)

}
powerupjs.Button = Button
return powerupjs;

})(powerupjs || {});