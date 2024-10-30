var powerupjs = (function (powerupjs) {


function GameStateManager() {
  this.gameStates = new Array();
  this.currentGameState = null;

  this.save()
}
GameStateManager.prototype.save = function() {
  
}

GameStateManager.prototype.add = function(gamestate) {
  this.gameStates.push(gamestate);
  this.currentGameState = gamestate;
  return this.gameStates.length - 1;
}

GameStateManager.prototype.get = function(id) {
  if (id < 0 || id >= this.gameStates.length) return null;
  else {
    return this.gameStates[id]
  } 
}

GameStateManager.prototype.switchTo = function(id) {
  this.currentGameState = this.get(id)
}

GameStateManager.prototype.handleInput = function(delta) {
  if (this.currentGameState !== null) {
    this.currentGameState.handleInput(delta)
  }
}

GameStateManager.prototype.draw = function() {
  if (this.currentGameState !== null) {
    this.currentGameState.draw()
  }
}

GameStateManager.prototype.update = function(delta) {
  if (this.currentGameState !== null) {
    this.currentGameState.update(delta)
  }
}

powerupjs.GameStateManager = new GameStateManager()
return powerupjs;

})(powerupjs || {});