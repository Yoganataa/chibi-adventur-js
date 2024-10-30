var powerupjs = (function (powerupjs) {

function GameObject(layer, id) {
  this.layer = typeof layer !== 'undefined' ? layer: 0;
  this.id = typeof id !== 'undefined' ? id: 0;
  this.parent = null;
  this.position = new powerupjs.Vector2(0, 0);
  this.velocity = new powerupjs.Vector2(0, 0);
  this.visible = true;
}

GameObject.prototype.update = function(delta) {
  this.position.addTo(this.velocity.multiply(delta));
}

GameObject.prototype.handleInput = function() {}

GameObject.prototype.reset = function() {
  this.visible = true
}

Object.defineProperty(GameObject.prototype, 'worldPosition', {
  get: function() {
    if (this.parent !== null) {
      return this.parent.worldPosition.addTo(this.position);
    }
    else {
      return this.position.copy()
    }
  }
})

Object.defineProperty(GameObject.prototype, "root", {
  get: function() {
    if (this.parent === null) {
      return this;
    }
    else {
      return this.parent.root;
    }
  }
})

powerupjs.GameObject = GameObject;


function SpriteGameObject(sprite, scale, rotation, layer, id) {
  powerupjs.GameObject.call(this, layer, id);
  this.sprite = sprite;
  this.origin = new powerupjs.Vector2(0, 0);
  this.scale = scale;
  this.rotation = rotation;
  this.mirror = false;
  this._sheetIndex = 0;
}

SpriteGameObject.prototype = Object.create(powerupjs.GameObject.prototype);

SpriteGameObject.prototype.getAlpha = function(x, y) {
  return this.sprite.getAlpha(x, y, this._sheetIndex, this.mirror)
}
SpriteGameObject.prototype.collidesWith = function (obj) {
  if (obj !== typeof Rectangle) {
  if (!this.visible || !obj.visible || !this.boundingBox.intersects(obj.boundingBox))
      return false;
  var intersect = this.boundingBox.intersection(obj.boundingBox);
  var local = intersect.position.subtractBy(this.worldPosition.subtract(this.origin));
  var objLocal = intersect.position.subtractBy(obj.worldPosition.subtract(obj.origin));
  }
  else {
    if (!this.visible || !this.boundingBox.intersects(obj))
      return false;
  var intersect = this.boundingBox.intersection(obj);
  var local = intersect.position.subtractBy(this.worldPosition.subtract(this.origin));
  var objLocal = intersect.position.subtractBy(obj.center);
  }
  for (var x = 0; x < intersect.width; x++)
      for (var y = 0; y < intersect.height; y++) {
          if (this.getAlpha(Math.floor(local.x + x), Math.floor(local.y + y)) !== 0
              && obj.getAlpha(Math.floor(objLocal.x + x), Math.floor(objLocal.y + y)) !== 0)
              return true;
      }
  return false;
};
Object.defineProperty(SpriteGameObject.prototype, "width", {
  get: function() {
    return this.sprite.width
  }
})

Object.defineProperty(SpriteGameObject.prototype, "height", {
  get: function() {
    return this.sprite.height
  }
})

Object.defineProperty(SpriteGameObject.prototype, "size", {
  get: function() {
    return this.sprite.height * this.sprite.width
  }
})

Object.defineProperty(SpriteGameObject.prototype, "center", {
  get: function() {
    return new powerupjs.Vector2(this.width / 2, this.height / 2)
  }
})


Object.defineProperty(SpriteGameObject.prototype, "sheetIndex", {
  get: function() {
    return this._sheetIndex;
  },

  set: function(value) {
    if (value >=0 && value < this.sprite.nrSheetElements) {
      this._sheetIndex = value
    }
  }
})

Object.defineProperty(SpriteGameObject.prototype, 'numberSheetElements', {
  get: function() {
    return this.sprite.nrSheetElements
  }
})

SpriteGameObject.prototype.draw = function() {
  if (!this.visible) return;
  this.sprite.draw(this.worldPosition, this.rotation, this.origin, this.scale, this.sheetIndex, this.mirror)
};

Object.defineProperty(SpriteGameObject.prototype, "boundingBox",
{
    get: function () {
        var leftTop = this.worldPosition.subtractBy((this.origin));
        if (this.rotation == Math.PI / 2 || this.rotation === Math.PI + Math.PI / 2) {
          return new powerupjs.Rectangle(leftTop.x, leftTop.y, this.height, this.width);
        }
        else if (this.rotation == Math.PI) {
          var leftTop = new powerupjs.Vector2(this.worldPosition.x - this.width, this.worldPosition.y - this.height);
          return new powerupjs.Rectangle(leftTop.x, leftTop.y, this.width, this.height);

        }
        else {
          return new powerupjs.Rectangle(leftTop.x, leftTop.y, this.width, this.height);

        }
    }
});

powerupjs.SpriteGameObject = SpriteGameObject


function GameObjectList(layer, id) {
  powerupjs.GameObject.call(this, layer, id);
  this.gameObjects = new Array();
}

GameObjectList.prototype = Object.create(powerupjs.GameObject.prototype)


GameObjectList.prototype.update = function(delta) {
  for (var i=0; i<this.gameObjects.length; i++) {
    this.gameObjects[i].update(delta);

  }
}

GameObjectList.prototype.handleInput = function (delta) {
  for (var i = this.gameObjects.length - 1; i >= 0; --i){
    this.gameObjects[i].handleInput(delta);
  }
};

GameObjectList.prototype.clear = function () {
  for (var i = 0, l = this.gameObjects.length; i < l; ++i)
      this.gameObjects[i].parent = null;
  this.gameObjects = new Array();
};


GameObjectList.prototype.draw = function() {
 
  for (var i=0; i<this.gameObjects.length; i++) {
    if (this.visible) {
      this.gameObjects[i].draw();
    }
  }
}


GameObjectList.prototype.reset = function() {
 
  for (var i=0; i<this.gameObjects.length; i++) {
      this.gameObjects[i].reset();
    
  }
}

GameObjectList.prototype.add = function(gameobject) {
  this.gameObjects.push(gameobject);
  gameobject.parent = this;
  this.gameObjects.sort(function(a, b) {
    return a.layer - b.layer; 
  });
}



GameObjectList.prototype.remove = function (gameobject) {
  for (var i = 0, l = this.gameObjects.length; i < l; ++i) {
      if (gameobject !== this.gameObjects[i])
          continue;
      this.gameObjects.splice(i, 1);
      gameobject.parent = null;
      return;
  }
};

GameObjectList.prototype.find = function (id) {
  for (var i = 0, l = this.gameObjects.length; i < l; ++i) {
    if (this.gameObjects[i].id === id)
        return this.gameObjects[i];
    if (this.gameObjects[i] instanceof powerupjs.GameObjectList || this.gameObjects[i] instanceof powerupjs.GameObjectGrid) {
        var obj = this.gameObjects[i].find(id);
        if (obj !== null)
            return obj;
    }
}
return null;
};

GameObjectList.prototype.at = function(index) {
  if (index < 0 || index >= this.gameObjects.length)
  return null;
  return this.gameObjects[index]
}


Object.defineProperty(GameObjectList.prototype, "listLength", {
  get: function() {
    return this.gameObjects.length
  }
});


powerupjs.GameObjectList = GameObjectList




function GameObjectGrid(rows, columns, layer, id) {
  powerupjs.GameObjectList.call(this, layer, id);
  this.rows = rows;
  this.columns = columns;
  this.cellWidth = 0;
  this.cellHeight = 0;
}

GameObjectGrid.prototype = Object.create(GameObjectList.prototype);

GameObjectGrid.prototype.atIndex = function(index) {
  var row = Math.floor(index / this.columns);
  var col = index % this.columns;
  return this.at(col, row);

}

GameObjectGrid.prototype.update = function(delta) {
  for (var i=0; i<this.gridLength; i++) {
    this.gameObjects[i].update(delta);

  }
}

GameObjectGrid.prototype.handleInput = function (delta) {
  for (var i = 0; i < this.gridLength; i++){
    this.atIndex(i).handleInput(delta);
  }
};




GameObjectGrid.prototype.add = function(gameobject) {
  var row = Math.floor(this.gameObjects.length / this.columns);
  var col = this.gameObjects.length % this.columns;
  this.gameObjects.push(gameobject);

  gameobject.parent = this;
  gameobject.position = new powerupjs.Vector2(col * this.cellWidth, row * this.cellHeight);
}

Object.defineProperty(GameObjectGrid.prototype, 'gridLength', {
  get: function() {
    return this.rows * this.columns
  }
})


GameObjectGrid.prototype.addAt = function(gameobject, col, row, position) {
  var position = typeof position !== 'undefined' ? position : new powerupjs.Vector2(0, 0)
  this.gameObjects[row * this.columns + col] = gameobject;
  gameobject.parent = this;
  gameobject.position = new powerupjs.Vector2(col * this.cellWidth + position.x, row * this.cellHeight + position.y);
}

GameObjectGrid.prototype.at = function (col, row) {
  var index = row * this.columns + col;
  if (index < 0 || index >= this.gameObjects.length) {
      return null;
  }
  else {
    return this.gameObjects[index];
  }
};


GameObjectGrid.prototype.getTileType = function (x, y) {
  if (x < 0 || x > this.columns )
  return TileType.normal;
  if (y< 0 || y > this.rows - 1)
  return TileType.background;
  return parseInt(this.at(x, y).type)
};

GameObjectGrid.prototype.getPosition = function (gameobject) {
  var l = this.gameObjects.length;
  for (var i = 0; i < l; ++i)
      if (this.gameObjects[i] === gameobject) {
          var row = Math.floor(i / this.columns);
          var col = i % this.columns;
          return new powerupjs.Vector2(col, row);
      }
  return new powerupjs.Vector2(0, 0);
};

GameObjectGrid.prototype.getAnchorPosition = function (gameobject) {
  var l = this.gameObjects.length;
  for (var i = 0; i < l; ++i)
      if (this.gameObjects[i] === gameobject) {
          var row = Math.floor(i / this.columns);
          var col = i % this.columns;
          return new powerupjs.Vector2(col * this.cellWidth, row * this.cellHeight);
      }
  return new Vector2(0, 0);
};

powerupjs.GameObjectGrid = GameObjectGrid


function calculateTextSize(fontname, fontsize, text) {
  var div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = -1000;
  div.style.top = -1000;
  document.body.appendChild(div);
  text = typeof text !== 'undefined' ? text : "M";
  div.style.fontSize = "" + fontsize;
  div.style.fontFamily = fontname;
  div.innerHTML = text;
  var size = new powerupjs.Vector2(div.offsetWidth, div.offsetHeight);
  document.body.removeChild(div);
  return size;
}

function Label(fontname, fontsize, layer, id) {
  powerupjs.GameObject.call(this, layer, id);

  this.color = "black";
  this.origin = new powerupjs.Vector2(0, 0);
  this._fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
  this._fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";
  this._contents = "";
  this._align = "left";
  this._size = new powerupjs.Vector2(0, 0);
}

Label.prototype = Object.create(GameObject.prototype);

Object.defineProperty(Label.prototype, "size",
  {
      get: function () {
          return this._size;
      }
  });

Object.defineProperty(Label.prototype, "width",
  {
      get: function () {
          return this._size.x;
      }
  });

Object.defineProperty(Label.prototype, "height",
  {
      get: function () {
          return this._size.y;
      }
  });

Object.defineProperty(Label.prototype, "screenCenterX",
  {
      get: function () {
          return (powerupjs.Game.size.x - this.width) / 2 + this.origin.x;
      }
  });

Object.defineProperty(Label.prototype, "screenCenterY",
  {
      get: function () {
          return (powerupjs.Game.size.y - this.height) / 2 + this.origin.y;
      }
  });

Object.defineProperty(Label.prototype, "screenCenter",
  {
      get: function () {
          return powerupjs.Game.size.subtract(this.size).divideBy(2).addTo(this.origin);
      }
  });

Object.defineProperty(Label.prototype, "text",
  {
      get: function () {
          return this._contents;
      },

      set: function (value) {
          this._contents = value;
          this._size = calculateTextSize(this._fontname, this._fontsize, value);
      }
  });

Label.prototype.draw = function () {
  if (!this.visible)
      return;
      powerupjs.Canvas.drawText(this._contents, this.worldPosition,
      this.origin, this.color, this._align,
      this._fontname, this._fontsize);
};

powerupjs.Label = Label


function ScoreGameObject(fontName, fontSize, layer, id) {
  powerupjs.Label.call(this, fontName, fontSize, layer, id);
  this.text =  0;
  this.align = 'left';
}

ScoreGameObject.prototype = Object.create(powerupjs.Label.prototype)

Object.defineProperty(ScoreGameObject.prototype, "score", {
  get: function() {
    return this.contents;
  },
  set: function(value) {
    if (value >= 0) {
      this.text =  value;
    }
  }
})

ScoreGameObject.prototype.reset = function() {
  this.text = 0;
}

powerupjs.ScoreGameObject = ScoreGameObject




function Animation(sprite, looping, frameTime) {
  this.sprite = sprite;
  this.frameTime = typeof frameTime !== 'undefined' ? frameTime : 0.1;
  this.looping = looping;
}

powerupjs.Animation = Animation;

function AnimatedGameObject(scale, layer, id) {
  powerupjs.SpriteGameObject.call(this, null, scale, 0, layer, id);
  this.animations = {};
  this.current = null;
  this.time = 0;
}

AnimatedGameObject.prototype = Object.create(powerupjs.SpriteGameObject.prototype)

AnimatedGameObject.prototype.loadAnimation = function(animationName, id, looping, frameTime) {
  this.animations[id] = new powerupjs.Animation(animationName, looping, frameTime);
}

AnimatedGameObject.prototype.playAnimation = function(id) {
  if (this.current === this.animations[id]) {
    return
  };
  this.time = 0;
  this.current = this.animations[id];
  this.sprite = this.current.sprite
  this._sheetIndex = 0;

}

AnimatedGameObject.prototype.animationEnded = function() {
  return !this.current.looping && this._sheetIndex >= this.sprite.nrSheetElements;
}

AnimatedGameObject.prototype.update = function(delta) {
  this.time += delta;
  while (this.time > this.current.frameTime)  {

    this.time -= this.current.frameTime;
    this._sheetIndex++;
    if (this._sheetIndex >= this.sprite.nrSheetElements){
      if (this.current.looping) {
        this._sheetIndex = 0;
      }
      else {
        this._sheetIndex = this.sprite.nrSheetElements - 1;
      }
  }
  }
  powerupjs.SpriteGameObject.prototype.update.call(this, delta)
 }

powerupjs.AnimatedGameObject = AnimatedGameObject

function TimerGameObject(layer, id) {
  powerupjs.Label.call(this);
  this.layer = layer
  this.id = id
  this.running = true;
  this.multiplier = 1;
}


 TimerGameObject.prototype = Object.create(powerupjs.Label.prototype)



 TimerGameObject.prototype.draw = function() {
  powerupjs.Label.prototype.draw.call(this);
  this.color = 'white'
  if (!this.timeUp) {
  var minutes = Math.floor(this.timeLeft / 60);
  var seconds = Math.ceil(this.timeLeft % 60);
  this.text = minutes + ":" + seconds;
  if (seconds < 10) {
    this.text = minutes + ':0' + seconds
  }
  if (seconds <= 10 && seconds % 2) {
    this.color = 'red'
  }
}
if (this.timeUp) {
  this.text = "0:00"
}
 }

TimerGameObject.prototype.update =  function(delta) {
  powerupjs.Label.prototype.update.call(this, delta);
  if (!this.running) return
  this.timeLeft -= delta * this.multiplier;
}

TimerGameObject.prototype.reset = function() {
  powerupjs.Label.prototype.reset.call(this);
  this.running = true
}

Object.defineProperty(TimerGameObject.prototype, 'timeUp', {
  get: function() {
    return this.timeLeft <= 0;
  }
});

powerupjs.TimerGameObject = TimerGameObject;

return powerupjs;
})(powerupjs || {});
