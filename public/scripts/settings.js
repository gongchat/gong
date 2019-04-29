class Settings {
  constructor() {
    this.settings = {};
  }

  set(settings) {
    if (settings.minimizeToTrayOnClose !== undefined) {
      this.settings.minimizeToTrayOnClose = settings.minimizeToTrayOnClose;
    }
  }

  get() {
    return this.settings;
  }
}

// Singleton
const instance = new Settings();
Object.freeze(instance);
module.exports = instance;
