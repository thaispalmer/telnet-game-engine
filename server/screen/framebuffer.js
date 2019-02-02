const COLORS = require('./colors').default;
const PIXELS = require('./pixels').default;

const render = buffer => {
  const bg = buffer[0];
  const fg = buffer[1];

  const width = bg[0].length;
  const height = bg.length;

  let x, y;
  let frame = [];

  for (y = 0; y < height; y+=2) {
    const row = [];
    for (x = 0; x < width; x++) {
      const topPixel = fg[y][x] || bg[y][x] || 1;
      const bottomPixel = fg[y+1][x] || bg[y+1][x] || 1;
      if (topPixel === bottomPixel) {
        row.push(
          COLORS.ARRAY.FG[topPixel - 1] +
          PIXELS.FULL
        );
      } else {
        row.push(
          COLORS.ARRAY.FG[topPixel - 1] +
          COLORS.ARRAY.BG[bottomPixel - 1] +
          PIXELS.HALF
        );
      }
      row.push(COLORS.NAME.RESET);
    }
    // row.push(COLORS.NAME.RESET);
    frame.push(row)
  }

  return frame;
};

const empty = (w, h, color) => {
  const buffer = [];
  let x, y;
  for (y = 0; y < h; y++) {
    const line = [];
    for (x = 0; x < w; x++) {
      line.push(color ? color : 0);
    }
    buffer.push(line);
  }
  return [buffer, buffer];
}

exports.default = { render, empty };