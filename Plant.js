function Plant(type, position, currLevel, mirror) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects);
  this.loadAnimation(sprites.enemies["plant"].idle, "idle", true, 0.05);
  this.loadAnimation(sprites.enemies["plant"].shoot, "shoot", false, 0.05);
  this.type = type;
  this.position = position;
  this.currLevel = currLevel;
  this.playAnimation("idle");
  this.peas = new Array();
  if (!mirror)
  this.shootVelocity = -500;
  else 
  this.shootVelocity = 500
  this.mirror = mirror;
  this.waitTime = Date.now();
  this.origin = new powerupjs.Vector2(this.width / 2, this.height / 2);
}

Plant.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Plant.prototype.draw = function () {
  for (var i = 0; i < this.peas.length; i++) {
    this.peas[i].draw();
  }
  powerupjs.AnimatedGameObject.prototype.draw.call(this);
};

Plant.prototype.update = function (delta) {
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  this.velocity.y += 55;
  this.handleCollisions();
  for (var i = 0; i < this.peas.length; i++) {
    this.peas[i].update(delta);
  }
  if (this.sheetIndex >= this.numberSheetElements - 1) {
    this.playAnimation("idle");
  }
};

Plant.prototype.shoot = function () {
  if (Date.now() > this.waitTime + 800) {
    this.shootPea();
    this.playAnimation("shoot");
    this.waitTime = Date.now();
  }
};

Plant.prototype.shootPea = function () {
  this.peas.push(new Pea(new powerupjs.Vector2(this.position.x, this.position.y - (this.origin.y / 2)), this.shootVelocity));
};

Plant.prototype.handleCollisions = function () {
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
      var player = powerupjs.GameStateManager.get(
        ID.game_state_playing
      ).currentLevel.find(ID.player);
      var closestX = 0;

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

  if (!this.mirror) {
  for (var x = x_floor; x > 0; x--) {
    if (tiles.getTileType(x, y_floor) === TileType.normal) {
      closestX = x * tiles.cellWidth;
      if (
        player.position.x > closestX &&
        player.position.x < this.position.x && 
        player.position.y <= this.position.y + 50&&
        player.position.y > this.position.y - 200 &&        
        this.visible
      ) {
        // Calulates if the player is behind a wall
        this.shoot();
        break;
      }
    }
  }
}

else if (this.mirror) {
  for (var x = 0; x >= x_floor; x++) {
    if (tiles.getTileType(x, y_floor) === TileType.normal) {
      closestX = x * tiles.cellWidth;
      if (
        player.position.x < closestX &&
        player.position.x > this.position.x && 
        player.position.y <= this.position.y + 50&&
        player.position.y > this.position.y - 200 &&        
        this.visible
      ) {
        // Calulates if the player is behind a wall
        this.shoot();
      }
    }
  }
}

  if (player.boundingBox.intersects(this.boundingBox) && this.visible && !player.dead) {
    if (player.previousYPosition <= this.position.y) {
      player.velocity.y = 0;
      player.velocity.y -= 800;
      this.visible = false;
    } else {
      if (!player.dead) {
        player.velocity.y = 0;
        player.velocity.y -= 800;
        player.die();
      }
    }
  }

  this.previousYPosition = this.position.y;
};

function Pea(position, velocity) {
  powerupjs.SpriteGameObject.call(
    this,
    sprites.enemies["plant"].bullet,
    1,
    0,
    ID.layer_overlays
  );
  this.velocity.x = velocity;
  this.position = position;
}

Pea.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

Pea.prototype.update = function (delta) {
  powerupjs.SpriteGameObject.prototype.update.call(this, delta);
  var player = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevel.find(ID.player);

  if (player.boundingBox.intersects(this.boundingBox) && this.visible && !player.dead) {
    player.die();
  }
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
      if (this.boundingBox.intersects(tileBounds)) {
        this.visible = false;
      }
    }
  }
};
