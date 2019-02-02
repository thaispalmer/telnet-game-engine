const Display = require('./screen/display').default;
const FrameBuffer = require('./screen/framebuffer').default;

const FPS = 5;
const INTERVAL = ((60 / FPS) / 60) * 1000;

const start = (socket) => {
  if (!socket.display) {
    socket.display = new Display();
    socket.display.buffer = FrameBuffer.empty(32, 32);
  }

  if (!socket.display.interval) {
    render(socket);
    socket.display.interval = setInterval(
      () => render(socket),
      INTERVAL
    );
  }
};

const stop = (socket) => {
  if (!socket.display && !socket.display.interval) return false;

  clearInterval(socket.display.interval);

  delete socket.display;
  return true;
}

const render = (socket) => {
  if (!socket.display || !socket.playerState) return false;

  // Pass commands to states
  switch (socket.playerState.currentCommand) {
    case 'walkUp':
      socket.playerState.y -= 1;
      break;

    default:
      break;
  }
  socket.playerState.currentCommand = null;

  console.log(socket.playerState.x, socket.playerState.y);

  // Output screen rendered
  const buffer = socket.display.screen;
  if (socket.display.hasChanged) {
    socket.write(buffer);
  }
}

exports.default = { start, stop };
