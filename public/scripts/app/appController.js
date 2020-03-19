const { app } = require('electron');
const promiseIpc = require('electron-promise-ipc');

const { checkForUpdates, quitAndInstall } = require('./autoUpdater');

const appController = () => {
  promiseIpc.on('/app/check-for-updates', () => {
    checkForUpdates();
    return Promise.resolve();
  });

  promiseIpc.on('/app/update', () => {
    quitAndInstall();
    return Promise.resolve();
  });

  promiseIpc.on('/app/get-info', () => {
    return Promise.resolve({
      version: app.getVersion(),
      operatingSystem: process.platform,
    });
  });
};

module.exports = appController;
