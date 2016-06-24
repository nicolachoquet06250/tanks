AFRAME.registerComponent('spawner', {
  schema: {
    on: { default: 'click' },
    mixin: { default: '' },
    enabled: {default: true}
  },

  /**
   * Add event listener.
   */
  update: function (oldData) {
    if(this.data.enabled) {
      this.el.addEventListener(this.data.on, this.spawn.bind(this));
    }
  },

  /**
   * Spawn new entity at entity's current position.
   */
  spawn: function () {
    var el = this.el;
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotationEl = document.querySelector('#turretRotator').object3D.el;

    // For Two Player:
    var tankEl = rotationEl.parentElement.parentElement;
    var turretRotation = rotationEl.getAttribute('rotation');

    // console.log('El', el);
    // console.log('rotationEl', rotationEl);
    // console.log('tankEl', tankEl);
    
    var tankVel = tankEl.getAttribute('velocity');

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    entity.setAttribute('mixin', this.data.mixin);

    // Rotate to heading based on turret rotation and tank rotation
    var velocity = new THREE.Vector3(0, 0, -30);
    if (turretRotation) {
      const turretHeading = new THREE.Euler(0, 0, 0, 'YXZ');
      turretHeading.set(
        THREE.Math.degToRad(turretRotation.x),
        THREE.Math.degToRad(turretRotation.y),
        THREE.Math.degToRad(turretRotation.z)
      );
      velocity.applyEuler(turretHeading);
    }

    // Add momentum from tank
    velocity.add(tankVel);

    // Set velocity on projectile
    entity.setAttribute('velocity', velocity);

    el.sceneEl.appendChild(entity);
    var projectileData = {
      position: entity.getAttribute('position'),
      velocity: entity.getAttribute('velocity'),
    }
    window.socket.emit('shotFired', projectileData);
  }
});
