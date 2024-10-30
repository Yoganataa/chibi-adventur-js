function Mushroom(type, position, currLevel) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects);
  this.loadAnimation(sprites.enemies["mushroom"].idle, "idle", true, 0.05);
  this.loadAnimation(sprites.enemies['mushroom'].run, 'run', true, 0.04);
  this.type = type;
  this.position = position;
  this.currLevel = currLevel;
  this.direction = 1;
  this.waitTime = Date.now();
  this.moveSpeed = 200;
  this.switching = true;
  this.waitToAlternate();
  this.playAnimation("idle");
  this.origin = new powerupjs.Vector2(this.width / 2, this.height / 2);
}

Mushroom.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Mushroom.prototype.update = function (delta) {
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  if (Date.now() > this.waitTime + 1000 && this.switching) {
    this.direction *= -1;
    this.moveSpeed = 200;
    this.velocity.x = this.moveSpeed * this.direction;
    this.playAnimation('run')
    this.switching = false;
  }
  this.velocity.x = this.moveSpeed * this.direction;
  this.velocity.y += 55;
  this.handleCollisions();
  if (this.velocity.x > 0) this.mirror = true;
  if (this.velocity.x < 0) this.mirror = false
};

Mushroom.prototype.waitToAlternate = function () {
  this.moveSpeed = 0;
  this.playAnimation('idle')
  this.waitTime = Date.now();
};

Mushroom.prototype.die = function() {
  alert()
}

Mushroom.prototype.handleCollisions = function () {
  this.onTheGround = false;

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
      boundingBox.draw();
      var depth = boundingBox.calculateIntersectionDepth(tileBounds);
      if (!tileBounds.intersects(boundingBox)) {
        continue;
      }
      if (Math.abs(depth.x) < Math.abs(depth.y)) {
        if (tileType === TileType.normal) {
          if (Math.abs(this.velocity.x) > 0 && Math.abs(depth.x) > 0) {
            this.switching = true;
            this.waitToAlternate();
          }
          this.position.x += depth.x;
        }
        continue;
      }

      if (
        this.previousYPosition <= tileBounds.top &&
        tileType !== TileType.background
      ) {
        this.onTheGround = true;
        this.velocity.y -= this.velocity.y;
      }

      if (tileType === TileType.normal || this.onTheGround) {
        this.position.y += depth.y + 1;
        if (!this.onTheGround) {
          this.velocity.y -= this.velocity.y - 200;
        }
      }
    }
  }

  var player = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevel.find(ID.player);

  if (player.boundingBox.intersects(this.boundingBox) && this.visible && !player.dead) {
    if (player.previousYPosition <= this.position.y) {
      player.velocity.y = 0
      player.velocity.y -= 800
      this.visible = false;
    }
    else {
      if (!player.dead) {
        player.velocity.y = 0
        player.velocity.y -= 800
        player.die()

      }
    }
  }

  this.previousYPosition = this.position.y;
};
