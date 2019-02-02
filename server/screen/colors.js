const NAME = {
  FG: {
    BLACK: "\u001b[30m",    // 1
    RED: "\u001b[31m",      // 2
    GREEN: "\u001b[32m",    // 3
    YELLOW: "\u001b[33m",   // 4
    BLUE: "\u001b[34m",     // 5
    MAGENTA: "\u001b[35m",  // 6
    CYAN: "\u001b[36m",     // 7
    WHITE: "\u001b[37m",    // 8
  },
  BG: {
    BLACK: "\u001b[40m",
    RED: "\u001b[41m",
    GREEN: "\u001b[42m",
    YELLOW: "\u001b[43m",
    BLUE: "\u001b[44m",
    MAGENTA: "\u001b[45m",
    CYAN: "\u001b[46m",
    WHITE: "\u001b[47m",
  },
  RESET: "\u001b[0m"
};

const ARRAY = {
  FG: [
    NAME.FG.BLACK,
    NAME.FG.RED,
    NAME.FG.GREEN,
    NAME.FG.YELLOW,
    NAME.FG.BLUE,
    NAME.FG.MAGENTA,
    NAME.FG.CYAN,
    NAME.FG.WHITE
  ],
  BG: [
    NAME.BG.BLACK,
    NAME.BG.RED,
    NAME.BG.GREEN,
    NAME.BG.YELLOW,
    NAME.BG.BLUE,
    NAME.BG.MAGENTA,
    NAME.BG.CYAN,
    NAME.BG.WHITE
  ]
};

exports.default = {
  NAME,
  ARRAY
};