function CutsceneState() {
  this.cutscenes = new Array();
  this.loadCutscenes();
}

CutsceneState.prototype.draw = function() {
  var level = powerupjs.GameStateManager.get(ID.game_state_playing).levels;
  
}