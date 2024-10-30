function Arrow(type, currLevel, position) {
  this.type = type
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects_1);
  this.loadAnimation(sprites.traps['arrow'].idle, 'idle', true, 0.07);
  this.position = position;
  this.rotation = 0
  this.levelIndex = currLevel;
  this.playAnimation('idle')
}

Arrow.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);