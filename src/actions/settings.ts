import ISettings from '../interfaces/ISettings';
import ISettingsSaved from '../interfaces/ISettingsSaved';
import IState from '../interfaces/IState';

const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

export const settingsActions = {
  toggleShowSettings(state: IState): IState {
    return { ...state, showSettings: !state.showSettings };
  },
  setAndSaveSettings(settings: any, state: IState): IState {
    let savedSettings: ISettingsSaved = electronStore.get('settings');
    savedSettings = {
      ...savedSettings,
      ...settings,
    };
    electronStore.set('settings', savedSettings);
    sendSettingsToElectron(settings);
    return {
      ...state,
      settings: {
        ...state.settings,
        ...settings,
      },
    };
  },
};

export const defaultSettings: ISettings = {
  jid: '',
  domain: '',
  username: '',
  resource: '',
  port: '',
  minimizeToTrayOnClose: true,
  renderVideos: true,
  renderGetYarn: true,
  renderImages: true,
  soundName: 'Gong 1',
  soundVolume: 5,
  playAudioOnGroupchat: 'never',
  playAudioOnMentionMe: 'always',
  playAudioOnChat: 'unread',
  systemNotificationOnGroupchat: 'never',
  systemNotificationOnMentionMe: 'unread',
  systemNotificationOnChat: 'unread',
  flashFrameOnGroupchat: 'never',
  flashFrameOnMentionMe: 'unread',
  flashFrameOnChat: 'unread',
  flashMenuBarOnGroupchat: 'unread',
  flashMenuBarOnGroupchatFrequency: 'once',
  flashMenuBarOnMentionMe: 'unread',
  flashMenuBarOnMentionMeFrequency: 'once',
  flashMenuBarOnChat: 'unread',
  flashMenuBarOnChatFrequency: 'once',
};

export const mapSettingsSavedToSettings = (
  settings: ISettingsSaved
): ISettings => {
  const mappedSettings: ISettings = {
    jid: settings.jid,
    domain: settings.domain,
    username: settings.username,
    resource: settings.resource,
    port: settings.port,
    systemNotificationOnGroupchat: settings.systemNotificationOnGroupchat,
    systemNotificationOnMentionMe: settings.systemNotificationOnMentionMe,
    systemNotificationOnChat: settings.systemNotificationOnChat,
    minimizeToTrayOnClose: settings.minimizeToTrayOnClose,
    renderVideos: settings.renderVideos,
    renderGetYarn: settings.renderGetYarn,
    renderImages: settings.renderImages,
    soundName: settings.soundName,
    soundVolume:
      settings.soundVolume === undefined
        ? defaultSettings.soundVolume
        : settings.soundVolume,
    // play audio
    playAudioOnGroupchat: settings.playAudioOnGroupchat,
    playAudioOnChat: settings.playAudioOnChat,
    playAudioOnMentionMe:
      settings.playAudioOnMentionMe === 'all'
        ? 'always'
        : settings.playAudioOnMentionMe,
    // flash frame
    flashFrameOnGroupchat:
      settings.flashFrameOnGroupchat === undefined
        ? defaultSettings.flashFrameOnGroupchat
        : settings.flashFrameOnGroupchat === 'always'
        ? 'unread'
        : settings.flashFrameOnGroupchat,
    flashFrameOnChat:
      settings.flashFrameOnChat === undefined
        ? defaultSettings.flashFrameOnChat
        : settings.flashFrameOnChat === 'always'
        ? 'unread'
        : settings.flashFrameOnChat,
    flashFrameOnMentionMe:
      settings.flashFrameOnMentionMe === undefined
        ? defaultSettings.flashFrameOnMentionMe
        : settings.flashFrameOnMentionMe === 'always'
        ? 'unread'
        : settings.flashFrameOnMentionMe,
    // flash menu bar
    flashMenuBarOnGroupchat: settings.flashMenuBarOnGroupchat,
    flashMenuBarOnGroupchatFrequency: settings.flashMenuBarOnGroupchatFrequency,
    flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
    flashMenuBarOnMentionMeFrequency: settings.flashMenuBarOnMentionMeFrequency,
    flashMenuBarOnChat: settings.flashMenuBarOnChat,
    flashMenuBarOnChatFrequency: settings.flashMenuBarOnChatFrequency,
  };
  return mappedSettings;
};

const sendSettingsToElectron = (settings: ISettings) => {
  if (settings.minimizeToTrayOnClose !== undefined) {
    ipcRenderer.send('set-settings', {
      minimizeToTrayOnClose: settings.minimizeToTrayOnClose,
    });
  }
};
