var powerupjs = (function (powerupjs) {

function Vector2(x, y) {
  this.x = typeof x !== undefined ? x : 0;
  this.y = typeof y !== undefined ? y : 0;
}

Vector2.prototype.zero = function() {
    return new Vector2(0, 0)
}

Object.defineProperty(Vector2.prototype, "length",
    {
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    });

    Object.defineProperty(Vector2.prototype, "isZero",
    {
        get: function () {
            return this.x === 0 && this.y === 0;
        }
    });
Vector2.prototype.equals = function (obj) {
    return this.x === obj.x && this.y === obj.y;
};


Vector2.prototype.addTo = function(v) {
   if (v.constructor == Vector2) {
       this.x += v.x;
       this.y += v.y;
   } 
   else if (v.constructor == Number) {
       this.x += v;
       this.y += v;
   }
   return this;
}

Vector2.prototype.add = function(v) {
    var result = this.copy();
    return result.addTo(v)
}


Vector2.prototype.subtractBy = function(v) {
   if (v.constructor == Vector2) {
       this.x -= v.x;
       this.y -= v.y;
   }
   else if (v.constructor == Number) {
       this.x -= v;
       this.y -= v;
   }
   return this;
}

Vector2.prototype.subtract = function(v) {
   var result = this.copy();
   return result.subtractBy(v)
}

Vector2.prototype.multiplyBy = function(v) {
   if (v.constructor == Vector2) {
       this.x *= v.x;
       this.y *= v.y;
   }
   else if (v.constructor == Number) {
       this.x *= v;
       this.y *= v;
   }
   return this;
}

Vector2.prototype.multiply = function(v) {
   var result = this.copy();
   return result.multiplyBy(v)
}

Vector2.prototype.divideBy = function (v) {
    if (v.constructor == Vector2) {
        this.x /= v.x;
        this.y /= v.y;
    }
    else if (v.constructor == Number) {
        this.x /= v;
        this.y /= v;
    }
    return this;
};

Vector2.prototype.divide = function (v) {
    var result = this.copy();
    return result.divideBy(v);
};

Vector2.prototype.copy = function(v) {
   return new Vector2(this.x, this.y);
}

Vector2.prototype.normalize = function () {
    var length = this.length;
    if (length === 0)
        return;
    this.divideBy(length);
};

powerupjs.Vector2 = Vector2
return powerupjs;

})(powerupjs || {});