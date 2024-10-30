function BoxFeild(currLevel) {
  powerupjs.GameObjectList.call(this, ID.layer_overlays, ID.boxes);
  this.levelIndex = currLevel;
  this.loadBoxes();
}

BoxFeild.prototype = Object.create(powerupjs.GameObjectList.prototype)

BoxFeild.prototype.loadBoxes = function() {
  if (localStorage.boxInfo === undefined) {
    var string = "";
    for (var i = 0; i < 2; i++) {
      string += i + ":" + "none" + ":";
    }

    localStorage.boxInfo = string;
  }
  var lvlSplit = localStorage.boxInfo.split(":");
    var info = lvlSplit[(this.levelIndex * 2) + 1].split(",");

    for (var l = 0; l < info.length - 1; l++) {
      var infoAttributes = info[l].split("/");
      this.add(
        new Box(
          infoAttributes[0],
          new powerupjs.Vector2(
            parseInt(infoAttributes[1]),
            parseInt(infoAttributes[2])
          )
        )
      );
    }
}