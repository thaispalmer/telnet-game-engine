'use strict';

const PlayerState = require('./playerState').default;

class GameState {
  constructor() {
    this._players = [];
  }

  _queryPlayer(query) {
    if (!query) return null;
    let player;
    if (typeof query === 'string') {
      player = this.get(query);
      if (!player) return null;
    } else if (query instanceof PlayerState) {
      player = query;
    } else return null;
    return player;
  }

  addPlayer(player) {
    if (!player instanceof PlayerState) return false;
    const foundPlayerName = this._players.filter(plr => plr.name === player.name);
    if (foundPlayerName.length > 0) return false;
    this._players.push(player);
    return true;
  }

  removePlayer(query) {
    const player = this._queryPlayer(query);
    if (!player) return null;
    const trimmedList = this._players.filter(plr => plr.name !== player.name);
    if (trimmedList.length === this._players.length) return false;
    this._players = trimmedList;
    return true;
  }
}

exports.default = GameState;
