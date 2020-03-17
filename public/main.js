const { app, BrowserWindow } = require('electron');

const log = require('electron-log');
const debug = require('electron-debug');
debug({ enabled: true, showDevTools: false });

const { initAutoUpdater, checkForUpdates } = require('./scripts/autoUpdater');
const { beforeLoad } = require('./scripts/beforeLoad');
const { createMainWindow } = require('./scripts/mainWindow');
const { createTray, removeTray } = require('./scripts/tray');

const loggerController = require('./scripts/logger/loggerController');
const settingsController = require('./scripts/settings/settingsController');
const xmppController = require('./scripts/xmpp/xmppController');

log.info('App starting...');

beforeLoad();

app.whenReady().then(() => {
  log.info('Electron application is ready.');

  createMainWindow();
  createTray();

  initAutoUpdater();

  // register controllers
  loggerController();
  settingsController();
  xmppController();

  checkForUpdates();

  // TODO: setup devtools
});

app.on('before-quit', () => {
  log.info('Gong is about to quit.');
  removeTray();
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    log.info('All windows closed, quitting Gong.');
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    log.info('Gong activated and main window not found, creating a new one.');
    createMainWindow();
  }
});
