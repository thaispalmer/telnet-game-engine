'use strict';

const { render } = require('./framebuffer').default;
const {
  ERASE_DISPLAY,
  CURSOR_POSITION
} = require('./controlCodes').default;

class Display {
  constructor() {
    this._windowSize = [80, 24];
    this._bufferSize = [0, 0];
    this._frame = null;
    this._textBuffer = "";
  }

  set buffer(buffer) {
    this._frame = render(buffer)
    this._bufferSize = [
      buffer[0][0].length,
      buffer[0].length / 2
    ];
  }

  get screen() {
    const firstColumn = Math.floor(this._windowSize[0] / 2) - Math.floor(this._bufferSize[0] / 2);
    const firstLine = Math.floor(this._windowSize[1] / 2) - Math.floor(this._bufferSize[1] / 2);

    let textBuffer = ERASE_DISPLAY() + ERASE_DISPLAY(3);

    for (let i = 0; i < this._bufferSize[1]; i++) {
      textBuffer += CURSOR_POSITION(firstColumn + 1, firstLine + i + 1);
      textBuffer += this._frame[i].join('');
    }

    textBuffer += CURSOR_POSITION(1, this._windowSize[1] + 1);

    this.hasChanged = this._textBuffer !== textBuffer;
    this._textBuffer = textBuffer;

    return textBuffer;
  }

  getWindowSize() {
    return this._windowSize;
  }

  setWindowSize(width, height) {
    this._windowSize = [width, height];
  }
}

exports.default = Display;