const { app } = require('electron');

const { getMainWindow } = require('./mainWindow');

const beforeLoad = () => {
  // Allows audio to play before interacting with the window
  // See: https://github.com/electron/electron/issues/13525#issuecomment-410923391
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

  // Only allow once instance of Gong
  const isLocked = app.requestSingleInstanceLock();
  if (!isLocked) {
    app.quit();
  } else {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  }
};

module.exports = {
  beforeLoad,
};
