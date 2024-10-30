function TrapFeild(level) {
  powerupjs.GameObjectList.call(this, ID.layer_objects, ID.traps);
  this.levelIndex = level;
  this.loadTraps()
}

TrapFeild.prototype = Object.create(powerupjs.GameObjectList.prototype)

TrapFeild.prototype.loadTraps = function() {
  if (localStorage.trapInfo === undefined) {
    var string = ""
    for (var l=0; l < 2; l++) {
    infoArray = 'undefined'
    string += l + ":" + infoArray + ":";
    localStorage.trapInfo = string
    }
}
else {
  var infoSplit = localStorage.trapInfo.split(':');
  var infoByLevel = infoSplit[(this.levelIndex  + 1)  * 2 - 1].split(',')
  console.log(infoByLevel)
  for (var i=0; i<infoByLevel.length - 1; i++) {
    var info = infoByLevel[i].split('/');

    if (info[0] === 'arrow') {
      this.add(new Arrow(
        info[0],
        this.levelIndex,
        new powerupjs.Vector2(parseInt(info[1]), parseInt(info[2]))
      ))
    }
    else if (info[0] === 'spikes') {
      this.add(
        new Spikes(
          info[0],
          new powerupjs.Vector2(parseInt(info[1]), parseInt(info[2])),
          this.levelIndex,
          parseFloat(info[3])
        )
      )
    }
    else if (info[0] === 'fan') {
      console.log(parseFloat(info[3]))
      this.add(
        new Fan(
          info[0],
          new powerupjs.Vector2(parseFloat(info[1]), parseFloat(info[2])),
          this.levelIndex,
          parseFloat(info[3]),
          info[4]
        )
      )
    }
    else if (info[0] === 'saw') {
      var chainPieces = info[3].split("|");
      var saw = new Saw(
        info[0],
        new powerupjs.Vector2(parseFloat(info[1]), parseFloat(info[2])),
        this.levelIndex,
        info[8],
        new powerupjs.Vector2(parseFloat(info[4]), parseFloat(info[5]))
      )
      for (var k=0; k<chainPieces.length - 1; k++) {
        var split = chainPieces[k].split(".");
        saw.chainPieces.push(new powerupjs.Vector2(parseFloat(split[0]), parseFloat(split[1])));
      }
      console.log(info[7])
      saw.endPosition = new powerupjs.Vector2(parseFloat(info[6]), parseFloat(info[7]))
      console.log(saw)
      this.add(
        saw
      )
    }
  }
}
}