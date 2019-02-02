const ERASE_DISPLAY = n => `\u001b[${n ? n : 2}J`;
const CURSOR_POSITION = (x, y) => `\u001b[${y};${x}H`;

exports.default = {
  ERASE_DISPLAY,
  CURSOR_POSITION
};
