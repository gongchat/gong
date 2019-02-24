const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

import ISettings from 'src/interfaces/ISettings';
import ISettingsSaved from 'src/interfaces/ISettingsSaved';
import IState from 'src/interfaces/IState';

export default class Settings {
  // TODO: interface for payload?
  public static setSettings = (state: IState, settings: any): IState => {
    let savedSettings: ISettingsSaved = electronStore.get('settings');
    savedSettings = {
      ...savedSettings,
      soundName: settings.soundName,
      playAudioOnGroupchatMessage: settings.playAudioOnGroupchatMessage,
      playAudioOnChatMessage: settings.playAudioOnChatMessage,
      playAudioOnMentionMe: settings.playAudioOnMentionMe,
    };
    electronStore.set('settings', savedSettings);

    return {
      ...state,
      settings: {
        ...state.settings,
        soundName: settings.soundName,
        playAudioOnGroupchatMessage: settings.playAudioOnGroupchatMessage,
        playAudioOnChatMessage: settings.playAudioOnChatMessage,
        playAudioOnMentionMe: settings.playAudioOnMentionMe,
      },
    };
  };

  public static mapSettingsSavedToSettings = (
    settings: ISettingsSaved
  ): ISettings => {
    const mappedSettings: ISettings = {
      jid: settings.jid,
      domain: settings.domain,
      name: settings.name,
      username: settings.username,
      resource: settings.resource,
      soundName: settings.soundName,
      playAudioOnGroupchatMessage: settings.playAudioOnGroupchatMessage,
      playAudioOnChatMessage: settings.playAudioOnChatMessage,
      playAudioOnMentionMe: settings.playAudioOnMentionMe,
      flashMenuBarOnGroupchatMessage: settings.flashMenuBarOnGroupchatMessage,
      flashMenuBarOnGroupchatMessageFrequency:
        settings.flashMenuBarOnGroupchatMessageFrequency,
      flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
      flashMenuBarOnMentionMeFrequency:
        settings.flashMenuBarOnMentionMeFrequency,
      flashMenuBarOnChatMessage: settings.flashMenuBarOnChatMessage,
      flashMenuBarOnChatMessageFrequency:
        settings.flashMenuBarOnChatMessageFrequency,
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
      name: settings.name,
      username: settings.username,
      resource: settings.resource,
      soundName: settings.soundName,
      playAudioOnGroupchatMessage: settings.playAudioOnGroupchatMessage,
      playAudioOnChatMessage: settings.playAudioOnChatMessage,
      playAudioOnMentionMe: settings.playAudioOnMentionMe,
      flashMenuBarOnGroupchatMessage: settings.flashMenuBarOnGroupchatMessage,
      flashMenuBarOnGroupchatMessageFrequency:
        settings.flashMenuBarOnGroupchatMessageFrequency,
      flashMenuBarOnMentionMe: settings.flashMenuBarOnMentionMe,
      flashMenuBarOnMentionMeFrequency:
        settings.flashMenuBarOnMentionMeFrequency,
      flashMenuBarOnChatMessage: settings.flashMenuBarOnChatMessage,
      flashMenuBarOnChatMessageFrequency:
        settings.flashMenuBarOnChatMessageFrequency,
      password,
    };
    return mappedSettings;
  };
}
