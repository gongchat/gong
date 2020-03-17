// App Events

ipcMain.on('app-check-for-updates', () => {
  checkForUpdates();
});

ipcMain.on('app-update', (event, arg) => {
  quitAndInstall();
});

ipcMain.on('app-get-info', event => {
  event.sender.send('app-set', {
    version: app.getVersion(),
    operatingSystem: process.platform,
  });
});
