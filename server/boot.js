const net = require('net');
const socket = require('./socket').default;
const GameState = require('./state/gameState').default;

exports.default = (options) => {
  const server = net.createServer();
  server.gameState = new GameState();

  server.listen(options, () => {
    console.log(`Server listening to ${options.port}`);
  });

  server.on('connection', socket);

  server.on('error', e => {
    switch (e.code) {
      case 'EADDRINUSE':
        console.error('Error: Address in use.');
        break;
      case 'EACCES':
        console.error('Error: Cannot use this port.');
        break;
      default:
        console.error(e);
    }
    process.exitCode = 1;
  });
};
