const ClientNegotiation = require('./telnet/clientNegotiation').default;
const RenderLoop = require('./renderLoop').default;
const PlayerState = require('./state/playerState').default;

exports.default = (event, socket, data) => {
  const { gameState } = socket.server;

  switch (event) {

    case 'connection':
      console.log('Client connected');
      ClientNegotiation.init(socket);
      RenderLoop.start(socket);
      socket.playerState = new PlayerState(socket);
      gameState.addPlayer(socket.playerState);
      break;

    case 'close':
      console.log('Client disconnected');
      RenderLoop.stop(socket);
      gameState.removePlayer(socket.gameState);
      break;

    case 'data':
      console.log(data);
      break;

    default:
  }
};
