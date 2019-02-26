import IChannel from 'src/interfaces/IChannel';
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

  public static setMenuBarNotificationOnMessage = (state: IState) => {
    const settings = state.settings;

    const groupChatUnreadMessages = state.channels
      .filter((channel: IChannel) => channel.type === 'groupchat')
      .reduce((a: number, channel: IChannel) => a + channel.unreadMessages, 0);

    const groupChatHasUnreadMentionMe = state.channels.filter(
      (channel: IChannel) => channel.hasUnreadMentionMe
    )
      ? true
      : false;

    const chatMessagesUnread = state.channels
      .filter((channel: IChannel) => channel.type === 'chat')
      .reduce((a: number, channel: IChannel) => a + channel.unreadMessages, 0);

    if (state.profile.status !== 'dnd') {
      if (
        settings.flashMenuBarOnGroupchatMessage !== 'never' &&
        ((settings.flashMenuBarOnGroupchatMessage === 'unread' &&
          groupChatUnreadMessages > 0) ||
          settings.flashMenuBarOnGroupchatMessage === 'always')
      ) {
        state.menuBarNotification = `${
          groupChatUnreadMessages > 0
            ? settings.flashMenuBarOnGroupchatMessageFrequency
            : 'once'
        },${new Date().getTime() + Math.random() + ''}`;
      }
      if (
        groupChatHasUnreadMentionMe &&
        settings.flashMenuBarOnMentionMe !== 'never' &&
        ((settings.flashMenuBarOnMentionMe === 'unread' &&
          groupChatUnreadMessages > 0) ||
          settings.flashMenuBarOnMentionMe === 'always')
      ) {
        state.menuBarNotification = `${
          groupChatUnreadMessages > 0
            ? settings.flashMenuBarOnMentionMeFrequency
            : 'once'
        },${new Date().getTime() + Math.random() + ''}`;
      }
      if (
        settings.flashMenuBarOnChatMessage !== 'never' &&
        ((settings.flashMenuBarOnChatMessage === 'unread' &&
          chatMessagesUnread > 0) ||
          settings.flashMenuBarOnChatMessage === 'always')
      ) {
        state.menuBarNotification = `${
          chatMessagesUnread > 0
            ? settings.flashMenuBarOnChatMessageFrequency
            : 'once'
        },${new Date().getTime() + Math.random() + ''}`;
      }
    }
  };

  public static setMenuBarNotificationOnChannelSelect = (state: IState) => {
    const settings = state.settings;

    const groupChatUnread = state.channels
      .filter((channel: IChannel) => channel.type === 'groupchat')
      .reduce((a: number, channel: IChannel) => a + channel.unreadMessages, 0);

    const hasUnreadMentionMe =
      state.channels.filter((channel: IChannel) => channel.hasUnreadMentionMe)
        .length > 0
        ? true
        : false;

    const chatUnread = state.channels
      .filter((channel: IChannel) => channel.type === 'chat')
      .reduce((a: number, channel: IChannel) => a + channel.unreadMessages, 0);

    if (groupChatUnread === 0 && chatUnread === 0) {
      state.menuBarNotification = '';
    } else {
      if (state.profile.status !== 'dnd') {
        if (
          groupChatUnread > 0 &&
          settings.flashMenuBarOnGroupchatMessageFrequency === 'repeat' &&
          settings.flashMenuBarOnGroupchatMessage !== 'never' &&
          ((settings.flashMenuBarOnGroupchatMessage === 'unread' &&
            groupChatUnread > 0) ||
            settings.flashMenuBarOnGroupchatMessage === 'always')
        ) {
          state.menuBarNotification = `${
            settings.flashMenuBarOnGroupchatMessageFrequency
          },${new Date().getTime() + Math.random() + ''}`;
        }
        if (
          groupChatUnread > 0 &&
          hasUnreadMentionMe &&
          settings.flashMenuBarOnMentionMeFrequency === 'repeat' &&
          settings.flashMenuBarOnMentionMe !== 'never' &&
          ((settings.flashMenuBarOnMentionMe === 'unread' &&
            groupChatUnread > 0) ||
            settings.flashMenuBarOnMentionMe === 'always')
        ) {
          state.menuBarNotification = `${
            settings.flashMenuBarOnMentionMeFrequency
          },${new Date().getTime() + Math.random() + ''}`;
        }
        if (
          chatUnread > 0 &&
          settings.flashMenuBarOnChatMessageFrequency === 'repeat' &&
          settings.flashMenuBarOnChatMessage !== 'never' &&
          ((settings.flashMenuBarOnChatMessage === 'unread' &&
            chatUnread > 0) ||
            settings.flashMenuBarOnChatMessage === 'always')
        ) {
          state.menuBarNotification = `${
            settings.flashMenuBarOnChatMessageFrequency
          },${new Date().getTime() + Math.random() + ''}`;
        }
      }
    }
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
          message.isMentioningMe &&
          settings.playAudioOnMentionMe !== 'never' &&
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
