function FatBird(type, position, currLevel) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects);
  this.loadAnimation(sprites.enemies["fat_bird"].idle, "idle", true, 0.08);
  this.loadAnimation(sprites.enemies["fat_bird"].fall, "fall", true, 0.08);
  this.loadAnimation(sprites.enemies["fat_bird"].ground, "ground", false, 0.1);
  this.loadAnimation(sprites.enemies["fat_bird"].hit, "hit", false, 0.1);

  this.type = type;
  this.position = position;
  this.spawnPosition = this.position.copy();
  this.currLevel = currLevel;
  this.moveVelocity = 50;
  this.timeAlive = 0;
  this.direction = "left";
  this.switchTime = Date.now();
  this.playAnimation("idle");
  this.startY = position.y;
  this.origin = this.center;
  this.onTheGround = false;
  this.groundTime = 0;
  this.dropping = false;
  this.rising = false;
}

FatBird.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

FatBird.prototype.update = function (delta) {
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  this.timeAlive += delta;
  if (!this.dropping && !this.rising) this.velocity.y = Math.sin(this.timeAlive) * 25;
  if (this.direction === "left" && !this.dropping && !this.rising) {
    this.velocity.x = 50;
  } else if (this.direction === "right" && !this.dropping && !this.rising) {
    this.velocity.x = -50;
  }
  if (Math.random() < 0.05 && Date.now() > this.switchTime + 7000) {
    // Change directions every so often
    if (this.direction === "left") this.direction = "right";
    else if (this.direction === "right") this.direction = "left";
    this.switchTime = Date.now();
  }

  this.handleCollisions();

  if (this.onTheGround && !this.hitGround) {
    this.hitGround = true;
    this.groundTime = Date.now()
  }

  if (this.onTheGround && Date.now() > this.groundTime + 3000) {
    this.groundTime = 0;
    this.hitGround = false;
    this.dropping = false;
    this.rise();
  }

  if (this.rising && this.position.y <= this.startY) {
    this.velocity.y = 0;
    this.rising = false;
    this.dropping = false;
  }
};

FatBird.prototype.drop = function () {
  this.playAnimation("fall");
  this.dropping = true;
  this.velocity.x = 0;
  this.velocity.y = 900;
};

FatBird.prototype.rise = function() {
  this.playAnimation("idle");
  this.rising = true;
  this.velocity.x = 0;
  this.velocity.y = -700;
}

FatBird.prototype.handleCollisions = function () {
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
            this.position.x += depth.x;
            if (!this.touching) {
            if (this.direction === "left") this.direction = "right";
           else if (this.direction === "right") this.direction = "left";
        this.switchTime = Date.now();
        this.touching = true;
            }
          }
        }
        continue;
      }
      else {
        this.touching = false;;
      }
      
      var player = powerupjs.GameStateManager.get(
        ID.game_state_playing
      ).currentLevel.find(ID.player);
      var closestY = 0;

      if (
        this.previousYPosition <= tileBounds.top &&
        tileType !== TileType.background
      ) {
        this.onTheGround = true;
        this.velocity.y -= this.velocity.y;
        // this.playAnimation('hit');
        // if (this.animationEnded) {
          this.playAnimation("ground");
        // }
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

  for (var y = y_floor; y < (tiles.rows * tiles.cellHeight); y++) {
    if (tiles.getTileType(x_floor, y) === TileType.normal) {
      closestY = y * tiles.cellHeight;
      console.log(closestY)
      if (
        player.position.y <= closestY &&
        player.position.y > this.position.y &&
        player.position.x <= this.position.x + 100 &&
        player.position.x >= this.position.x - 100 &&
        this.visible && 
        !this.rising &&
        !this.dropping
      ) {
        this.drop(); // Drop
        this.dropping = true;
      }
      break;
    }
  }

  if (
    player.boundingBox.intersects(this.boundingBox) &&
    this.visible &&
    !player.dead
  ) {
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
