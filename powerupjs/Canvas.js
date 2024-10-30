var powerupjs = (function (powerupjs) {


function Canvas_Singleton() {
  this.canvas = null;
  this.pixelDrawingCanvas = null;
  this.context = null;
  this.canvasOffset = new powerupjs.Vector2(0, 0);
}

Object.defineProperty(Canvas_Singleton.prototype, "offset",
  {
      get: function () {
          return this.canvasOffset;
      }
  });

Object.defineProperty(Canvas_Singleton.prototype, "scale",
  {
      get: function () {
          return new powerupjs.Vector2(this.canvas.width / powerupjs.Game.size.x,
              this.canvas.height / powerupjs.Game.size.y);
      }
  });

Canvas_Singleton.prototype.initialize = function () {
  this.canvas = document.getElementById("mycanvas");
  this.pixelDrawingCanvas = document.createElement('canvas')
  this._div = document.getElementById("gameArea");
  this.context = this.canvas.getContext('2d');


   window.onresize = Canvas_Singleton.prototype.resize;
   this.resize();
};

Canvas_Singleton.prototype.clear = function () {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas_Singleton.prototype.resize = function () {
  var gameCanvas = powerupjs.Canvas.canvas;
  var gameArea = powerupjs.Canvas._div;
  var widthToHeight = powerupjs.Game.size.x / powerupjs.Game.size.y;
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;
  var newWidthToHeight = newWidth / newHeight;

  if (newWidthToHeight > widthToHeight) {
      newWidth = newHeight * widthToHeight;
  } else {
      newHeight = newWidth / widthToHeight;
  }
  gameArea.style.width = newWidth + 'px';
  gameArea.style.height = newHeight + 'px';

  gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
  gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
  gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
  gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

  gameCanvas.width = newWidth;
  gameCanvas.height = newHeight;

  var offset = new powerupjs.Vector2(0, 0);
  if (gameCanvas.offsetParent) {
      do {
          offset.x += gameCanvas.offsetLeft;
          offset.y += gameCanvas.offsetTop;
      } while ((gameCanvas = gameCanvas.offsetParent));
  }
  powerupjs.Canvas.canvasOffset = offset;
};

Canvas_Singleton.prototype.drawImage = function (sprite, position, rotation, origin, scale, mirror, sourceRect) {
  var canvasScale = this.scale;
  position = typeof position !== 'undefined' ? position : new powerupjs.Vector2(0, 0);
  rotation = typeof rotation !== 'undefined' ? rotation : 0;
  scale = typeof scale !== 'undefined' ? scale : 1;
  origin = typeof origin !== 'undefined' ? origin : new powerupjs.Vector2(0, 0);
  sourceRect = typeof sourceRect !== 'undefined' ? sourceRect : new powerupjs. Rectangle(0, 0, sprite.width, sprite.height);
  mirror = typeof mirror !== 'undefined' ? mirror : false;

  this.context.save();
  if (mirror) {
    this.context.scale(scale * canvasScale.x * -1, scale * canvasScale.y);
    this.context.translate(-position.x - sourceRect.width, position.y);
    this.context.rotate(rotation);
    this.context.drawImage(sprite, sourceRect.x, sourceRect.y,
      sourceRect.width, sourceRect.height,
      sourceRect.width - origin.x, -origin.y,
      sourceRect.width, sourceRect.height);
  }
  else {
  this.context.scale(scale * canvasScale.x, scale * canvasScale.y)
  this.context.translate(position.x, position.y);
  this.context.rotate(rotation);
  this.context.drawImage(sprite, sourceRect.x, sourceRect.y,
      sourceRect.width, sourceRect.height,
      -origin.x * scale, -origin.y * scale,
      sourceRect.width * scale, sourceRect.height * scale);
  }
  this.context.restore();
};

Canvas_Singleton.prototype.drawText = function (text, position, origin, color, textAlign, fontname, fontsize) {
  var canvasScale = this.scale;

  position = typeof position !== 'undefined' ? position : new powerupjs.Vector2(0, 0);
  origin = typeof origin !== 'undefined' ? origin : new powerupjs.Vector2(0, 0);
  color = typeof color !== 'undefined' ? color : 'black';
  textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
  fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
  fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";

  this.context.save();
  this.context.scale(canvasScale.x, canvasScale.y);
  this.context.translate(position.x - origin.x, position.y - origin.y);
  this.context.textBaseline = 'top';
  this.context.font = fontsize + " " + fontname;
  this.context.fillStyle = color.toString();
  this.context.textAlign = textAlign;
  this.context.fillText(text, 0, 0);
  this.context.restore();
};

Canvas_Singleton.prototype.drawRectangle = function (x, y, width, height) {
  var canvasScale = this.scale;
  this.context.save();
  this.context.scale(canvasScale.x, canvasScale.y);
  this.context.strokeRect(x, y, width, height);
  this.context.restore();
};

powerupjs.Canvas = new Canvas_Singleton();
return powerupjs;

})(powerupjs || {});