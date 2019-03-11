import {
  CHANNEL_ADD,
  CHANNEL_GET_LOGGED_MESSAGES,
  CHANNEL_REMOVE,
  CHANNEL_SELECT,
  CHANNEL_SELECT_USER,
  CHANNEL_SET_SCROLL_POSITION,
  CHANNELS_SET,
  DISCOVER_ITEMS,
  DISCOVER_SHOW,
  LOG_OFF,
  MESSAGE_RECEIVE,
  MESSAGE_SEND,
  MY_STATUS_SET,
  MY_VCARD_SET,
  PRESENCE_SET,
  ROOM_EDIT,
  ROOM_SET_NICKNAME,
  ROOMS_SET,
  SETTINGS_SET,
  SETTINGS_TOGGLE,
  SNACKBAR_NOTIFICATION_ADD,
  SNACKBAR_NOTIFICATION_REMOVE,
  SUBDOMAINS_SET,
  THEME_SET,
  THEME_SET_DEFAULT,
  USER_SET,
  VCARD_SET,
  XMPP_CONNECTION_AUTO_CONNECT,
  XMPP_CONNECTION_CONNECTED,
  XMPP_CONNECTION_CONNECTING,
  XMPP_CONNECTION_FAILED,
} from 'src/actions/constants';

// interfaces
import IState from 'src/interfaces/IState';

// utils
import Channel from 'src/actions/channel';
import Connection from 'src/actions/connection';
import Discover from 'src/actions/discover';
import Message from 'src/actions/message';
import Notification from 'src/actions/notification';
import Presence from 'src/actions/presence';
import Room from 'src/actions/room';
import Settings from 'src/actions/settings';
import Theme from 'src/actions/theme';
import User from 'src/actions/user';

export const initialState: IState = {
  connection: {
    isConnecting: false,
    isConnected: false,
    connectionError: '',
    hasSavedCredentials: undefined,
    isAuthenticated: false,
  },
  settings: {
    jid: '',
    domain: '',
    username: '',
    resource: '',
    port: '',
    systemNotificationOnGroupchat: 'never',
    systemNotificationOnMentionMe: 'unread',
    systemNotificationOnChat: 'unread',
    minimizeToTrayOnClose: true,
    renderVideos: true,
    renderGetYarn: true,
    renderImages: true,
    soundName: 'Gong 1',
    playAudioOnGroupchat: 'never',
    playAudioOnMentionMe: 'all',
    playAudioOnChat: 'unread',
    flashMenuBarOnGroupchat: 'unread',
    flashMenuBarOnGroupchatFrequency: 'once',
    flashMenuBarOnMentionMe: 'unread',
    flashMenuBarOnMentionMeFrequency: 'once',
    flashMenuBarOnChat: 'unread',
    flashMenuBarOnChatFrequency: 'once',
  },
  channels: [],
  current: undefined,
  profile: {
    jid: '',
    username: '',
    group: '',
    status: '',
    color: '',
    vCard: undefined,
  },
  snackbarNotifications: [],
  showDiscover: false,
  subdomains: [],
  rooms: [],
  showSettings: false,
  theme: Theme.getTheme(),
  menuBarNotification: '',
};

/*
  All logic is held in separate files in ~/actions/. This is to make the migration
  to Context, Hooks, and react-governor easier.
*/

export default function(state = initialState, action: any) {
  switch (action.type) {
    case MESSAGE_RECEIVE:
      return Message.receive(state, action.payload);
    case MESSAGE_SEND:
      return Message.send(state, action.payload);

    case USER_SET:
      return User.addToChannels(state, action.payload);
    case VCARD_SET:
      return User.setVCard(state, action.payload);
    case MY_STATUS_SET:
      return User.setMyStatus(state, action.payload);
    case MY_VCARD_SET:
      return User.setMyVCard(state, action.payload);
    case SETTINGS_TOGGLE:
      return User.setSettingsToggle(state);

    case PRESENCE_SET:
      return Presence.set(state, action.payload);

    case CHANNELS_SET:
      return Room.addSavedToChannels(state);
    case CHANNEL_ADD:
      return Room.addToChannels(state, action.payload);
    case CHANNEL_SELECT_USER:
      return Room.selectUser(state, action.payload);
    case ROOM_EDIT:
      return Room.edit(state, action.payload);
    case ROOM_SET_NICKNAME:
      return Room.setNickname(state, action.payload);

    case CHANNEL_REMOVE:
      return Channel.remove(state, action.payload);
    case CHANNEL_SELECT:
      return Channel.select(state, action.payload);
    case CHANNEL_SET_SCROLL_POSITION:
      return Channel.setScrollPosition(state, action.payload);
    case CHANNEL_GET_LOGGED_MESSAGES:
      return Channel.addLoggedMessages(state, action.payload);

    case XMPP_CONNECTION_AUTO_CONNECT:
      return Connection.autoConnect(state);
    case XMPP_CONNECTION_CONNECTING:
      return Connection.connecting(state, action.payload);
    case XMPP_CONNECTION_CONNECTED:
      return Connection.connected(state, action.payload);
    case XMPP_CONNECTION_FAILED:
      return Connection.failed(state, action.payload);
    case LOG_OFF:
      return Connection.logOff();

    case THEME_SET:
      return Theme.setTheme(state, action.payload);
    case THEME_SET_DEFAULT:
      return Theme.setThemeToDefault(state);

    case DISCOVER_SHOW:
      return Discover.setShow(state, action.payload);
    case DISCOVER_ITEMS:
      return Discover.discoverItems(state, action.payload);
    case SUBDOMAINS_SET:
      return Discover.setSubdomains(state, action.payload);
    case ROOMS_SET:
      return Discover.setDiscoverRooms(state, action.payload);

    case SETTINGS_SET:
      return Settings.setAndSave(state, action.payload);

    case SNACKBAR_NOTIFICATION_REMOVE:
      return Notification.removeFromSnackbar(state, action.payload);
    case SNACKBAR_NOTIFICATION_ADD:
      return Notification.addToSnackbar(state, action.payload);

    default:
      return state;
  }
}
