import React from 'react';

class Turret extends React.Component {

  constructor(props) {
    super(props);
    this.position = props.position || '0 0 0';
    this.rotation = props.rotation || '0 0 0';
    this.turretRadius = props.turretRadius || 1;
    this.barrelLength = props.barrelLength || 5;
    this.activeControl = props.activeControl || false;
  }

  render () {
    if(this.activeControl) {
      return (
        <a-entity id='turret' position={this.position}>
          <a-cylinder height='1' radius={this.turretRadius} />
          <a-entity id='camera' position={`0 1 0`} 
          rotation={this.rotation}
          camera='near: 0.05' look-controls >
            <a-cylinder height={this.barrelLength} radius='0.08' 
            position={`0 -1 ${-this.barrelLength / 2}`} rotation='90 0 0' />
            <a-cylinder height='0.3' radius='0.12'
            spawner='mixin: projectile;' 
            click-listener
            position={`0 -1 ${-this.barrelLength}`}
            rotation='90 0 0' />
          </a-entity>
        </a-entity>
      )
    } else {
      return (
        <a-entity id='turret' position={this.position}
        quick-rotate={`nextAngle: ${this.props.turretAngle}`}>
          <a-cylinder height='1' radius={this.turretRadius} />
          <a-cylinder height={this.barrelLength} radius='0.08' 
          position={`0 0 ${-this.barrelLength / 2}`} rotation='90 0 0' />
          <a-cylinder height='0.3' radius='0.12' 
          position={`0 0 ${-this.barrelLength}`}
          rotation='90 0 0' />
        </a-entity>
      )
    }
  }
}

module.exports = Turret;

AFRAME.registerComponent('click-listener', {
  init: function () {
    var el = this.el;
    window.addEventListener('click', function () {
      el.emit('click', null, false);
    });
  }
});