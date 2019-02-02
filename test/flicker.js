const RenderLoop = require('../server/renderLoop').default;
const FrameBuffer = require('../server/screen/framebuffer').default;

class dummySocket {
  write(content) {
    process.stdout.write(content);
  }
}

const socket = new dummySocket();

RenderLoop.start(socket);
setInterval(() => {
  const color = Math.floor(((Math.random() * 10) % 8) + 1);
  socket.display.buffer = FrameBuffer.empty(32, 32, color);
}, 10);
