const path = require('path');

const { app, Menu, Tray } = require('electron');
const log = require('electron-log');

const { checkForUpdates } = require('./autoUpdater');
const { showMainWindow, quitMainWindow } = require('./mainWindow');
const xmppJsClient = require('./xmppJsClient');

let tray = null;

const createTray = () => {
  const operatingSystem = process.platform; // supported values: darwin (mac), linux, win32 (this is also 64bit)

  if (!tray && operatingSystem === 'win32') {
    app.setAppUserModelId('com.gongchat.gong');
    log.info('Creating system tray');
    tray = new Tray(path.join(__dirname, '../icons/16x16.png'));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Gong',
        click: () => {
          showMainWindow();
        },
      },
      {
        label: 'Set status',
        submenu: [
          {
            label: 'Online',
            click: () => {
              xmppJsClient.sendMyStatus({ status: 'online', statusText: '' });
            },
          },
          {
            label: 'Chatty',
            click: () => {
              xmppJsClient.sendMyStatus({ status: 'chat', statusText: '' });
            },
          },
          {
            label: 'Away',
            click: () => {
              xmppJsClient.sendMyStatus({ status: 'away', statusText: '' });
            },
          },
          {
            label: 'Extended Away',
            click: () => {
              xmppJsClient.sendMyStatus({ status: 'xa', statusText: '' });
            },
          },
          {
            label: 'Do not Disturb',
            click: () => {
              xmppJsClient.sendMyStatus({ status: 'dnd', statusText: '' });
            },
          },
        ],
      },
      {
        label: 'Check for Updates',
        click: () => {
          checkForUpdates();
        },
      },
      { type: 'separator' },
      {
        label: 'Quit Gong',
        click: () => {
          quitMainWindow();
        },
      },
    ]);
    tray.on('double-click', () => {
      showMainWindow();
    });
    tray.setToolTip('Gong');
    tray.setContextMenu(contextMenu);
    log.info('System tray created');
  }
};

const removeTray = () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
};

module.exports = {
  createTray,
  removeTray,
};
