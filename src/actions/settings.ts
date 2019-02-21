const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

import IMessage from 'src/interfaces/IMessage';
import ISettings from 'src/interfaces/ISettings';
import ISettingsSaved from 'src/interfaces/ISettingsSaved';
import ISnackbarNotification from 'src/interfaces/ISnackbarNotification';
import IState from 'src/interfaces/IState';

export const SOUNDS = [
  {
    name: 'Gong 1',
    fileName: '56241__q-k__gong-center-mute.wav',
  },
  {
    name: 'Gong 2',
    fileName: '94199__peter-lustig__sch-03-stumpf.wav',
  },
  {
    name: 'Wow',
    fileName: 'wowc.mp3',
  },
];

export default class Settings {
  public static addToSnackbar = (
    state: IState,
    notification: ISnackbarNotification
  ): IState => {
    return {
      ...state,
      snackbarNotifications: [...state.snackbarNotifications, notification],
    };
  };

  public static removeFromSnackbar = (state: IState, id: string): IState => {
    return {
      ...state,
      snackbarNotifications: state.snackbarNotifications.filter(
        (notification: ISnackbarNotification) => notification.id !== id
      ),
    };
  };

  public static shouldFlashMenuBar = (
    state: IState,
    message: IMessage,
    type: string,
    isUnread: boolean
  ): string => {
    // TODO: This is still in development

    const settings = state.settings;
    if (!message.isHistory && state.profile.status !== 'dnd') {
      if (type === 'groupchat') {
        if (
          settings.flashMenuBarOnGroupchatMessage !== 'never' &&
          ((settings.flashMenuBarOnGroupchatMessage === 'unread' && isUnread) ||
            settings.flashMenuBarOnGroupchatMessage === 'always')
        ) {
          return settings.flashMenuBarOnGroupchatMessageFrequency;
        }
        if (
          settings.flashMenuBarOnMentionMe !== 'never' &&
          ((settings.flashMenuBarOnMentionMe === 'unread' && isUnread) ||
            settings.flashMenuBarOnMentionMe === 'always')
        ) {
          return settings.flashMenuBarOnChatMessageFrequency;
        }
      }
      if (type === 'chat') {
        if (
          settings.flashMenuBarOnChatMessage !== 'never' &&
          ((settings.flashMenuBarOnChatMessage === 'unread' && isUnread) ||
            settings.flashMenuBarOnChatMessage === 'always')
        ) {
          return settings.flashMenuBarOnChatMessageFrequency;
        }
      }
    }

    return '';
  };

  public static shouldPlayAudio = (
    state: IState,
    message: IMessage,
    type: string,
    isUnread: boolean
  ): boolean => {
    const settings = state.settings;
    if (!message.isHistory && state.profile.status !== 'dnd') {
      // Group chat
      if (type === 'groupchat') {
        // on message
        if (
          settings.playAudioOnGroupchatMessage !== 'never' &&
          ((settings.playAudioOnGroupchatMessage === 'unread' && isUnread) ||
            settings.playAudioOnGroupchatMessage === 'always')
        ) {
          return true;
        }
        // on mention
        if (
          settings.playAudioOnMentionMe !== 'never' &&
          message.isMentioningMe &&
          ((settings.playAudioOnMentionMe === 'unread' && isUnread) ||
            settings.playAudioOnMentionMe === 'always')
        ) {
          return true;
        }
      }
      // one on one chat
      if (type === 'chat') {
        if (
          settings.playAudioOnChatMessage !== 'never' &&
          ((settings.playAudioOnChatMessage === 'unread' && isUnread) ||
            settings.playAudioOnChatMessage === 'always')
        ) {
          return true;
        }
      }
    }
    return false;
  };

  public static playAudio = (
    state: IState,
    message: IMessage,
    type: string,
    isUnread: boolean
  ) => {
    if (Settings.shouldPlayAudio(state, message, type, isUnread)) {
      const sound = SOUNDS.find(
        (s: any) => s.name === state.settings.soundName
      );
      if (sound) {
        const audio = new Audio(`/audio/${sound.fileName}`);
        audio.volume = 1;
        audio.play();
      }
    }
  };

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
