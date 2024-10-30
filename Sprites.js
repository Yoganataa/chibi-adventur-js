var sprites = {};

var ID = {};

ID.tiles = 1;
ID.fruits = 2;
ID.traps = 3;
ID.player = 4;
ID.boxes = 5;
ID.enemies = 6;

powerupjs.Game.loadAssets = function () {
  var loadSprite = function (img, collisionMask) {
    return new SpriteSheet("Sprites/" + img, collisionMask);
  };
  var loadSound = function (sound, looping) {
    return new Sound(sound, looping);
  };

  sprites.backgroundTiles = {
    brown: loadSprite("Background/Brown.png"),
    green: loadSprite("Background/Green.png"),
    blue: loadSprite("Background/Blue.png"),
    yellow: loadSprite("Background/Yellow.png"),
    grey: loadSprite("Background/Gray.png"),
    purple: loadSprite("Background/Purple.png"),
  };

  sprites.tiles = {
    blocks: {
      grey: loadSprite("Terrain/StoneSolidsTerrain@11.png"),
      bronze: loadSprite("Terrain/BronzeSolidsTerrain@11.png"),
      brown: loadSprite("Terrain/BrownSolidsTerrain@11.png"),
      gold: loadSprite("Terrain/GoldSolidsTerrain@11.png"),
      bricks: loadSprite("Terrain/BricksTerrain@13.png"),
    },
    grass: {
      green: loadSprite("Terrain/GreenGrassTerrain@13.png"),
      pink: loadSprite("Terrain/PinkGrassTerrain@13.png"),
      brown: loadSprite("Terrain/BrownGrassTerrain@13.png"),
    },
    border: {
      stone: loadSprite("Terrain/GreyBrickTerrain@13.png"),
      wood: loadSprite("Terrain/WoodPlanksTerrain@13.png"),
      scales: loadSprite("Terrain/GreenScalesTerrain@13.png"),
    },
  };

  sprites.fruits = {
    strawberries: loadSprite("Items/Fruits/Strawberry@17.png"),
    cherries: loadSprite("Items/Fruits/Cherries@17.png"),
    bananas: loadSprite("Items/Fruits/Bananas@17.png"),
    apple: loadSprite("Items/Fruits/Apple@17.png"),
    melon: loadSprite("Items/Fruits/Melon@17.png"),
    orange: loadSprite("Items/Fruits/Orange@17.png"),
    pineapple: loadSprite("Items/Fruits/Pineapple@17.png"),
    kiwi: loadSprite("Items/Fruits/Kiwi@17.png"),
  };

  sprites.boxes = {
    box1: {
      idle: loadSprite("Items/Boxes/Box1/Idle.png"),
      hit: loadSprite("Items/Boxes/Box1/Hit@3.png"),
    },
    box2: {
      idle: loadSprite("Items/Boxes/Box2/Idle.png"),
      hit: loadSprite("Items/Boxes/Box2/Hit@4.png"),
    },
  };

  sprites.extras = {
    particle: loadSprite("Other/Dust Particle.png"),
  };

  sprites.effects = {
    collected: loadSprite("Items/Fruits/Collected@6.png"),
  };

  sprites.virtual_guy = {
    idle: loadSprite("Main Characters/Virtual Guy/Idle@11.png"),
    run: loadSprite("Main Characters/Virtual Guy/Run@12.png"),
    jump: loadSprite("Main Characters/Virtual Guy/Jump.png"),
    double_jump: loadSprite("Main Characters/Virtual Guy/Double Jump@6.png"),
    fall: loadSprite("Main Characters/Virtual Guy/Fall.png"),
    wall_slide: loadSprite("Main Characters/Virtual Guy/Wall Jump@5.png"),
  };

  sprites.traps = {
    arrow: {
      idle: loadSprite("Traps/Arrow/Idle@10.png"),
      hit: loadSprite("Traps/Arrow/Hit@4.png"),
    },
    spikes: {
      idle: loadSprite("Traps/Spikes/Idle.png"),
    },
    fan: {
      idle: loadSprite("Traps/Fan/Off.png"),
      on: loadSprite("Traps/Fan/On@4.png"),
    },
    trampoline: {
      idle: loadSprite("Traps/Trampoline/Idle.png"),
      bounce: loadSprite("Traps/Trampoline/Jump@8.png"),
    },
    saw: {
      idle: loadSprite("Traps/Saw/Off.png"),
      on: loadSprite("Traps/Saw/On@8.png"),
      chain: loadSprite("Traps/Saw/Chain.png"),
    },
    brown_platform: {
      idle: loadSprite("Traps/Platforms/Brown Off.png")
    }
  };

  sprites.enemies = {
    mushroom: {
      idle: loadSprite("Enemies/Mushroom/Idle@14.png"),
      run: loadSprite("Enemies/Mushroom/Run@16.png"),
    },
    plant: {
      idle: loadSprite("Enemies/Plant/Idle@11.png"),
      shoot: loadSprite("Enemies/Plant/Attack@8.png"),
      bullet: loadSprite("Enemies/Plant/Bullet.png"),
    },
    fat_bird: {
      idle: loadSprite("Enemies/FatBird/Idle@8.png"),
      fall: loadSprite("Enemies/FatBird/Fall@4.png"),
      ground: loadSprite("Enemies/FatBird/Ground@4.png"),
      hit: loadSprite("Enemies/FatBird/Hit@5.png")

    },
  };
};
