const electron = require('electron');
const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const isDev = require('electron-is-dev');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

const path = require('path');
const url = require('url');

const XmppJsClient = require('./scripts/xmppJsClient');
const IpcMainEvents = require('./scripts/ipcMainEvents');
const Settings = require('./scripts/settings');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

const xmppJsClient = new XmppJsClient();
const ipcMainEvents = new IpcMainEvents();

let mainWindow;
let tray;
let isQuitting;

ipcMainEvents.attachEvents(xmppJsClient);

function createWindow() {
  // background must be white, see: https://github.com/electron/electron/issues/6344
  mainWindow = new BrowserWindow({
    width: 900,
    height: 500,
    minWidth: 900,
    minHeight: 500,
    backgroundColor: '#fff',
    frame: false,
    icon: path.join(__dirname, 'icons/1024x1024.png'),
  });

  mainWindow.loadURL(
    isDev ?
    'http://localhost:3000' :
    `file://${path.join(__dirname, '../build/index.html')}`
  );

  mainWindow.on('close', (event) => {
    if (Settings.get().minimizeToTrayOnClose && !isQuitting) {
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

  if (isDev) {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
      installExtension(extension.id)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    });

    mainWindow.webContents.openDevTools({
      detach: true,
    });

    app.setAppUserModelId(process.execPath);
  }

  // any messages with links open in browser, this is okay since
  // react is using hash router for routing and does not register as a link to 
  // a new page. on develop localhost:3000 is ignored for reloads on save.
  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    if (!isDev || (isDev && !targetUrl.includes('localhost:3000'))) {
      event.preventDefault();
      electron.shell.openExternal(targetUrl);
    }
  });
  mainWindow.webContents.on('new-window', (event, targetUrl) => {
    if (!isDev || (isDev && !targetUrl.includes('localhost:3000'))) {
      event.preventDefault();
      electron.shell.openExternal(targetUrl);
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'icons/16x16.png'));
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Quit Gong',
    click: function() {
      isQuitting = true;
      app.quit();
    }
  }, ]);
  tray.on('double-click', () => {
    mainWindow.show();
  });
  tray.setToolTip('Gong');
  tray.setContextMenu(contextMenu);
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
  createWindow();
  createTray();
});

//
// Auto Updater
//

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('app-set', { hasUpdate: true });
});
autoUpdater.on('update-available', (ev, info) => {
  mainWindow.webContents.send('app-set', { hasUpdate: true });
});
autoUpdater.on('update-not-available', (ev, info) => {
  mainWindow.webContents.send('app-set', { hasUpdate: false });
});
autoUpdater.on('error', (event, error) => {
  console.log('error'); // TODO: setup a messaging system
});
autoUpdater.on('update-downloaded', (event, info) => {
  mainWindow.webContents.send('app-set', {
    hasUpdate: true,
    isUpdateDownloaded: true
  });
});

app.on('ready', () => {
  autoUpdater.checkForUpdates();
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('app-set', { version: app.getVersion() });
  });
});
