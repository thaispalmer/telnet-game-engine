'use strict';

const BACKGROUND = 0;
const FOREGROUND = 1;

class SceneObject {
  constructor(id, sprite) {
    this._layer = 1;
    this.id = id || "default";
    this.sprite = sprite || [[]];
    this.x = null;
    this.y = null;
    this.z = 0;
  }

  get size() {
    return [this.sprite[0].length, this.sprite.length];
  }

  get width() {
    return this.size[0];
  }

  get height() {
    return this.size[1];
  }

  set layer(layer) {
    if (![BACKGROUND, FOREGROUND].includes(layer)) return false;
    return this._layer = layer;
  }

  get layer() {
    return this._layer;
  }

  setAsBackground() {
    this._layer = BACKGROUND;
  }

  setAsForeground() {
    this._layer = FOREGROUND;
  }
}

exports.default = SceneObject;
