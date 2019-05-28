import IChannel from '../interfaces/IChannel';
import IMessage from '../interfaces/IMessage';
import ISnackbarNotifications from '../interfaces/ISnackbarNotification';
import IState from '../interfaces/IState';

export const SOUNDS = [
  { name: '!', fileName: '!.mp3' },
  { name: '140.85', fileName: '140.85.mp3' },
  { name: 'AWP', fileName: 'awp.mp3' },
  { name: 'AYAYA', fileName: 'ayaya.mp3' },
  { name: 'AYAYA AYAYA', fileName: 'ayaya-ayaya.mp3' },
  { name: 'Chewbacca', fileName: 'chewbacca.mp3' },
  { name: 'Gong 1', fileName: 'gong-1.wav' },
  { name: 'Gong 2', fileName: 'gong-2.wav' },
  { name: 'Hey! Listen', fileName: 'hey-listen.mp3' },
  { name: 'Meow', fileName: 'meow.wav' },
  { name: 'Minecraft Exp Orb', fileName: 'minecraft-exp-orb.mp3' },
  { name: 'Pleased Vader', fileName: 'pleased-vader.mp3' },
  { name: 'Rare Candy', fileName: 'rare-candy.mp3' },
  { name: 'Street Fighter Coin', fileName: 'street-fighter-coin.mp3' },
  { name: 'Work Work', fileName: 'work-work.mp3' },
  { name: 'Wow', fileName: 'wowc.mp3' },
  { name: 'XP Error', fileName: 'xp-error.mp3' },
  { name: 'Yahoo', fileName: 'yahoo.wav' },
];

export const notificationActions = {
  addToSnackbar(notification: ISnackbarNotifications, state: IState): IState {
    return {
      ...state,
      snackbarNotifications: [...state.snackbarNotifications, notification],
    };
  },
  removeFromSnackbar(id: string, state: IState): IState {
    return {
      ...state,
      snackbarNotifications: state.snackbarNotifications.filter(
        (notification: ISnackbarNotifications) => notification.id !== id
      ),
    };
  },
};

export const handleOnMessage = (
  state: IState,
  message: IMessage,
  type: string,
  rawText: string
) => {
  playAudioOnMessage(state, message, type);
  sendSystemNotificationOnMessage(state, message, type, rawText);
  setMenuBarNotificationOnMessage(state, message);
  flashFrameOnMessage(state, message, type);
};

export const playAudio = (soundName: string, volume: number) => {
  const sound = SOUNDS.find((s: any) => s.name === soundName);
  if (sound) {
    const audio = new Audio(`./audio/${sound.fileName}`);
    audio.volume = volume / 10;
    audio.play();
  }
};

export const setMenuBarNotificationOnChannelSelect = (state: IState) => {
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

const shouldPlayAudio = (
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
        ((settings.playAudioOnGroupchat === 'unread' &&
          (!message.isRead || !document.hasFocus())) ||
          settings.playAudioOnGroupchat === 'always')
      ) {
        return true;
      }
      // on mention
      if (
        message.isMentioningMe &&
        settings.playAudioOnMentionMe !== 'never' &&
        ((settings.playAudioOnMentionMe === 'unread' &&
          (!message.isRead || !document.hasFocus())) ||
          settings.playAudioOnMentionMe === 'always')
      ) {
        return true;
      }
    }
    // one on one chat
    if (type === 'chat') {
      if (
        settings.playAudioOnChat !== 'never' &&
        ((settings.playAudioOnChat === 'unread' &&
          (!message.isRead || !document.hasFocus())) ||
          settings.playAudioOnChat === 'always')
      ) {
        return true;
      }
    }
  }
  return false;
};

const playAudioOnMessage = (state: IState, message: IMessage, type: string) => {
  if (shouldPlayAudio(state, message, type)) {
    playAudio(state.settings.soundName, state.settings.soundVolume);
  }
};

const shouldFlashFrame = (
  state: IState,
  message: IMessage,
  type: string
): boolean => {
  const settings = state.settings;
  if (!message.isHistory && !message.isMe && state.profile.status !== 'dnd') {
    // Group chat
    if (type === 'groupchat') {
      // on message
      if (
        settings.flashFrameOnGroupchat !== 'never' &&
        (settings.flashFrameOnGroupchat === 'unread' &&
          (!message.isRead || !document.hasFocus()))
      ) {
        return true;
      }
      // on mention
      if (
        message.isMentioningMe &&
        settings.flashFrameOnMentionMe !== 'never' &&
        (settings.flashFrameOnMentionMe === 'unread' &&
          (!message.isRead || !document.hasFocus()))
      ) {
        return true;
      }
    }
    // one on one chat
    if (type === 'chat') {
      if (
        settings.flashFrameOnChat !== 'never' &&
        (settings.flashFrameOnChat === 'unread' &&
          (!message.isRead || !document.hasFocus()))
      ) {
        return true;
      }
    }
  }
  return false;
};

const flashFrameOnMessage = (
  state: IState,
  message: IMessage,
  type: string
) => {
  if (shouldFlashFrame(state, message, type)) {
    const win = window.require('electron').remote.getCurrentWindow();
    win.flashFrame(true);
  }
};

const shouldSendSystemNotifications = (
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
          (!message.isRead || !document.hasFocus())) ||
          settings.systemNotificationOnGroupchat === 'always')
      ) {
        return true;
      }
      // on mention
      if (
        message.isMentioningMe &&
        settings.systemNotificationOnMentionMe !== 'never' &&
        ((settings.systemNotificationOnMentionMe === 'unread' &&
          (!message.isRead || !document.hasFocus())) ||
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
          (!message.isRead || !document.hasFocus())) ||
          settings.systemNotificationOnChat === 'always')
      ) {
        return true;
      }
    }
  }
  return false;
};

const sendSystemNotificationOnMessage = (
  state: IState,
  message: IMessage,
  type: string,
  rawText: string
) => {
  if (shouldSendSystemNotifications(state, message, type)) {
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

const setMenuBarNotificationOnMessage = (state: IState, message: IMessage) => {
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
        chatMessagesUnread > 0 ? settings.flashMenuBarOnChatFrequency : 'once';
    }
    if (frequency !== '') {
      state.menuBarNotification = `${frequency},${key}`;
    } else {
      state.menuBarNotification = '';
    }
  }
};
