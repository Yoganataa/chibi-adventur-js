function EnemyField(level) {
  powerupjs.GameObjectList.call(this, ID.layer_objects, ID.enemies);
  this.levelIndex = level
}

EnemyField.prototype = Object.create(powerupjs.GameObjectList.prototype)