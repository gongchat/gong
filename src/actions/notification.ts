import IChannel from 'src/interfaces/IChannel';
import IMessage from 'src/interfaces/IMessage';
import ISnackbarNotifications from 'src/interfaces/ISnackbarNotification';
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

export default class Notifications {
  public static addToSnackbar = (
    state: IState,
    notification: ISnackbarNotifications
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
        (notification: ISnackbarNotifications) => notification.id !== id
      ),
    };
  };

  public static handleOnMessage = (
    state: IState,
    message: IMessage,
    type: string,
    rawText: string
  ) => {
    Notifications.playAudioOnMessage(state, message, type);
    Notifications.sendSystemNotificationOnMessage(
      state,
      message,
      type,
      rawText
    );
    Notifications.setMenuBarNotificationOnMessage(state, message);
  };

  public static playAudio = (soundName: string) => {
    const sound = SOUNDS.find((s: any) => s.name === soundName);
    if (sound) {
      const audio = new Audio(`./audio/${sound.fileName}`);
      audio.volume = 1;
      audio.play();
    }
  };

  public static setMenuBarNotificationOnChannelSelect = (state: IState) => {
    let frequency = '';
    const key = new Date().getTime() + Math.random() + '';
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
          settings.flashMenuBarOnGroupchatFrequency === 'repeat' &&
          settings.flashMenuBarOnGroupchat !== 'never' &&
          ((settings.flashMenuBarOnGroupchat === 'unread' &&
            groupChatUnread > 0) ||
            settings.flashMenuBarOnGroupchat === 'always')
        ) {
          frequency = settings.flashMenuBarOnGroupchatFrequency;
        }
        if (
          frequency !== 'repeat' &&
          groupChatUnread > 0 &&
          hasUnreadMentionMe &&
          settings.flashMenuBarOnMentionMeFrequency === 'repeat' &&
          settings.flashMenuBarOnMentionMe !== 'never' &&
          ((settings.flashMenuBarOnMentionMe === 'unread' &&
            groupChatUnread > 0) ||
            settings.flashMenuBarOnMentionMe === 'always')
        ) {
          frequency = settings.flashMenuBarOnMentionMeFrequency;
        }
        if (
          frequency !== 'repeat' &&
          chatUnread > 0 &&
          settings.flashMenuBarOnChatFrequency === 'repeat' &&
          settings.flashMenuBarOnChat !== 'never' &&
          ((settings.flashMenuBarOnChat === 'unread' && chatUnread > 0) ||
            settings.flashMenuBarOnChat === 'always')
        ) {
          frequency = settings.flashMenuBarOnChatFrequency;
        }
        if (frequency !== '') {
          state.menuBarNotification = `${frequency},${key}`;
        } else {
          state.menuBarNotification = '';
        }
      }
    }
  };

  private static shouldPlayAudio = (
    state: IState,
    message: IMessage,
    type: string
  ): boolean => {
    const settings = state.settings;
    if (!message.isHistory && state.profile.status !== 'dnd') {
      // Group chat
      if (type === 'groupchat') {
        // on message
        if (
          settings.playAudioOnGroupchat !== 'never' &&
          ((settings.playAudioOnGroupchat === 'unread' && !message.isRead) ||
            settings.playAudioOnGroupchat === 'always')
        ) {
          return true;
        }
        // on mention
        if (
          message.isMentioningMe &&
          settings.playAudioOnMentionMe !== 'never' &&
          ((settings.playAudioOnMentionMe === 'unread' && !message.isRead) ||
            settings.playAudioOnMentionMe === 'always')
        ) {
          return true;
        }
      }
      // one on one chat
      if (type === 'chat') {
        if (
          settings.playAudioOnChat !== 'never' &&
          ((settings.playAudioOnChat === 'unread' && !message.isRead) ||
            settings.playAudioOnChat === 'always')
        ) {
          return true;
        }
      }
    }
    return false;
  };

  private static playAudioOnMessage = (
    state: IState,
    message: IMessage,
    type: string
  ) => {
    if (Notifications.shouldPlayAudio(state, message, type)) {
      Notifications.playAudio(state.settings.soundName);
    }
  };

  private static shouldSendSystemNotifications = (
    state: IState,
    message: IMessage,
    type: string
  ): boolean => {
    const settings = state.settings;
    if (!message.isHistory && state.profile.status !== 'dnd') {
      // Group chat
      if (type === 'groupchat') {
        // on message
        if (
          settings.systemNotificationOnGroupchat !== 'never' &&
          ((settings.systemNotificationOnGroupchat === 'unread' &&
            !message.isRead) ||
            settings.systemNotificationOnGroupchat === 'always')
        ) {
          return true;
        }
        // on mention
        if (
          message.isMentioningMe &&
          settings.systemNotificationOnMentionMe !== 'never' &&
          ((settings.systemNotificationOnMentionMe === 'unread' &&
            !message.isRead) ||
            settings.systemNotificationOnMentionMe === 'always')
        ) {
          return true;
        }
      }
      // one on one chat
      if (type === 'chat') {
        if (
          settings.systemNotificationOnChat !== 'never' &&
          ((settings.systemNotificationOnChat === 'unread' &&
            !message.isRead) ||
            settings.systemNotificationOnChat === 'always')
        ) {
          return true;
        }
      }
    }
    return false;
  };

  private static sendSystemNotificationOnMessage = (
    state: IState,
    message: IMessage,
    type: string,
    rawText: string
  ) => {
    if (Notifications.shouldSendSystemNotifications(state, message, type)) {
      const myNotifications = new Notification(message.userNickname, {
        body: rawText,
      });
      myNotifications.onclick = () => {
        // TODO: https://github.com/electron/electron/issues/2867
        // TODO: need to select the channel the message came from
        const win = window.require('electron').remote.getCurrentWindow();
        win.setAlwaysOnTop(true);
        win.focus();
        win.setAlwaysOnTop(false);
      };
    }
  };

  private static setMenuBarNotificationOnMessage = (
    state: IState,
    message: IMessage
  ) => {
    let frequency = '';
    const key = new Date().getTime() + Math.random() + '';
    const settings = state.settings;
    const groupChatUnreadMessages = state.channels
      .filter((channel: IChannel) => channel.type === 'groupchat')
      .reduce((a: number, channel: IChannel) => a + channel.unreadMessages, 0);
    const groupChatHasUnreadMentionMe =
      state.channels.filter((channel: IChannel) => channel.hasUnreadMentionMe)
        .length === 0
        ? false
        : true;
    const chatMessagesUnread = state.channels
      .filter((channel: IChannel) => channel.type === 'chat')
      .reduce((a: number, channel: IChannel) => a + channel.unreadMessages, 0);

    if (state.profile.status !== 'dnd') {
      if (
        settings.flashMenuBarOnGroupchat !== 'never' &&
        ((settings.flashMenuBarOnGroupchat === 'unread' &&
          groupChatUnreadMessages > 0 &&
          !message.isRead) ||
          settings.flashMenuBarOnGroupchat === 'always')
      ) {
        frequency =
          groupChatUnreadMessages > 0
            ? settings.flashMenuBarOnGroupchatFrequency
            : 'once';
      }
      if (
        frequency !== 'repeat' &&
        groupChatHasUnreadMentionMe &&
        settings.flashMenuBarOnMentionMe !== 'never' &&
        ((settings.flashMenuBarOnMentionMe === 'unread' &&
          groupChatUnreadMessages > 0 &&
          !message.isRead) ||
          settings.flashMenuBarOnMentionMe === 'always')
      ) {
        frequency =
          groupChatUnreadMessages > 0
            ? settings.flashMenuBarOnMentionMeFrequency
            : 'once';
      }
      if (
        frequency !== 'repeat' &&
        settings.flashMenuBarOnChat !== 'never' &&
        ((settings.flashMenuBarOnChat === 'unread' &&
          chatMessagesUnread > 0 &&
          !message.isRead) ||
          settings.flashMenuBarOnChat === 'always')
      ) {
        frequency =
          chatMessagesUnread > 0
            ? settings.flashMenuBarOnChatFrequency
            : 'once';
      }
      if (frequency !== '') {
        state.menuBarNotification = `${frequency},${key}`;
      } else {
        state.menuBarNotification = '';
      }
    }
  };
}
