function TileField(level) {
  powerupjs.GameObjectGrid.call(this, 14, 8, ID.layer_objects_1, ID.tiles);
  this.cellWidth = 64;
  this.cellHeight = 64;
  this.levelIndex = level;
  this.rows = levelLayout.length;
  this.columns = levelLayout[0].length;
  this.loadTiles();
}

TileField.prototype = Object.create(powerupjs.GameObjectGrid.prototype);

TileField.prototype.update = function (delta) {
  powerupjs.GameObjectGrid.prototype.update.call(this, delta);
};

TileField.prototype.loadTiles = function () {

var data;
  if (localStorage.tileInfo === undefined) {
    var tiles = levelLayout;
    for (var y = 0; y < tiles.length; y++) {
      for (var x = 0; x < tiles[0].length; x++) {
        var t = this.addTile(tiles[y][x], x, y);
        this.addAt(t, x, y);
      }
    }
    var infoArray = "";
    var string = ''

    for (var l=0; l < 2; l++) {
    for (var i = 0; i < this.gridLength; i++) {
      var tile = this.gameObjects[i];
      var str =
        tile.blockType +
        "/" +
        tile.color +
        "/" +
        tile.type +
        "/" +
        tile.index.x +
        "/" +
        tile.index.y +
        "/" +
        tile.sheetIndex;
      infoArray += str + ",";
    }
  
    string += l + ":" + infoArray + ":";
    localStorage.tileInfo = string
    }
}
    data = localStorage.tileInfo.split(":");


  var tileInfo = data[(this.levelIndex  + 1)  * 2 - 1].split(',');
  for (var i = 0; i < this.gridLength; i++) {
    var info = tileInfo[i].split("/");
    if (info[0] !== "undefined") {
      var t = new Tile(
        info[2],
        new powerupjs.Vector2(parseInt(info[3]), parseInt(info[4])),
        sprites.tiles[info[0].replace(/["]/g, '')][info[1].replace(/["]/g, '')],
        parseInt(info[5]),
        info[0].replace(/["]/g, ''),
        info[1].replace(/["]/g, '')
      );
    } else {
      var t = new Tile(
        info[2],
        new powerupjs.Vector2(parseInt(info[3]), parseInt(info[4]))
      );
    }
    this.addAt(t, parseInt(info[3]), parseInt(info[4]));
  }
};

TileField.prototype.addTile = function (type, x, y) {
  switch (type) {
    case "#":
      return new Tile(
        TileType.normal,
        new powerupjs.Vector2(x, y),
        sprites.tiles["blocks"].grey,
        4,
        "blocks",
        "grey"
      );
    case ".":
      return new Tile(TileType.background, new powerupjs.Vector2(x, y));
    default:
      return new Tile(TileType.background, new powerupjs.Vector2(x, y));
  }
};

