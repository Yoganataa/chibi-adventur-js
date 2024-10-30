function Fruit(fruitType, position) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects);
  this.loadAnimation(sprites.fruits[fruitType], "idle", true, 0.05);
  this.loadAnimation(sprites.effects["collected"], "collect", false, 0.04);
  this.fruitType = fruitType;
  this.position = position;
  this.collected = false;
  this.hasGravity = false;
  this.playAnimation("idle");
}

Fruit.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);


Fruit.prototype.reset = function() {
  this.collected = false;
  this.visible = true;
  this.playAnimation('idle')
}

Fruit.prototype.update = function (delta) {
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  if (this.hasGravity) {
 
    this.velocity.x *= 0.95;
    this.velocity.y += 8;
    var tiles = powerupjs.GameStateManager.get(
      ID.game_state_playing
    ).currentLevel.find(ID.tiles);
    var x_floor = Math.floor(this.position.x / tiles.cellWidth);
    var y_floor = Math.floor(this.position.y / tiles.cellHeight);
    for (var y = y_floor - 2; y <= y_floor + 1; y++) {
      for (var x = x_floor - 1; x <= x_floor + 1; x++) {
        var tileType = tiles.getTileType(x, y);
        if (tileType === TileType.background) continue;
        var tileBounds = new powerupjs.Rectangle(
          x * tiles.cellWidth,
          y * tiles.cellHeight,
          tiles.cellWidth,
          tiles.cellHeight
        );
        var boundingBox = this.boundingBox;
        boundingBox.height = this.boundingBox.height + 1;
        var depth = boundingBox.calculateIntersectionDepth(tileBounds);
        if (!tileBounds.intersects(boundingBox)) {
          continue;
        }
  
        if (Math.abs(depth.x) < Math.abs(depth.y)) {
          if (tileType === TileType.normal)
            this.position.x += depth.x + 2 * Math.sign(depth.x);
    
  
          continue;
        }
        if (
          this.previousYPosition <= tileBounds.top &&
          tileType !== TileType.background
        ) {
          this.onTheGround = true;
          this.velocity.y -= this.velocity.y;
          this.velocity.x = 0
        }
  
        if (tileType === TileType.normal || this.onTheGround) {
          this.position.y += depth.y + 1;
          if (!this.onTheGround) {
    
            this.velocity.y -= this.velocity.y - 200
          }
        }
      }
    }
  }
  if (this.collected) {
    this.playAnimation("collect");
    if (this.sheetIndex >= this.sprite.nrSheetElements - 1 && this.visible) {
      this.visible = false;
    }
  }
};
