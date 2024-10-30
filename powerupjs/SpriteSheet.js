
function SpriteSheet(imageName, createCollisionMask) {
this.image = new Image();
this.collisionMask = null
this.image.src = imageName;
powerupjs.Game.spritesStillLoading += 1;
var sprite = this
this.image.onload = function () {
    if (createCollisionMask) {
        console.log("Creating collision mask for sprite: " + imageName);
        sprite.createPixelCollisionMask();
    }
  powerupjs.Game.spritesStillLoading -= 1;
};
this.sheetColumns = 1;
this.sheetRows = 1;
var pathSplit = imageName.split("/");
var fileName = pathSplit[pathSplit.length - 1];
var fileSplit = fileName.split("/")[0].split(".")[0].split("@");
if (fileSplit.length <= 1) return;
var colRow = fileSplit[fileSplit.length - 1].split("x");

this.sheetColumns = parseInt(colRow[0]);
if (colRow.length === 2) {
  this.sheetRows = colRow[1];
}
}

Object.defineProperty(SpriteSheet.prototype, "width", {
  get: function() {
    return this.image.width / this.sheetColumns;
  }
})

Object.defineProperty(SpriteSheet.prototype, "height", {
  get: function() {
    return this.image.height / this.sheetRows;
  }
})

Object.defineProperty(SpriteSheet.prototype, "nrSheetElements", {
  get: function() {
    return this.sheetRows * this.sheetColumns;
  }
})

SpriteSheet.prototype.createPixelCollisionMask = function () {
  this.collisionMask = [];
  var w = this.image.width;
  var h = this.image.height;
  powerupjs.Canvas.pixelDrawingCanvas.width = w;
  powerupjs.Canvas.pixelDrawingCanvas.height = h;
  var ctx = powerupjs.Canvas.pixelDrawingCanvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.drawImage(this.image, 0, 0, w, h, 0, 0, w, h);
  ctx.restore();
  var imageData = ctx.getImageData(0, 0, w, h);
  for (var x = 3, l = w * h * 4; x < l; x += 4) {
      this.collisionMask.push(imageData.data[x]);
  }
};

SpriteSheet.prototype.getAlpha = function (x, y, sheetIndex, mirror) {
  if (this._collisionMask === null)
      return 255;

  var columnIndex = sheetIndex % this.sheetColumns;
  var rowIndex = Math.floor(sheetIndex / this.sheetColumns) % this.sheetRows;
  var textureX = columnIndex * this.width + x;
  if (mirror)
      textureX = (columnIndex + 1) * this.width - x - 1;
  var textureY = rowIndex * this.height + y;
  var arrayIndex = Math.floor(textureY * this.image.width + textureX);
  if (arrayIndex < 0 || arrayIndex >= this.collisionMask.length)
      return 0;
  else
      return this.collisionMask[arrayIndex];
};


SpriteSheet.prototype.draw = function (position, rotation, origin, scale, sheetIndex, mirror) {
  var columnIndex = sheetIndex % this.sheetColumns;
  var rowIndex = Math.floor(sheetIndex / this.sheetColumns) % this.sheetRows;
  var mirror = typeof mirror !== 'undefined' ? mirror : false
  var imagePart = new powerupjs.Rectangle(columnIndex * this.width, rowIndex * this.height,
  this.width, this.height);
  powerupjs.Canvas.drawImage(this.image, position, rotation, origin, scale, mirror, imagePart);
};
