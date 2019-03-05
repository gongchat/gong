const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

import ISettings from 'src/interfaces/ISettings';
import ISettingsSaved from 'src/interfaces/ISettingsSaved';
import IState from 'src/interfaces/IState';

export default class Settings {
  // TODO: interface for payload?
  public static setAndSave = (state: IState, settings: any): IState => {
    let savedSettings: ISettingsSaved = electronStore.get('settings');
    savedSettings = {
      ...savedSettings,
      ...settings,
    };
    electronStore.set('settings', savedSettings);

    // TODO: breakout into separate function
    if (settings.minimizeToTrayOnClose !== undefined) {
      ipcRenderer.send('set-settings', {
        minimizeToTrayOnClose: settings.minimizeToTrayOnClose,
      });
    }

    return {
      ...state,
      settings: {
        ...state.settings,
        ...settings,
      },
    };
  };

  public static mapSettingsSavedToSettings = (
    settings: ISettingsSaved
  ): ISettings => {
    const mappedSettings: ISettings = {
      jid: settings.jid,
      domain: settings.domain,
      username: settings.username,
      resource: settings.resource,
      systemNotificationOnGroupchat: settings.systemNotificationOnGroupchat
        ? settings.systemNotificationOnGroupchat
        : 'never',
      systemNotificationOnMentionMe: settings.systemNotificationOnMentionMe
        ? settings.systemNotificationOnMentionMe
        : 'unread',
      systemNotificationOnChat: settings.systemNotificationOnChat
        ? settings.systemNotificationOnChat
        : 'unread',
      minimizeToTrayOnClose:
        settings.minimizeToTrayOnClose !== undefined
          ? settings.minimizeToTrayOnClose
          : true,
      renderVideos:
        settings.renderVideos !== undefined ? settings.renderVideos : true,
      renderGetYarn:
        settings.renderGetYarn !== undefined ? settings.renderGetYarn : true,
      renderImages:
        settings.renderImages !== undefined ? settings.renderImages : true,
      soundName: settings.soundName,
      playAudioOnGroupchat: settings.playAudioOnGroupchat,
      playAudioOnChat: settings.playAudioOnChat,
      playAudioOnMentionMe: settings.playAudioOnMentionMe,
      flashMenuBarOnGroupchat: settings.flashMenuBarOnGroupchat,
      flashMenuBarOnGroupchatFrequency:
        settings.flashMenuBarOnGroupchatFrequency,
      flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
      flashMenuBarOnMentionMeFrequency:
        settings.flashMenuBarOnMentionMeFrequency,
      flashMenuBarOnChat: settings.flashMenuBarOnChat,
      flashMenuBarOnChatFrequency: settings.flashMenuBarOnChatFrequency,
    };
    return mappedSettings;
  };

  public static mapSettingsToSettingsSaved = (
    settings: ISettings,
    password: string
  ): ISettingsSaved => {
    const mappedSettings: ISettingsSaved = {
      jid: settings.jid,
      domain: settings.domain,
      username: settings.username,
      resource: settings.resource,
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
      flashMenuBarOnGroupchatFrequency:
        settings.flashMenuBarOnGroupchatFrequency,
      flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
      flashMenuBarOnMentionMeFrequency:
        settings.flashMenuBarOnMentionMeFrequency,
      flashMenuBarOnChat: settings.flashMenuBarOnChat,
      flashMenuBarOnChatFrequency: settings.flashMenuBarOnChatFrequency,
      password,
    };
    return mappedSettings;
  };
}
