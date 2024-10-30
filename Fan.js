function Fan(type, position, currLevel, rotation, offset) {
  powerupjs.AnimatedGameObject.call(this, 1, ID.layer_objects);
  this.loadAnimation(sprites.traps["fan"].idle, "off", true);
  this.loadAnimation(sprites.traps["fan"].on, "on", true, 0.05);
  this.position = position;
  this.type = type;
  this.rotation = rotation;
  this.offset = offset;
  this.on = false;
  this.particles = new Array();
  this.velocities = new Array();
  this.particleWaitTime = Date.now();
  this.positions = new Array();
  this.levelIndex = currLevel;
  this.playAnimation("off");
}

Fan.prototype = Object.create(powerupjs.AnimatedGameObject.prototype);

Fan.prototype.update = function (delta) {
  powerupjs.AnimatedGameObject.prototype.update.call(this, delta);
  
  if (this.offset) {
    if (
      powerupjs.GameStateManager.get(ID.game_state_playing).currentLevel
        .alternateInt === -1
    ) {
      this.playAnimation("on");
      this.sendParticles();
      this.on = true;
    } else {
      this.playAnimation("off");
      this.on = false;
    }
  }
  else if (!this.offset) {
    if (
      powerupjs.GameStateManager.get(ID.game_state_playing).currentLevel
        .alternateInt === 1
    ) {
      this.playAnimation("on");
      this.sendParticles();
      this.on = true;
    } else {
      this.playAnimation("off");
      this.on = false;
    }
  }
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].position.addTo(this.velocities[i].multiply(delta));
    if (this.rotation === 0){
      if (this.particles[i].position.y < this.position.y - 300) {
        // this.particles[i].scale -= 0.01;
        // if (this.particles[i].scale <= 0) {
        this.particles[i] = null;
        this.particles = this.particles.filter((a) => a);
        //  }
      }
    }
    else if (this.rotation === Math.PI / 2) {
      if (this.particles[i].position.x > this.position.x + 600) {
        // this.particles[i].scale -= 0.01;
        // if (this.particles[i].scale <= 0) {
        this.particles[i] = null;
        this.particles = this.particles.filter((a) => a);
        //  }
      }
    }
    else if (this.rotation === Math.PI / 2 + Math.PI) {
      if (this.particles[i].position.x < this.position.x - 600) {
        // this.particles[i].scale -= 0.01;
        // if (this.particles[i].scale <= 0) {
        this.particles[i] = null;
        this.particles = this.particles.filter((a) => a);
        //  }
      }
    
  }
}
};

Fan.prototype.draw = function () {
  powerupjs.AnimatedGameObject.prototype.draw.call(this);
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].draw();
  }
};

Fan.prototype.sendParticles = function () {
  if (this.on && Date.now() > this.particleWaitTime + Math.random() * 200) {
    if (this.rotation === 0) {
      this.velocities.push(
        new powerupjs.Vector2(0, Math.random() * -200 - 400)
      );
    }
    else if (this.rotation === Math.PI / 2) {
      this.velocities.push(
        new powerupjs.Vector2(Math.random() * 200 + 400, 0)
      )
    }
    else if (this.rotation === Math.PI / 2 + Math.PI) {
      this.velocities.push(
        new powerupjs.Vector2(Math.random() * -200 - 400, 0)
      )
    }
    var particle = new powerupjs.SpriteGameObject(
      sprites.extras["particle"],
      1,
      0,
      ID.layer_overlays
    );
    if (this.rotation === 0) {
    particle.position = new powerupjs.Vector2(
      this.position.x + (Math.random() * 150 - 75 + this.width / 2),    // Center the spread outward
      this.position.y // Add it at the fan
    );
    }
    else if (this.rotation === Math.PI / 2 || this.rotation === Math.PI + Math.PI / 2) {
      particle.position = new powerupjs.Vector2(
        this.position.x,
        this.position.y + (Math.random() * 150 - 75 + this.height / 2)
      )
    }
    particle.origin = particle.center;
    this.particles.push(particle);
    this.particleWaitTime = Date.now();
  }
};
