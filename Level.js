var levelLayout = [
  "#######################",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#.....................#",
  "#######################"

]

function Level(currLevel) {
  powerupjs.GameObjectList.call(this);

  for (var x=0; x < 12; x++) {
    for (var y=0; y < 9; y++) {
      this.add(new BackgroundTile(new powerupjs.Vector2(x * 128, y * 128 - 256), sprites.backgroundTiles['purple']))
    }
  }
  var tiles = new TileField(currLevel);
  var fruits = new FruitFeild(currLevel);
  var traps = new TrapFeild(currLevel);
  var boxes = new BoxFeild(currLevel);
  var enemies = new EnemyField(currLevel)
  var player = new Player(currLevel);
  player.origin = new powerupjs.Vector2(player.width / 2, player.height)
  this.add(fruits)
  this.add(traps);
  this.add(tiles)
  this.add(enemies)
  this.add(boxes);
  this.add(player)
  this.alternateInt = 1;
  this.alternateDate = Date.now();
}

Level.prototype = Object.create(powerupjs.GameObjectList.prototype);

Level.prototype.reset = function() {
  this.find(ID.fruits).reset();
  this.find(ID.traps).reset();
}

Level.prototype.update = function(delta) {
  powerupjs.GameObjectList.prototype.update.call(this, delta);
  if (Date.now() > this.alternateDate + 8000) {
    this.alternateInt *= -1
    this.alternateDate = Date.now()
  }
}