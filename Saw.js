function Saw(type, position, currLevel, index, startpiece) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects);
  this.loadAnimation(sprites.traps["saw"].idle, "idle", true);
  this.loadAnimation(sprites.traps["saw"].on, "on", true, 0.05);
  this.chainPieces = new Array();
  this.startPosition = startpiece;
  this.endPosition = undefined;
  this.currentChainIndex = 0;
  this.direction = "forward";
  this.type = type;
  this.position = position;
  this.levelIndex = currLevel;
  this.index = index;
  this.speed = 10;
  this.playAnimation("on");
}

Saw.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Saw.prototype.update = function (delta) {
  if (powerupjs.GameStateManager.get(ID.game_state_playing).editing === false) {
    powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  } else {
    this.position.x = this.startPosition.x;
    this.position.y = this.startPosition.y;
  }

  if (this.endPosition !== undefined) {
    //  console.log(this.chainPieces[this.currentChainIndex]);
    //  console.log(this.endPosition)
    if (this.direction === "forward") {
      var nextChain = this.currentChainIndex + 1;
      if (nextChain > this.chainPieces.length - 1)
        nextChain = this.chainPieces.length - 1;

      if (
        this.chainPieces[nextChain].x >
        this.chainPieces[this.currentChainIndex].x
      ) {
        if (this.position.x > this.chainPieces[nextChain].x) {
          this.currentChainIndex++;
          if (
            this.position.x >= this.endPosition.x &&
            nextChain >= this.chainPieces.length - 1
          ) {
            if (
              this.endPosition.x === this.startPosition.x &&
              this.endPosition.y === this.startPosition.y
            ) {
              this.currentChainIndex = 0;
              this.direction = "forward";
              return;
            }

            this.direction = "back";
            return;
          }
        }
        this.velocity.x = 100;
        this.velocity.y = 0;
      }
      if (
        this.chainPieces[nextChain].y <
        this.chainPieces[this.currentChainIndex].y
      ) {
        if (this.position.y < this.chainPieces[nextChain].y) {
          this.currentChainIndex++;
          if (
            this.position.y <= this.endPosition.y &&
            nextChain >= this.chainPieces.length - 1
          ) {
            if (
              this.endPosition.x === this.startPosition.x &&
              this.endPosition.y === this.startPosition.y
            ) {
              this.currentChainIndex = 0;
              this.direction = "forward";
              return;
            }
            this.direction = "back";
            return;
          }
        }
        this.velocity.y = -100;
        this.velocity.x = 0;
      }
      if (
        this.chainPieces[nextChain].x <
        this.chainPieces[this.currentChainIndex].x
      ) {
        if (this.position.x < this.chainPieces[nextChain].x) {
          this.currentChainIndex++;
          if (
            this.position.x < this.endPosition.x &&
            nextChain >= this.chainPieces.length - 1
          ) {
            if (
              this.endPosition.x === this.startPosition.x &&
              this.endPosition.y === this.startPosition.y
            ) {
              this.currentChainIndex = 0;
              this.direction = "forward";
              return;
            }
            this.direction = "back";
            return;
          }
        }
        this.velocity.x = -100;
        this.velocity.y = 0;
      }
      if (
        this.chainPieces[nextChain].y >
        this.chainPieces[this.currentChainIndex].y
      ) {
        if (this.position.y > this.chainPieces[nextChain].y) {
          this.currentChainIndex++;
          if (
            this.position.y >= this.endPosition.y &&
            nextChain >= this.chainPieces.length - 1
          ) {
            if (
              this.endPosition.x === this.startPosition.x &&
              this.endPosition.y === this.startPosition.y
            ) {
              this.currentChainIndex = 0;
              this.direction = "forward";
              return;
            }
            this.direction = "back";
            return;
          }
        }
        this.velocity.y = 100;
        this.velocity.x = 0;
      }
    } else if (this.direction === "back") {
      var nextChain = this.currentChainIndex - 1;
      if (nextChain < 0) nextChain = 0;

      if (
        this.chainPieces[nextChain].x >
        this.chainPieces[this.currentChainIndex].x
      ) {
        if (this.position.x > this.chainPieces[nextChain].x) {
          this.currentChainIndex--;

          if (this.position.x >= this.startPosition.x && nextChain === 0) {
            this.direction = "forward";
            return;
          }
        }
        this.velocity.x = 100;
        this.velocity.y = 0;
      } else if (
        this.chainPieces[nextChain].y >
        this.chainPieces[this.currentChainIndex].y
      ) {
        if (this.position.y > this.chainPieces[nextChain].y) {
          this.currentChainIndex--;

          if (this.position.y >= this.startPosition.y && nextChain === 0) {
            this.direction = "forward";
            return;
          }
        }
        this.velocity.y = 100;
        this.velocity.x = 0;
      }
      if (
        this.chainPieces[nextChain].x <
        this.chainPieces[this.currentChainIndex].x
      ) {
        if (this.position.x < this.chainPieces[nextChain].x) {
          this.currentChainIndex--;

          if (this.position.x <= this.startPosition.x && nextChain === 0) {
            this.direction = "forward";
            return;
          }
        }
        this.velocity.x = -100;
        this.velocity.y = 0;
      } else if (
        this.chainPieces[nextChain].y <
        this.chainPieces[this.currentChainIndex].y
      ) {
        if (this.position.y < this.chainPieces[nextChain].y) {
          this.currentChainIndex--;

          if (this.position.y <= this.startPosition.y && nextChain === 0) {
            this.direction = "forward";
            return;
          }
        }
        this.velocity.y = -100;
        this.velocity.x = 0;
      }
    }
  }
};
