const promiseIpc = require('electron-promise-ipc');

const settings = require('./settingsService');

// Settings
const settingsController = () => {
  promiseIpc.on('/settings/set', arg => {
    settings.set(arg);
    return Promise.resolve();
  });

  promiseIpc.on('/settings/flash-frame', arg => {
    settings.set(arg);
    return Promise.resolve();
  });
};

module.exports = settingsController;
