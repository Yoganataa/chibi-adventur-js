

var powerupjs = (function (powerupjs) {


function GameWorld(layer) {
  powerupjs.GameObjectList.call(this, layer);


}

GameWorld.prototype = Object.create(powerupjs.GameObjectList.prototype)

GameWorld.prototype.update = function() {
}

GameWorld.prototype.handleInput = function() {

  powerupjs.GameObjectList.prototype.handleInput.call(this);
 
}


return powerupjs;

})(powerupjs || {});