'use strict';

class PlayerState {
  constructor(socket) {
    this.socket = socket;
    this.channel = 0;
    this.name = "Player";
    this.x = 0;
    this.y = 0;
    this.currentCommand = null;
  }
}

exports.default = PlayerState;
