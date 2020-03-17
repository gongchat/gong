const promiseIpc = require('electron-promise-ipc');

const settings = require('./settingsService');

// Settings
const settingsController = () => {
  promiseIpc.on('/settings/set', arg => {
    return settings.set(arg);
  });

  promiseIpc.on('/settings/flash-frame', arg => {
    return settings.set(arg);
  });
};

module.exports = settingsController;
