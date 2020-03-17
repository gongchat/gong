const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const { getMainWindow } = require('./mainWindow');

autoUpdater.logger = log;

const initAutoUpdater = () => {
  autoUpdater.on('checking-for-update', () => {
    // mainWindow.webContents.send('app-set', { });
  });
  autoUpdater.on('update-available', (ev, info) => {
    const mainWindow = getMainWindow();
    mainWindow.webContents.send('app-set', {
      hasUpdate: true,
      isCheckingForUpdate: false,
      isUpdateDownloaded: false,
      isAutoUpdateError: false,
      lastDateTimeUpdatedChecked: new Date(),
    });
  });
  autoUpdater.on('update-not-available', (ev, info) => {
    const mainWindow = getMainWindow();
    mainWindow.webContents.send('app-set', {
      hasUpdate: false,
      isCheckingForUpdate: false,
      isUpdateDownloaded: false,
      isAutoUpdateError: false,
      lastDateTimeUpdatedChecked: new Date(),
    });
  });
  autoUpdater.on('error', (event, error) => {
    log.error('Auto update error');
    const mainWindow = getMainWindow();
    mainWindow.webContents.send('app-set', {
      hasUpdate: undefined,
      isCheckingForUpdate: false,
      isUpdateDownloaded: false,
      isAutoUpdateError: true,
      lastDateTimeUpdatedChecked: new Date(),
    });
  });
  autoUpdater.on('update-downloaded', (event, info) => {
    const mainWindow = getMainWindow();
    mainWindow.webContents.send('app-set', {
      hasUpdate: true,
      isCheckingForUpdate: false,
      isUpdateDownloaded: true,
      isAutoUpdateError: false,
    });
  });
};

const checkForUpdates = () => {
  if (autoUpdater) {
    log.info('Checking for updates.');
    autoUpdater.checkForUpdates();
  }
};

const quitAndInstall = () => {
  if (autoUpdater) {
    log.info('Quitting and installing updates.');
    autoUpdater.quitAndInstall();
  }
};

module.exports = {
  initAutoUpdater,
  checkForUpdates,
  quitAndInstall,
};
