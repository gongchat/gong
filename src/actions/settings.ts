const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

import ISettings from 'src/interfaces/ISettings';
import ISettingsSaved from 'src/interfaces/ISettingsSaved';
import IState from 'src/interfaces/IState';

export const settingsActions = {
  // TODO: interface for payload?
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

    // TODO: breakout into separate function
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
    playAudioOnGroupchat: settings.playAudioOnGroupchat,
    playAudioOnChat: settings.playAudioOnChat,
    playAudioOnMentionMe: settings.playAudioOnMentionMe,
    flashMenuBarOnGroupchat: settings.flashMenuBarOnGroupchat,
    flashMenuBarOnGroupchatFrequency: settings.flashMenuBarOnGroupchatFrequency,
    flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
    flashMenuBarOnMentionMeFrequency: settings.flashMenuBarOnMentionMeFrequency,
    flashMenuBarOnChat: settings.flashMenuBarOnChat,
    flashMenuBarOnChatFrequency: settings.flashMenuBarOnChatFrequency,
  };
  return mappedSettings;
};

const mapSettingsToSettingsSaved = (
  settings: ISettings,
  password: string
): ISettingsSaved => {
  const mappedSettings: ISettingsSaved = {
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
    playAudioOnGroupchat: settings.playAudioOnGroupchat,
    playAudioOnChat: settings.playAudioOnChat,
    playAudioOnMentionMe: settings.playAudioOnMentionMe,
    flashMenuBarOnGroupchat: settings.flashMenuBarOnGroupchat,
    flashMenuBarOnGroupchatFrequency: settings.flashMenuBarOnGroupchatFrequency,
    flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
    flashMenuBarOnMentionMeFrequency: settings.flashMenuBarOnMentionMeFrequency,
    flashMenuBarOnChat: settings.flashMenuBarOnChat,
    flashMenuBarOnChatFrequency: settings.flashMenuBarOnChatFrequency,
    password,
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
