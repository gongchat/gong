const promiseIpc = require('electron-promise-ipc');

const logger = require('./loggerService');

const loggerController = () => {
  promiseIpc.on('/logger/set', arg => {
    logger.set(arg);
    return Promise.resolve();
  });

  promiseIpc.on('/logger/get', arg => {
    return Promise.resolve(logger.get(arg));
  });

  promiseIpc.on('/logger/search', arg => {
    return Promise.resolve(logger.search(arg));
  });
};

module.exports = loggerController;
