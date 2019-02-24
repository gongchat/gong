import IMessage from 'src/interfaces/IMessage';
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

export default class Notification {
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

  public static playAudio = (soundName: string) => {
    const sound = SOUNDS.find((s: any) => s.name === soundName);
    if (sound) {
      const audio = new Audio(`./audio/${sound.fileName}`);
      audio.volume = 1;
      audio.play();
    }
  };

  public static playAudioOnMessage = (
    state: IState,
    message: IMessage,
    type: string,
    isUnread: boolean
  ) => {
    if (Notification.shouldPlayAudio(state, message, type, isUnread)) {
      Notification.playAudio(state.settings.soundName);
    }
  };
}
