function Box(type, position, currLevel) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects_1);
  this.loadAnimation(sprites.boxes[type].idle, "idle", true);
  this.loadAnimation(sprites.boxes[type].hit, "hit", false, 0.05);
  this.position = position;
  this.type = type;
  this.levelIndex = currLevel;
  this.hitting = false;
  this.playAnimation("idle");
  this.waitTime = 500;
  this.hitDate = Date.now()
  this.fruitCount = 10;
  this.origin = new powerupjs.Vector2(this.width / 2, this.height / 2);
}

Box.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Box.prototype.update = function (delta) {
  this.origin = new powerupjs.Vector2(this.width / 2, this.height / 2);
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  if (this.sheetIndex >= this.numberSheetElements - 1) {
    this.playAnimation("idle");
    this.hitting = false;
    console.log(this.hitting)
    if (this.type === "box1" && this.hitting) {
      this.visible = false;
    }
  }
  var player = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevel.find(ID.player);

};

Box.prototype.hit = function (direction) {
  var fruitList = new Array();
  for (var i in sprites.fruits) {
    fruitList.push(i);
  }
  if (!this.hitting) {
    // Only loop once per hit

    if (direction === "top") {
      this.playAnimation("hit");
      this.hitting = true;
      if (this.type === "box1") {
        for (var i = 0; i < this.fruitCount; i++) {
          console.log(fruitList[Math.floor(Math.random() * 7)]);
          var fruitFeild = powerupjs.GameStateManager.get(
            ID.game_state_playing
          ).currentLevel.find(ID.fruits);
          var fruit = new Fruit(
            fruitList[Math.floor(Math.random() * 7)],
            new powerupjs.Vector2(
              this.position.x,
              this.position.y + 30
              )
          );
          fruit.velocity = new powerupjs.Vector2(
            Math.random() * 1200 - 600,
            Math.random() * 500
          );
          fruit.hasGravity = true;
          fruitFeild.add(fruit);
        }
        this.visible = false
      } else if (this.type === "box2") {
        if (this.fruitCount > 0) {
          
          var fruitFeild = powerupjs.GameStateManager.get(
            ID.game_state_playing
          ).currentLevel.find(ID.fruits);
          var fruit = new Fruit(
            fruitList[Math.floor(Math.random() * 7)],
            new powerupjs.Vector2(
            this.position.x,
            this.position.y + 30
            )
          );
          fruit.velocity = new powerupjs.Vector2(
            Math.random() * 1200 - 600,
            Math.random() * 300
          );
          console.log(fruit.velocity)
          fruit.hasGravity = true;
          fruitFeild.add(fruit);
          this.fruitCount--;
          if (this.fruitCount <= 0) {
            this.visible = false;
          }
        }
      }
    } else if (direction === "bottom") {
      this.playAnimation("hit");
      this.hitting = true;
      if (this.type === "box1") {
        for (var i = 0; i < this.fruitCount; i++) {
          console.log(fruitList[Math.floor(Math.random() * 7)]);
          var fruitFeild = powerupjs.GameStateManager.get(
            ID.game_state_playing
          ).currentLevel.find(ID.fruits);
          var fruit = new Fruit(
            fruitList[Math.floor(Math.random() * 7)],
            this.position.copy()
          );
          fruit.velocity = new powerupjs.Vector2(
            Math.random() * 1200 - 600,
            Math.random() * -100
          );
          fruit.hasGravity = true;
          fruitFeild.add(fruit);
        }
        this.visible = false
      } else if (this.type === "box2") {
        if (this.fruitCount > 0) {
          console.log(fruitList[Math.floor(Math.random() * 7)]);
          var fruitFeild = powerupjs.GameStateManager.get(
            ID.game_state_playing
          ).currentLevel.find(ID.fruits);
          var fruit = new Fruit(
            fruitList[Math.floor(Math.random() * 7)],
            this.position.copy()
          );
          fruit.velocity = new powerupjs.Vector2(
            Math.random() * 1200 - 600,
            Math.random() * -100
          );
          fruit.hasGravity = true;
          fruitFeild.add(fruit);
          this.fruitCount--;
          if (this.fruitCount <= 0) {
            this.visible = false;
          }
        }
      }
    }
  }
};
