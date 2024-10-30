function Spikes(type, position, currLevel, rotation) {
  powerupjs.SpriteGameObject.call(this, sprites.traps['spikes'].idle, 1, rotation, ID.layer_objects_1);
  this.position = position;
  this.type = type;
  this.levelIndex = currLevel;
}

Spikes.prototype = Object.create(powerupjs.SpriteGameObject.prototype)