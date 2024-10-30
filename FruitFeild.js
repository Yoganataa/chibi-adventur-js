function FruitFeild(level) {
  powerupjs.GameObjectList.call(this, ID.layer_objects_1, ID.fruits);
  this.levelIndex = level

  this.loadFruits();
}

FruitFeild.prototype = Object.create(powerupjs.GameObjectList.prototype);

FruitFeild.prototype.loadFruits = function () {
  
  if (localStorage.fruitInfo === undefined) {
    var string = "";
    for (var i = 0; i < 2; i++) {
      string += i + ":" + "none" + ":";
    }

    localStorage.fruitInfo = string;
  }
  var lvlSplit = localStorage.fruitInfo.split(":");
    var info = lvlSplit[(this.levelIndex * 2) + 1].split(",");

    for (var l = 0; l < info.length - 1; l++) {
      var infoAttributes = info[l].split("/");
      this.add(
        new Fruit(
          infoAttributes[0],
          new powerupjs.Vector2(
            parseInt(infoAttributes[1]),
            parseInt(infoAttributes[2])
          )
        )
      );
    }
  
};
