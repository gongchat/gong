const path = require('path');

const { app, BrowserWindow, shell } = require('electron');
const isDev = require('electron-is-dev');
const log = require('electron-log');

const settings = require('./settings');
const xmppJsClient = require('./xmppJsClient');

let mainWindow = null;
let isQuitting = false;

const getMainWindow = () => {
  return mainWindow;
};

const showMainWindow = () => {
  if (mainWindow) {
    mainWindow.show();
  }
};

const quitMainWindow = () => {
  isQuitting = true;
  app.quit();
};

const createMainWindow = () => {
  if (!mainWindow) {
    log.info('Creating the main window');

    const operatingSystem = process.platform; // supported values: darwin (mac), linux, win32 (this is also 64bit)

    // background must be white, see: https://github.com/electron/electron/issues/6344
    mainWindow = new BrowserWindow({
      width: 900,
      height: 500,
      minWidth: 900,
      minHeight: 500,
      backgroundColor: '#fff',
      frame: false,
      icon: path.join(__dirname, 'icons/1024x1024.png'),
      webPreferences: {
        nodeIntegration: true,
      },
    });

    mainWindow.loadURL(
      isDev
        ? 'http://localhost:3100'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );

    mainWindow.on('close', event => {
      if (
        !isQuitting &&
        operatingSystem === 'win32' &&
        settings.get().minimizeToTrayOnClose
      ) {
        event.preventDefault();
        mainWindow.hide();
        event.returnValue = false;
      }
    });

    mainWindow.on('closed', () => {
      if (xmppJsClient.client) {
        xmppJsClient.client.stop();
      }
      mainWindow = null;
    });

    // setup dev tools
    if (isDev) {
      mainWindow.webContents.openDevTools({
        detach: true,
      });

      app.setAppUserModelId(process.execPath);
    }

    // any messages with links open in browser, this is okay since
    // react is using hash router for routing and does not register as a link to
    // a new page. on develop localhost:3000 is ignored for reloads on save.
    mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
      if (!isDev || (isDev && !targetUrl.includes('localhost:3100'))) {
        event.preventDefault();
        shell.openExternal(targetUrl);
      }
    });
    mainWindow.webContents.on('new-window', (event, targetUrl) => {
      if (!isDev || (isDev && !targetUrl.includes('localhost:3100'))) {
        event.preventDefault();
        shell.openExternal(targetUrl);
      }
    });

    log.info('Main window has been created, now loading the React application');
    mainWindow.webContents.send('app-set', {
      hasUpdate: undefined,
      isCheckingForUpdate: true,
      isUpdateDownloaded: false,
      isAutoUpdateError: false,
    });
  }
};

module.exports = {
  getMainWindow,
  showMainWindow,
  quitMainWindow,
  createMainWindow,
};
