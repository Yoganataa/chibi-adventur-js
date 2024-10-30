function Player(currLevel) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects_2, ID.player);
  var startpos = undefined;
  if (localStorage.playerInfo === undefined) {
    this.position = new powerupjs.Vector2(300, 300);
  } else {
    console.log(localStorage.playerInfo);
    var infoSplit = localStorage.playerInfo.split(":");
    console.log(infoSplit);
    var positions = infoSplit[currLevel].split(",");
    console.log(positions);
    this.position = new powerupjs.Vector2(
      parseInt(positions[0]),
      parseInt(positions[1])
    );
  }
  this.startpos = this.position.copy();
  this.onTheGround = false;
  this.onWall = false;
  this.pushoffVelocity = 100;
  this.fallSpeed = 100;
  this.jumps = 0;
  this.dead = false;
  this.loadAnimation(sprites.virtual_guy["idle"], "idle", true, 0.075);
  this.loadAnimation(sprites.virtual_guy["run"], "run", true, 0.025);
  this.loadAnimation(sprites.virtual_guy["jump"], "jump", true, 0.075);
  this.loadAnimation(
    sprites.virtual_guy["double_jump"],
    "double_jump",
    true,
    0.06
  );
  this.loadAnimation(sprites.virtual_guy["fall"], "fall", true, 0.075);
  this.loadAnimation(
    sprites.virtual_guy["wall_slide"],
    "wall_slide",
    true,
    0.075
  );
  this.playAnimation("idle");
}

Player.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Player.prototype.addInfoToStorage = function () {
  if (localStorage.playerInfo === undefined) return;
  var playerInfoArray = this.startpos.copy().x + "," + this.startpos.copy().y;
  var playerSplit = localStorage.playerInfo.split(":");
  playerSplit[lvlIndex + 1] = playerInfoArray;
  var joined3 = "";
  for (var i = 0; i < playerSplit.length - 1; i++) {
    joined3 += playerSplit[i].replace(/["]/g, "") + ":";
  }
  localStorage.playerInfo = joined3.replace(/["]/g, "");
};

Player.prototype.reset = function () {
  this.rotation = 0;
  this.dead = false;
  this.visible = true;
  this.position = this.startpos.copy();
};

Player.prototype.update = function (delta) {
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  this.velocity.y += this.fallSpeed;
  if (this.velocity.y > this.fallSpeed * 10) {
    this.velocity.y = this.fallSpeed * 10;
  }
  this.handleCollisions();
  if (this.dead) {
    this.rotation += 0.001;
  }
  if (this.dead && this.position.y > 800) {
    powerupjs.GameStateManager.get(ID.game_state_playing).currentLevel.reset();
    this.reset();
  }
};

Player.prototype.handleInput = function () {
  this.fallSpeed = 100;
  if (this.dead) return;
  if (powerupjs.Keyboard.keys[37].down) {
    this.velocity.x -= 100;
    this.mirror = true;
    if (this.onTheGround) this.playAnimation("run");
    if (this.velocity.x < -400) {
      this.velocity.x -= this.velocity.x + 400;
      console.log(this.velocity.x);
    }
    if (this.onWall && !this.onTheGround) {
      this.jumps = 0;
      this.fallSpeed = 25;
      this.playAnimation("wall_slide");
      this.velocity.y += 50;
      this.pushoffVelocity = 1000
      if (this.velocity.y > 200) this.velocity.y = 200;
    } else if (!this.onWall && !this.onTheGround) {
      this.playAnimation("jump");
    }
  } else if (powerupjs.Keyboard.keys[39].down) {
    this.velocity.x += 100;
    this.mirror = false;
    if (this.onTheGround) this.playAnimation("run");
    if (this.velocity.x > 400) {
      this.velocity.x -= this.velocity.x - 400;
    }
    if (this.onWall && !this.onTheGround) {
      this.jumps = 0;
      this.fallSpeed = 25;
      this.playAnimation("wall_slide");
      this.velocity.y += 50;
      if (this.velocity.y > 200) this.velocity.y = 200;
      this.pushoffVelocity = -1000;
    } else if (!this.onWall && !this.onTheGround) {
      this.playAnimation("jump");
    }
  } else {
    if (!this.beingBlown) this.velocity.x = 0;

    if (this.onTheGround) {
      this.playAnimation("idle");
    }
  }
  if (this.velocity.y > 0 && !this.onTheGround && !this.onWall) {
    this.playAnimation("fall");
  }
  if (powerupjs.Keyboard.keys[82].pressed) {
  }
  if (
    (powerupjs.Keyboard.keys[32].pressed ||
      powerupjs.Keyboard.keys[38].pressed) &&
    (this.onTheGround || this.jumps < 2)
  ) {
    this.velocity.y = 10;
    if (this.jumps === 0 && this.onTheGround) {
      this.velocity.y -= 1000;
      this.playAnimation("jump");
      this.jumps++;
    } else {
      if (!this.onTheGround && !this.onWall && !this.beingBlown) {
        this.velocity.y -= 1100;
        this.playAnimation("double_jump");
        this.jumps += 2;
      }
    }
    if (this.onWall) {
      this.velocity.y = 0;
      this.velocity.y -= 1100;
      this.velocity.x = this.pushoffVelocity;
      this.onWall = false;
    }
  }
};

Player.prototype.die = function () {
  this.dead = true;
  this.playAnimation("double_jump");
  var velocityX = this.velocity.x;
  var velocityY = Math.abs(this.velocity.y) * -1 - 100;
  if (velocityY > 1500) velocityY = 1500;
  this.velocity.y = velocityY;

  this.velocity.x = velocityX;
};

Player.prototype.handleCollisions = function () {
  this.beingBlown = false;
  this.onTheGround = false;
  this.onWall = false;
  if (this.dead) return;
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
        this.onWall = true;
        this.pushoffVelocity = 900 * Math.sign(depth.x);

        continue;
      }
      if (
        this.previousYPosition <= tileBounds.top &&
        tileType !== TileType.background
      ) {
        this.onWall = false;
        this.jumps = 0;
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

  var fruits = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevel.find(ID.fruits);
  for (var i = 0; i < fruits.listLength; i++) {
    if (
      this.boundingBox.intersects(fruits.at(i).boundingBox) &&
      fruits.at(i).visible
    ) {
      fruits.at(i).collected = true;
    }
  }

  var traps = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevel.find(ID.traps);
  for (var i = 0; i < traps.listLength; i++) {
    traps.at(i).boundingBox.draw();
    if (
      this.boundingBox.intersects(traps.at(i).boundingBox) &&
      traps.at(i).visible
    ) {
      if (traps.at(i).type === "arrow") {
        this.jumps = 0;
        this.velocity.y = -1500;
        traps.at(i).visible = false;
      } else if (traps.at(i).type === "spikes") {
        console.log(traps.at(i).boundingBox)
        this.die();
      } else if (traps.at(i).type === "trampoline") {
        this.velocity.y = 0;
        this.velocity.addTo(traps.at(i).launchVelocity);
        traps.at(i).launch();
      } else if (traps.at(i).type === "saw") {
        this.die();
      }
    }
  }
  for (var i = 0; i < traps.listLength; i++) {
    if (traps.at(i).type === "fan") {
      var fan = traps.at(i);
      if (
        fan.rotation === Math.PI / 2 ||
        fan.rotation === Math.PI / 2 + Math.PI
      ) {
        // If the fan is sideways
        if (
          this.position.y < fan.position.y + 200 &&
          this.position.y > fan.position.y - 200 &&
          fan.on
        ) {
          if (
            fan.rotation === Math.PI / 2 &&
            this.position.x > fan.position.x &&
            this.position.x < fan.position.x + 600
          ) {
            this.beingBlown = true;
            this.velocity.x += 110;
            if (this.velocity.x > 1100) this.velocity.x = 1100;
          } else if (
            fan.rotation === Math.PI / 2 + Math.PI &&
            this.position.x < fan.position.x &&
            this.position.x > fan.position.x - 600
          ) {
            this.beingBlown = true;
            this.velocity.x -= 110;
            if (this.velocity.x < -1100) this.velocity.x = -1100;
          }
        }
      } else if (fan.rotation === 0 || fan.rotation === Math.PI) {
        // If the fan is sideways
        if (
          this.position.x < fan.position.x + fan.width + 70 &&
          this.position.x > fan.position.x - 70 &&
          fan.on
        ) {
          if (fan.rotation === 0 && fan.position.y - this.position.y < 300) {
            this.beingBlown = true;
            this.velocity.y -= 110;
            if (this.velocity.y < -1100) this.velocity.y = -1100;
          }
        }
      }
    }
  }
  for (var i = 0; i < traps.listLength; i++) {
    if (traps.at(i).type === "brown_platform") {
      var platform = traps.at(i)
      if (this.boundingBox.intersects(platform.boundingBox)) {
        this.velocity.y = platform.velocity.y;
      }
    }
  }
  var boxes = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevel.find(ID.boxes);

  for (var i = 0; i < boxes.listLength; i++) {
    if (
      this.boundingBox.intersects(boxes.at(i).boundingBox) &&
      boxes.at(i).visible
    ) {
      var depth = this.boundingBox.calculateIntersectionDepth(
        boxes.at(i).boundingBox
      );
      if (Math.abs(depth.x) < Math.abs(depth.y)) {
        this.position.x += depth.x + 2 * Math.sign(depth.x);
        this.onWall = true;
        this.pushoffVelocity = 900 * Math.sign(depth.x);

        continue;
      }

      if (this.previousYPosition <= boxes.at(i).position.y) {
        this.onWall = false;
        this.jumps = 0;
        boxes.at(i).hit("top");
        this.onTheGround = true;
        this.velocity.y = 0;
        this.velocity.y -= 800;
      }
      if (
        this.previousYPosition >
        boxes.at(i).position.y + boxes.at(i).height
      ) {
        this.velocity.y += 400;
        boxes.at(i).hit("bottom");
      }

      this.position.y += depth.y + 1;
    }
  }

  this.previousYPosition = this.position.y;
};
