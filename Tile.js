
var TileType = {
  'background': 0,
  'normal': 1
}

function Tile(type, index, sprite, sheetIndex, blockType, color) {
  this.sprite = sprite
  powerupjs.SpriteGameObject.call(this, sprite, 1, 0, ID.layer_objects);
  this.sheetIndex = sheetIndex;
  this.index = new powerupjs.Vector2(index.x, index.y)
  this.type = type;
  this.blockType = blockType;
  this.color = color
}

Tile.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

Tile.prototype.draw = function() {
  if (parseInt(this.type) === TileType.background) return;
  powerupjs.SpriteGameObject.prototype.draw.call(this);
}