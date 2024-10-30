var tileColorsByType = {
  blocks: ["grey", "bronze", "brown", "gold", "bricks"], // Blocks
  grass: ["green", "pink", "brown"], // Grass
  border: ["wood", "stone", "scales"],
};

function Editor() {
  powerupjs.GameObjectGrid.call(this);
  this.playing = powerupjs.GameStateManager.get(ID.game_state_playing);
  this.level = this.playing.currentLevel;
  this.cellWidth = 64;
  this.cellHeight = 64;
  this.blockTypes = new Array();
  this.fruitTypes = new Array();
  this.trapTypes = new Array();
  this.boxTypes = new Array();
  this.enemyTypes = new Array()
  this.specialMode = 'none'
  this.sawIndex = 0
  this.rotation = 0;
  for (let i in sprites.tiles) {
    this.blockTypes.push(i);
  }
  for (let i in sprites.fruits) {
    this.fruitTypes.push(i);
  }
  for (let i in sprites.traps) {
    this.trapTypes.push(i);
  }
  for (let i in sprites.boxes) {
    this.boxTypes.push(i);
  }
  for (let i in sprites.enemies) {
    this.enemyTypes.push(i)
  }
  this.selected = "blocks";
  this.typeCount = 0;
  for (var i = 0; i < this.blockTypes.length; i++) {
    this.typeCount++;
  }
  this.mode = "draw";
  this.currentNumberSheetElements = 0;
  this.currentTypeIndex = 0;
  this.currentIndex = 0;
  this.currentColorIndex = 0;
  this.mirrored = false;
  this.alternated = false;
  this.current =
    sprites.tiles[this.blockTypes[this.currentTypeIndex]][
      tileColorsByType[this.blockTypes[this.currentTypeIndex]][
        this.currentColorIndex
      ]
    ];

  this.gridPosition = new powerupjs.Vector2(0, 0);
  this.reset();
}

Editor.prototype = Object.create(powerupjs.GameObjectGrid.prototype);

Editor.prototype.update = function (delta) {
  this.levelIndex = powerupjs.GameStateManager.get(
    ID.game_state_playing
  ).currentLevelIndex;
  this.level = this.playing.currentLevel;

  powerupjs.GameObjectGrid.prototype.update.call(this, delta);
  if (this.selected === "blocks") {
    this.cellWidth = 64;
    this.cellHeight = 64;
  } else if (this.selected === "traps" || this.selected === "boxes") {
    this.cellWidth = 32;
    this.cellHeight = 32;
    if (this.trapTypes[this.currentTypeIndex] === "trampoline") {
      this.cellWidth = 16;
      this.cellHeight = 16;
    }
  } else if (this.selected === "fruits") {
    this.cellWidth = 16;
    this.cellHeight = 16;
  }
  else {
    this.cellWidth = 32;
    this.cellHeight = 32;
  }

  if (this.mode === "draw") {
    if (this.selected === "blocks") {
      this.current =
        sprites.tiles[this.blockTypes[this.currentTypeIndex]][
          tileColorsByType[this.blockTypes[this.currentTypeIndex]][
            this.currentColorIndex
          ]
        ];
        console.log(this.blockTypes[this.currentTypeIndex])
    } else if (this.selected === "fruits") {
      this.current = this.fruitTypes[this.currentTypeIndex];
    }
  }
  this.level.update(delta);
};

Editor.prototype.draw = function () {
  powerupjs.GameObjectGrid.prototype.draw.call(this);

  this.level.draw();
  if (this.mode === "draw") {
    if (this.selected === "blocks") {
      var block = new powerupjs.SpriteGameObject(
        this.current,
        1,
        0,
        ID.layer_overlays
      );
      this.currentNumberSheetElements = block.numberSheetElements;
      block.position = new powerupjs.Vector2(
        this.gridPosition.x * this.cellWidth,
        this.gridPosition.y * this.cellHeight
      );
      block.sheetIndex = this.currentIndex;
      block.draw();
    } else if (this.selected === "fruits") {
      var fruit = new powerupjs.SpriteGameObject(
        sprites.fruits[this.fruitTypes[this.currentTypeIndex]],
        1,
        0,
        ID.layer_overlays
      );
      fruit.position = new powerupjs.Vector2(
        this.gridPosition.x * this.cellWidth,
        this.gridPosition.y * this.cellHeight
      );
      fruit.draw();
    } else if (this.selected === "traps") {
      var trap = new powerupjs.SpriteGameObject(
        sprites.traps[this.trapTypes[this.currentTypeIndex]].idle,
        1,
        this.rotation,
        ID.layer_overlays
      );
      trap.position = new powerupjs.Vector2(
        this.gridPosition.x * this.cellWidth,
        this.gridPosition.y * this.cellHeight
      );
      trap.draw();
    } else if (this.selected === "boxes") {
      var box = new powerupjs.SpriteGameObject(
        sprites.boxes[this.boxTypes[this.currentTypeIndex]].idle,
        1,
        0,
        ID.layer_overlays
      );
      box.position = new powerupjs.Vector2(
        this.gridPosition.x * this.cellWidth,
        this.gridPosition.y * this.cellHeight
      );
      box.origin = new powerupjs.Vector2(box.width / 2, box.height / 2)
      box.draw();
    }
    else if (this.selected === "enemies") {
      var enemy = new powerupjs.SpriteGameObject(
        sprites.enemies[this.enemyTypes[this.currentTypeIndex]].idle,
        1,
        0,
        ID.layer_overlays
      );
      enemy.position = new powerupjs.Vector2(
        this.gridPosition.x * this.cellWidth,
        this.gridPosition.y * this.cellHeight
      );
      if (this.enemyTypes[this.currentTypeIndex] === 'plant') {
        enemy.mirror = this.mirrored
      }
      enemy.draw();
    } 
     else if (this.selected === "player") {
      var player = new powerupjs.SpriteGameObject(
        sprites.virtual_guy["idle"],
        1,
        0,
        ID.layer_overlays
      );
      player.position = new powerupjs.Vector2(
        this.gridPosition.x * this.cellWidth,
        this.gridPosition.y * this.cellHeight
      );
      player.draw();
    }
  }
};

Editor.prototype.save = function () {
  var tiles = this.level.find(ID.tiles);
  var tileInfoArray = "";
  for (var i = 0; i < tiles.gridLength; i++) {
    var tile = tiles.atIndex(i);
    var str =
      tile.blockType +
      "/" +
      tile.color +
      "/" +
      tile.type +
      "/" +
      tile.index.x +
      "/" +
      tile.index.y +
      "/" +
      tile.sheetIndex;
    tileInfoArray += str + ",";
  }
  string = tileInfoArray;
  var tileSplit = localStorage.tileInfo.split(":");
  var lvlIndex = this.levelIndex * 2;
  tileSplit[lvlIndex + 1] = string;
  var joined = "";
  for (var i = 0; i < tileSplit.length - 1; i++) {
    joined += tileSplit[i].replace(/["]/g, "") + ":";
  }
  localStorage.tileInfo = joined.replace(/["]/g, "");
  var fruits = this.level.find(ID.fruits);
  var fruitInfoArray = "";
  for (var i = 0; i < fruits.listLength; i++) {
    if (!fruits.at(i).hasGravity) {
      var fruit = fruits.at(i);
      var str =
        fruit.fruitType + "/" + fruit.position.x + "/" + fruit.position.y;
      fruitInfoArray += str + ",";
    }
  }
  var fruitSplit = localStorage.fruitInfo.split(":");
  fruitSplit[lvlIndex + 1] = fruitInfoArray;
  var joined2 = "";
  for (var i = 0; i < fruitSplit.length - 1; i++) {
    joined2 += fruitSplit[i].replace(/["]/g, "") + ":";
  }
  localStorage.fruitInfo = joined2.replace(/["]/g, "");

  var traps = this.level.find(ID.traps);
  console.log(traps.listLength);
  var trapsInfoArray = "";
  for (var i = 0; i < traps.listLength; i++) {
    var trap = traps.at(i);
    if (trap.type === 'saw') {
      var chainPieceArray = "";

      for (var k=0; k<trap.chainPieces.length; k++) {
        chainPieceArray += trap.chainPieces[k].x  + "." + trap.chainPieces[k].y + "|"
      }
      var str =
      trap.type +
      "/" +
      trap.position.x +
      "/" +
      trap.position.y +
      "/" +
      chainPieceArray +
      "/" +
      trap.startPosition.x + 
      "/" +
      trap.startPosition.y +
      "/" +
      trap.endPosition.x + 
      "/" +
      trap.endPosition.y +
      "/" +
      trap.index
      console.log(trap.endPosition.y)
      trapsInfoArray += str + ",";
    } else {
    var str =
      trap.type +
      "/" +
      trap.position.x +
      "/" +
      trap.position.y +
      "/" +
      trap.rotation +
      "/" +
      trap.offset;
    trapsInfoArray += str + ",";
  }
}
  var trapInfoSplit = localStorage.trapInfo.split(":");
  console.log(trapsInfoArray);
  trapInfoSplit[lvlIndex + 1] = trapsInfoArray;
  var joined4 = "";
  for (var i = 0; i < trapInfoSplit.length - 1; i++) {
    joined4 += trapInfoSplit[i].replace(/["]/g, "") + ":";
  }
  localStorage.trapInfo = joined4.replace(/["]/g, "");
  console.log(localStorage.trapInfo);



  var boxes = this.level.find(ID.boxes);
  var boxesInfoArray = "";
  for (var i = 0; i < boxes.listLength; i++) {
    var box = boxes.at(i);
    var str =
      box.type +
      "/" +
      box.position.x +
      "/" +
      box.position.y

    boxesInfoArray += str + ",";
  }
  var boxInfoSplit = localStorage.boxInfo.split(":");
  boxInfoSplit[lvlIndex + 1] = boxesInfoArray;
  var joined5 = "";
  for (var i = 0; i < boxInfoSplit.length - 1; i++) {
    joined5 += boxInfoSplit[i].replace(/["]/g, "") + ":";
  }
  localStorage.boxInfo = joined5.replace(/["]/g, "");
  console.log(localStorage.boxInfo);

  var player = this.level.find(ID.player);
  var playerInfoArray = player.startpos.x + "," + player.startpos.y;
  var playerSplit = localStorage.playerInfo.split(":");
  playerSplit[lvlIndex / 2] = playerInfoArray;
  var joined3 = "";
  for (var i = 0; i < playerSplit.length - 1; i++) {
    joined3 += playerSplit[i].replace(/["]/g, "") + ":";
  }
  localStorage.playerInfo = joined3.replace(/["]/g, "");
  console.log(localStorage.playerInfo);
};

Editor.prototype.handleInput = function () {
  this.gridPosition = new powerupjs.Vector2( // Set the blocks position based off the mouse position
    Math.floor(powerupjs.Mouse.position.x / this.cellWidth),
    Math.floor(powerupjs.Mouse.position.y / this.cellHeight)
  );
  if (powerupjs.Mouse.left.pressed) {
    if (this.mode === "draw") {
      if (this.selected === "blocks") {
        var tiles = this.level.find(ID.tiles);
        tiles.addAt(
          new Tile(
            TileType.normal,
            new powerupjs.Vector2(this.gridPosition.x, this.gridPosition.y),
            sprites.tiles[this.blockTypes[this.currentTypeIndex]][
              tileColorsByType[this.blockTypes[this.currentTypeIndex]][
                this.currentColorIndex
              ]
            ],
            this.currentIndex,
            this.blockTypes[this.currentTypeIndex],
            tileColorsByType[this.blockTypes[this.currentTypeIndex]][
              this.currentColorIndex
            ]
          ),
          this.gridPosition.x,
          this.gridPosition.y
        );
      } else if (this.selected === "fruits") {
        var fruits = this.level.find(ID.fruits);
        fruits.add(
          new Fruit(
            this.fruitTypes[this.currentTypeIndex],
            new powerupjs.Vector2(
              this.gridPosition.x * this.cellWidth,
              this.gridPosition.y * this.cellHeight
            )
          )
        );
      } else if (this.selected === "traps") {
        var traps = this.level.find(ID.traps);
        if (this.trapTypes[this.currentTypeIndex] === "arrow") {
          traps.add(
            new Arrow(
              this.trapTypes[this.currentTypeIndex],
              this.levelIndex,
              new powerupjs.Vector2(
                this.gridPosition.x * this.cellWidth,
                this.gridPosition.y * this.cellHeight
              )
            )
          );
        } else if (this.trapTypes[this.currentTypeIndex] === "spikes") {
          traps.add(
            new Spikes(
              this.trapTypes[this.currentTypeIndex],
              new powerupjs.Vector2(
                this.gridPosition.x * this.cellWidth,
                this.gridPosition.y * this.cellHeight
              ),
              this.levelIndex,
              this.rotation
            )
          );
        } else if (this.trapTypes[this.currentTypeIndex] === "fan") {
          traps.add(
            new Fan(
              this.trapTypes[this.currentTypeIndex],
              new powerupjs.Vector2(
                this.gridPosition.x * this.cellWidth,
                this.gridPosition.y * this.cellHeight
              ),
              this.levelIndex,
              this.rotation,
              this.alternated
            )
          );
        } else if (this.trapTypes[this.currentTypeIndex] === "trampoline") {
          traps.add(
            new Trampoline(
              this.trapTypes[this.currentTypeIndex],
              new powerupjs.Vector2(
                this.gridPosition.x * this.cellWidth,
                this.gridPosition.y * this.cellHeight
              ),
              this.levelIndex,
              this.rotation
            )
          );
        }
        else if (this.trapTypes[this.currentTypeIndex] === "saw" && this.specialMode === 'none') {
          traps.add(
            new Saw(
              this.trapTypes[this.currentTypeIndex],
              new powerupjs.Vector2(
                this.gridPosition.x * this.cellWidth,
                this.gridPosition.y * this.cellHeight
              ),
              this.levelIndex,
              this.sawIndex,
              new powerupjs.Vector2(
                this.gridPosition.x * this.cellWidth,
                this.gridPosition.y * this.cellHeight
              ),
            )
          );
          
          this.sawIndex++
          this.specialMode = 'sawChain';
          
        }
      } 
      else if (this.selected === 'enemies') {
      if (this.enemyTypes[this.currentTypeIndex] === "mushroom") {
        var enemies = this.level.find(ID.enemies)
        enemies.add(
          new Mushroom(
            this.enemyTypes[this.currentTypeIndex],
            new powerupjs.Vector2(
              this.gridPosition.x * this.cellWidth,
              this.gridPosition.y * this.cellHeight
            ),
            this.levelIndex
          )
        )
      }
      else if (this.enemyTypes[this.currentTypeIndex] === "plant") {
        var enemies = this.level.find(ID.enemies)
        enemies.add(
          new Plant(
            this.enemyTypes[this.currentTypeIndex],
            new powerupjs.Vector2(
              this.gridPosition.x * this.cellWidth,
              this.gridPosition.y * this.cellHeight
            ),
            this.levelIndex,
            this.mirrored
          )
        )
      }
      else if (this.enemyTypes[this.currentTypeIndex] === "fat_bird") {
        var enemies = this.level.find(ID.enemies)
        enemies.add(
          new FatBird(
            this.enemyTypes[this.currentTypeIndex],
            new powerupjs.Vector2(
              this.gridPosition.x * this.cellWidth,
              this.gridPosition.y * this.cellHeight
            ),
            this.levelIndex
          )
        )
      }
    }
      else if (this.selected === "player") {
        console.log(this.level);
        this.level.find(ID.player).startpos = new powerupjs.Vector2(
          this.gridPosition.x * this.cellWidth,
          this.gridPosition.y * this.cellHeight
        );
        this.level.find(ID.player).position = new powerupjs.Vector2(
          this.gridPosition.x * this.cellWidth,
          this.gridPosition.y * this.cellHeight
        );
      } else if (this.selected === "boxes") {
        var boxes = this.level.find(ID.boxes);
        boxes.add(
          new Box(
            this.boxTypes[this.currentTypeIndex],
            new powerupjs.Vector2(
              this.gridPosition.x * this.cellWidth,
              this.gridPosition.y * this.cellHeight
            ),
            this.levelIndex
          )
        );
      }
      // this.playing.levels[this.playing.currentLevelIndex].find(ID.tiles).loadTiles()
    } else if (this.mode === "erase") {
      if (this.selected === "blocks") {
        var tiles = this.level.find(ID.tiles);
        tiles.addAt(
          new Tile(
            TileType.background,
            new powerupjs.Vector2(this.gridPosition.x, this.gridPosition.y)
          ),
          this.gridPosition.x,
          this.gridPosition.y
        );
      } else if (this.selected === "fruits") {
        var fruits = this.level.find(ID.fruits);
        for (var i = 0; i < fruits.listLength; i++) {
          if (fruits.at(i).boundingBox.contains(powerupjs.Mouse.position)) {
            fruits.remove(fruits.at(i));
          }
        }
      } else if (this.selected === "traps") {
        var traps = this.level.find(ID.traps);
        for (var i = 0; i < traps.listLength; i++) {
          if (traps.at(i).boundingBox.contains(powerupjs.Mouse.position)) {
            traps.remove(traps.at(i));
          }
        }
      } else if (this.selected === "boxes") {
        var boxes = this.level.find(ID.boxes);
        for (var i = 0; i < boxes.listLength; i++) {
          if (boxes.at(i).boundingBox.contains(powerupjs.Mouse.position)) {
            boxes.remove(boxes.at(i));
          }
        }
      }
    }
    if (this.specialMode === 'sawChain') {
      var traps = this.level.find(ID.traps);
      var sawArray = new Array()
      for (var i=0; i<traps.listLength; i++) {
        if (traps.at(i).type === 'saw') {
          sawArray.push(traps.at(i))
        }
 
      }
      for (var i=0; i<sawArray.length; i++) {
        if (this.sawIndex - 1 === sawArray[i].index) {
          sawArray[i].chainPieces.push(new powerupjs.Vector2(
            this.gridPosition.x * this.cellWidth,
            this.gridPosition.y * this.cellHeight
          ),)
        }
      }
    }
    
    if (this.specialMode !== 'sawChain' )
    this.save();
  }
  if (powerupjs.Keyboard.keys[37].pressed) {
    this.currentIndex++;
    if (this.currentIndex > this.currentNumberSheetElements) {
      this.currentIndex = 0;
    }
  }
  if (powerupjs.Keyboard.keys[39].pressed) {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.currentNumberSheetElements;
    }
  }
  if (powerupjs.Keyboard.keys[38].pressed) {
    this.currentColorIndex++;

   
    // this.currentNumberSheetElements = block.numberSheetElements;
    console.log(this.currentColorIndex)
    if (
      this.currentColorIndex >
      tileColorsByType[this.blockTypes[this.currentTypeIndex]].length - 1
    ) {
      this.currentColorIndex = 0;
      this.currentNumberSheetElements = 0;
    }
  }
  if (powerupjs.Keyboard.keys[40].pressed) {
    this.currentTypeIndex++;
    this.currentColorIndex = 0
    if (this.currentTypeIndex > this.typeCount - 1) {
      this.currentTypeIndex = 0;
    }
    this.currentNumberSheetElements = 0;
    this.rotation = 0;
  }
  if (powerupjs.Keyboard.keys[69].pressed) {
    this.mode = "erase";
  }
  if (powerupjs.Keyboard.keys[68].pressed) {
    this.mode = "draw";
  }
  if (powerupjs.Keyboard.keys[66].pressed) {
    this.selected = "blocks";
    this.currentTypeIndex = 0;
    this.typeCount = 0;
    for (var i = 0; i < this.blockTypes.length; i++) {
      this.typeCount++;
    }
  }
  if (powerupjs.Keyboard.keys[70].pressed) {
    this.selected = "fruits";
    this.currentTypeIndex = 0;
    this.typeCount = 0;
    for (var i = 0; i < this.fruitTypes.length; i++) {
      this.typeCount++;
    }
  }
  if (powerupjs.Keyboard.keys[75].pressed) {
    this.selected = "boxes";
    this.currentTypeIndex = 0;
    this.typeCount = 0;
    for (var i = 0; i < this.boxTypes.length; i++) {
      this.typeCount++;
    }
  }
  if (powerupjs.Keyboard.keys[32].pressed) {
    if (this.selected === 'enemies' && this.enemyTypes[this.currentTypeIndex] === 'plant') {
      this.mirrored = !this.mirrored
    }
    else {
    this.alternated = !this.alternated;
    alert(this.alternated);
    }
  }
  if (powerupjs.Keyboard.keys[27].pressed && this.specialMode === 'sawChain') {
    var traps = this.level.find(ID.traps);
    var sawArray = new Array()
    for (var i=0; i<traps.listLength; i++) {
      if (traps.at(i).type === 'saw') {
        sawArray.push(traps.at(i))
      }

    }
    for (var i=0; i<sawArray.length; i++) {
      if (this.sawIndex - 1 === sawArray[i].index) {
        console.log(sawArray[i])
        sawArray[i].endPosition = new powerupjs.Vector2(
          this.gridPosition.x * this.cellWidth,
          this.gridPosition.y * this.cellHeight
        )
      }
    }
    this.specialMode = 'none'
    this.save()
  }
  if (powerupjs.Keyboard.keys[84].pressed) {
    this.selected = "traps";
    this.currentTypeIndex = 0;
    this.typeCount = 0;
    for (var i = 0; i < this.trapTypes.length; i++) {
      this.typeCount++;
    }
  }
  if (powerupjs.Keyboard.keys[78].pressed) {
    this.selected = "enemies";
    this.currentTypeIndex = 0;
    this.typeCount = 0;
    for (var i = 0; i < this.enemyTypes.length; i++) {
      this.typeCount++;
    }
  }
  if (powerupjs.Keyboard.keys[65].pressed) {

    powerupjs.GameStateManager.switchTo(ID.game_state_playing);
    powerupjs.GameStateManager.get(ID.game_state_playing).editing = false
  }
  if (powerupjs.Keyboard.keys[80].pressed) {
    var playing = powerupjs.GameStateManager.get(ID.game_state_playing);
    if (playing.levels[playing.currentLevelIndex + 1] !== undefined) {
      playing.currentLevelIndex++;
      var player = this.level.find(ID.player);

      player.pos;
      powerupjs.GameStateManager.switchTo(ID.game_state_playing);
    }
  }
  if (powerupjs.Keyboard.keys[73].pressed) {
    var playing = powerupjs.GameStateManager.get(ID.game_state_playing);
    if (playing.levels[playing.currentLevelIndex - 1] !== undefined) {
      playing.currentLevelIndex--;
      powerupjs.GameStateManager.switchTo(ID.game_state_playing);
    }
  }
  if (powerupjs.Keyboard.keys[82].pressed) {
    var trapType = this.trapTypes[this.currentTypeIndex];
    if (
      trapType === "spikes" ||
      trapType === "fan" ||
      trapType === "trampoline"
    ) {
      this.rotation += Math.PI / 2;
      if (this.rotation === Math.PI * 2) {
        this.rotation = 0;
      }
    }
  }

  if (powerupjs.Keyboard.keys[83].pressed) {
    this.selected = "player";
  }
  if (powerupjs.Keyboard.keys[90].pressed) {
    localStorage.clear();
    window.location.reload();
  }
};
