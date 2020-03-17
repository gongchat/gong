const promiseIpc = require('electron-promise-ipc');

const logger = require('./loggerService');

const loggerController = () => {
  promiseIpc.on('/logger/set', arg => {
    return logger.set(arg);
  });

  promiseIpc.on('/logger/get', (arg, event) => {
    return logger.get(event, arg);
  });

  promiseIpc.on('/logger/search', (arg, event) => {
    return logger.search(event, arg);
  });
};

module.exports = loggerController;
