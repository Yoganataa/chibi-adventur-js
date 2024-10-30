
var powerupjs = (function (powerupjs) {

function Game() {
  this.size = {x: 1440, y: 825};
  this.spritesStillLoading = 0;
  this.totalTime = 0;
  this.started = false;
  // localStorage.clear()
}

Game.prototype.start = function() {
  powerupjs.Canvas.initialize();
  powerupjs.Game.loadAssets();
  powerupjs.Game.assetLoadingLoop();
}

Game.prototype.assetLoadingLoop = function() {
  if (powerupjs.Game.spritesStillLoading > 0) {
    setTimeout(powerupjs.Game.assetLoadingLoop, 1000/60);
  }
  else {
    console.log("Sprites loaded.");

    // Game.gameWorld = new GameWorld();
    ID.game_state_playing = powerupjs.GameStateManager.add(new PlayingState());
    ID.game_state_editing = powerupjs.GameStateManager.add(new Editor());
    // ID.game_state_cutscene = powerupjs.GameStateManager.add(new CutsceneState());
    powerupjs.GameStateManager.switchTo(ID.game_state_playing);
    powerupjs.Game.mainLoop();
  }
}

Game.prototype.loadAssets = function() {

}


Game.prototype.mainLoop = function() {
  var delta = 1 / 50 
   this.totalTime += 1000/50
  var timeStart = Date.now()
  powerupjs.Canvas.clear();
  powerupjs.GameStateManager.handleInput(delta)
  powerupjs.GameStateManager.update(delta);
  powerupjs.GameStateManager.draw();
  powerupjs.Keyboard.reset()
  powerupjs.Mouse.reset()
  // if (Date.now() - timeStart > 500) console.log(Date.now() - timeStart)

  setTimeout(powerupjs.Game.mainLoop, 1000/50)
}


powerupjs.Game = new Game()
return powerupjs;

})(powerupjs || {});