const ElectronStore = require('electron-store');
const electronStore = new ElectronStore();

class Logger {
  log() {
    electronStore.set();
  }

  get() {
    electronStore.get();
  }
}
