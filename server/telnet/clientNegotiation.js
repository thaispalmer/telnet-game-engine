const {
  IAC,
  WILL,
  WONT,
  DO,
  DONT,
  SB,
  SE,
  ECHO,
  LINEMODE
} = require('./commandCodes').default;

const send = (sequence, socket) => {
  socket.write(new Buffer(sequence));
};

const init = (socket) => {
  send([IAC, DONT, ECHO], socket);
};

const parse = (buffer, socket) => {
  const respondCommand = (command, op) => {
    console.log('Operand: ', (
      op === IAC ? 'IAC' :
      op === WILL ? 'WILL' :
      op === WONT ? 'WONT' :
      op === DO ? 'DO' :
      op === DONT ? 'DONT' :
      op === SB ? 'SB' :
      op === SE ? 'SE' :
      'unrecognized'
    ) + ` (${op.charCodeAt()})`);

    console.log('Command: ', (
      command.length === 1 ? (
        (
          command === ECHO ? 'ECHO' :
          command === LINEMODE ? 'LINEMODE' :
          'unrecognized'
        )
        + ` (${command.charCodeAt()})`
      )
      : command
    ));
    console.log('---');

    let responseOp = null;
    switch (command) {
      case LINEMODE:
        if (op === WILL) {
          responseOp = DO;
        }
        break;
      
      default:
        if ([WILL, WONT].includes(op)) {
          responseOp = DONT;
        } else {
          responseOp = WONT;
        }
    }
    if (responseOp) send([IAC, responseOp, command], socket);
  };

  console.log(buffer);
  let receivingCommand = false;
  let currentCommand = null;
  let isSubNegotiating = false;
  let subNegotiationBuffer = null;
  let receivedWill = false;
  let receivedWont = false;
  let receivedDo = false;
  let receivedDont = false;
  for (let i = 0; i < buffer.length; i++) {
    const byte = String.fromCharCode(buffer[i]);
    switch (byte) {
      case IAC:
        if (!isSubNegotiating) {
          receivingCommand = true;
          currentCommand = null;
          isSubNegotiating = false;
          subNegotiationBuffer = null;
          receivedWill = false;
          receivedWont = false;
          receivedDo = false;
          receivedDont = false;
        }
        break;

      case WILL:
        if (receivingCommand && !isSubNegotiating) {
          isSubNegotiating = false;
          receivedWill = true;
          receivedWont = false;
          receivedDo = false;
          receivedDont = false;
        }
        break;

      case WONT:
        if (receivingCommand && !isSubNegotiating) {
          isSubNegotiating = false;
          receivedWill = false;
          receivedWont = true;
          receivedDo = false;
          receivedDont = false;
        }
        break;

      case DO:
        if (receivingCommand && !isSubNegotiating) {
          isSubNegotiating = false;
          receivedWill = false;
          receivedWont = false;
          receivedDo = true;
          receivedDont = false;
        }
        break;

      case DONT:
        if (receivingCommand && !isSubNegotiating) {
          isSubNegotiating = false;
          receivedWill = false;
          receivedWont = false;
          receivedDo = false;
          receivedDont = true;
        }
        break;

      case SB:
        if (receivingCommand && !isSubNegotiating) {
          currentCommand = null;
          subNegotiationBuffer = [];
          isSubNegotiating = true;
          receivedWill = false;
          receivedWont = false;
          receivedDo = false;
          receivedDont = false;
        }
        break;

      case SE:
        if (receivingCommand && isSubNegotiating) {
          respondCommand({
            command: currentCommand,
            buffer: subNegotiationBuffer
          }, SB);
          currentCommand = null;
          isSubNegotiating = false;
          subNegotiationBuffer = null;
          receivedWill = false;
          receivedWont = false;
          receivedDo = false;
          receivedDont = false;
        }
        break;

      default:
        if (receivingCommand) {
          if (receivedWill) {
            respondCommand(byte, WILL);
          } else if (receivedWont) {
            respondCommand(byte, WONT);
          } else if (receivedDo) {
            respondCommand(byte, DO);
          } else if (receivedDont) {
            respondCommand(byte, DONT);
          } else if (isSubNegotiating) {
            if (!currentCommand) {
              currentCommand = byte;
            } else {
              subNegotiationBuffer.push(byte);
            }
          }
        }
    }
  }
};

exports.default = {
  send,
  init,
  parse
};