const ClientNegotiation = require('./telnet/clientNegotiation').default;

const parse = (buffer, socket) => {
  const { playerState } = socket;

  // Telnet negotiations
  if (buffer[0] === 255) {
    ClientNegotiation.parse(buffer, socket);
    return;
  }

  // String commands
  switch (buffer.toString('utf8')) {
    case 'w':
      playerState.currentCommand = 'walkUp';
      break;
    case 'a':
      playerState.currentCommand = 'walkLeft';
      break;
    case 's':
      playerState.currentCommand = 'walkDown';
      break;
    case 'd':
      playerState.currentCommand = 'walkRight';
      break;
    default:
      return buffer
  }
};

exports.default = { parse };
