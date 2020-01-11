const { app, BrowserWindow, Menu, Tray, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const debug = require('electron-debug');
debug({ enabled: true, showDevTools: false });

const isDev = require('electron-is-dev');

// TODO: electron-devtools-installer currently does not support electron 7+. Reference: https://github.com/MarshallOfSound/electron-devtools-installer/issues/122
// const {
//   default: installExtension,
//   REACT_DEVELOPER_TOOLS,
//   REDUX_DEVTOOLS,
// } = require('electron-devtools-installer');

const operatingSystem = process.platform; // supported values: darwin (mac), linux, win32 (this is also 64bit)
const path = require('path');

const xmppJsClient = require('./scripts/xmppJsClient');
const ipcMainEvents = require('./scripts/ipcMainEvents');
const settings = require('./scripts/settings');

let mainWindow;
let tray;
let isQuitting;

// only allow once instance of Gong
const isLocked = app.requestSingleInstanceLock();
if (!isLocked) {
  app.quit();
} else {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
}

// Allows audio to play before interacting with the window, see: https://github.com/electron/electron/issues/13525#issuecomment-410923391
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

ipcMainEvents.attachEvents(app, xmppJsClient, autoUpdater);
autoUpdater.logger = log;
log.info('App starting...');

function createWindow() {
  log.info('Creating the main window');
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
      operatingSystem === 'win32' &&
      !isQuitting &&
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

  log.info('Main window has been created');
}

function createTray() {
  log.info('Creating system tray');
  tray = new Tray(path.join(__dirname, '/icons/16x16.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Gong',
      click: function() {
        mainWindow.show();
      },
    },
    {
      label: 'Check for Updates',
      click: function() {
        autoUpdater.checkForUpdates();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Gong',
      click: function() {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.on('double-click', () => {
    mainWindow.show();
  });
  tray.setToolTip('Gong');
  tray.setContextMenu(contextMenu);
  log.info('System tray created');
}

app.on('before-quit', function() {
  isQuitting = true;
  tray = null;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
  if (tray === null) {
    createTray();
  }
});

app.on('ready', () => {
  log.info('Loading React');
  createWindow();

  if (operatingSystem === 'win32') {
    app.setAppUserModelId('com.gongchat.gong');
    createTray();
  }

  // TODO: electron-devtools-installer currently does not support electron 7+. Reference: https://github.com/MarshallOfSound/electron-devtools-installer/issues/122
  // [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
  //   installExtension(extension.id)
  //     .then(name => console.log(`Added Extension:  ${name}`))
  //     .catch(err => console.log('An error occurred: ', err));
  // });
});

//
// Auto Updater
//

autoUpdater.on('checking-for-update', () => {
  // mainWindow.webContents.send('app-set', { });
});
autoUpdater.on('update-available', (ev, info) => {
  mainWindow.webContents.send('app-set', {
    hasUpdate: true,
    isCheckingForUpdate: false,
    isUpdateDownloaded: false,
    isAutoUpdateError: false,
    lastDateTimeUpdatedChecked: new Date(),
  });
});
autoUpdater.on('update-not-available', (ev, info) => {
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
  mainWindow.webContents.send('app-set', {
    hasUpdate: undefined,
    isCheckingForUpdate: false,
    isUpdateDownloaded: false,
    isAutoUpdateError: true,
    lastDateTimeUpdatedChecked: new Date(),
  });
});
autoUpdater.on('update-downloaded', (event, info) => {
  mainWindow.webContents.send('app-set', {
    hasUpdate: true,
    isCheckingForUpdate: false,
    isUpdateDownloaded: true,
    isAutoUpdateError: false,
  });
});

app.on('ready', () => {
  log.info('Checking for updates');
  mainWindow.webContents.send('app-set', {
    hasUpdate: undefined,
    isCheckingForUpdate: true,
    isUpdateDownloaded: false,
    isAutoUpdateError: false,
  });
  autoUpdater.checkForUpdates();
});
