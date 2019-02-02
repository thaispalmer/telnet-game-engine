const clientHandler = require('./clientHandler').default;
const userInput = require('./userInput').default;

exports.default = (socket) => {
  clientHandler('connection', socket);

  socket.on('data', buffer => {
    const data = userInput.parse(buffer, socket);
    if (data) clientHandler('data', socket, data);
  });

  socket.on('close', hasError => {
    clientHandler('close', socket, { hasError });
  });
};
