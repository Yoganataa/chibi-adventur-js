function PlayingState() {
  powerupjs.GameObject.call(this);
  this.levels = new Array();
  this.currentLevelIndex = 0;
  this.editing = false;
  for (var i = 0; i < 2; i++) {
    this.levels.push(new Level(i));
  }
  if (localStorage.playerInfo === undefined) {
    var info = "";
    for (var i = 0; i < 2; i++) {
      var player = this.levels[i].find(ID.player)
      var playerStart = player.startpos.copy()
      info += playerStart.x + "," + playerStart.y + ":";
      player.addInfoToStorage()
    }
    localStorage.playerInfo = info;
  }
  console.log(localStorage.playerInfo)

}

Object.defineProperty(PlayingState.prototype, "currentLevel", {
  get: function () {
    return this.levels[this.currentLevelIndex];
  },
});

PlayingState.prototype.update = function (delta) {
  if (this.levels[this.currentLevelIndex] !== undefined)
  this.levels[this.currentLevelIndex].update(delta);
};

PlayingState.prototype.draw = function () {
  if (this.levels[this.currentLevelIndex] !== undefined)
  this.levels[this.currentLevelIndex].draw();
};

PlayingState.prototype.handleInput = function () {
  if (powerupjs.Keyboard.keys[65].pressed) {
    this.editing = true
    powerupjs.GameStateManager.switchTo(ID.game_state_editing)
  }

  if (this.currentLevel !== undefined)
  this.currentLevel.handleInput();
};

