import {
  CHANNEL_ADD,
  CHANNEL_REMOVE,
  CHANNEL_SELECT,
  CHANNEL_SELECT_USER,
  CHANNEL_SET_SCROLL_POSITION,
  DISCOVER_ITEMS,
  DISCOVER_SHOW,
  LOG_OFF,
  MESSAGE_SEND,
  MY_STATUS_SET,
  MY_VCARD_SET,
  ROOM_EDIT,
  ROOM_SET_NICKNAME,
  SETTINGS_SET,
  SETTINGS_TOGGLE,
  SNACKBAR_NOTIFICATION_ADD,
  SNACKBAR_NOTIFICATION_REMOVE,
  THEME_SET,
  THEME_SET_DEFAULT,
  XMPP_CONNECTION_AUTO_CONNECT,
  XMPP_CONNECTION_CONNECTING,
} from './constants';

import IChannelUser from 'src/interfaces/IChannelUser';
import ICredentials from 'src/interfaces/ICredentials';
import IMessageSend from 'src/interfaces/IMessageSend';
import IRoomJoin from 'src/interfaces/IRoomJoin';
import ISnackbarNotification from 'src/interfaces/ISnackbarNotification';
import IVCard from 'src/interfaces/IVCard';

export const autoLogin = () => (dispatch: any) => {
  dispatch({ type: XMPP_CONNECTION_AUTO_CONNECT });
};

export const login = (credentials: ICredentials) => (dispatch: any) => {
  dispatch({ type: XMPP_CONNECTION_CONNECTING, payload: credentials });
};

export const setMyStatus = (status: string) => (dispatch: any) => {
  dispatch({ type: MY_STATUS_SET, payload: status });
};

export const setMyVCard = (vCard: IVCard) => (dispatch: any) => {
  dispatch({ type: MY_VCARD_SET, payload: vCard });
};

export const selectChannel = (jid: string) => (dispatch: any) => {
  dispatch({ type: CHANNEL_SELECT, payload: jid });
};

export const channelSelectUser = (user: IChannelUser) => (dispatch: any) => {
  dispatch({ type: CHANNEL_SELECT_USER, payload: user });
};

export const setChannelScrollPosition = (jid: string, position: number) => (
  dispatch: any
) => {
  dispatch({ type: CHANNEL_SET_SCROLL_POSITION, payload: { jid, position } });
};

export const setShowDiscover = (value: boolean) => (dispatch: any) => {
  dispatch({ type: DISCOVER_SHOW, payload: value });
};

export const getSubdomainItems = (subdomain: string) => (dispatch: any) => {
  dispatch({ type: DISCOVER_ITEMS, payload: subdomain });
};

export const addRoomToChannels = (channelJoin: IRoomJoin) => (
  dispatch: any
) => {
  dispatch({ type: CHANNEL_ADD, payload: channelJoin });
};

export const removeChannel = (jid: string) => (dispatch: any) => {
  dispatch({ type: CHANNEL_REMOVE, payload: jid });
};

export const sendMessage = (messageSend: IMessageSend) => (dispatch: any) => {
  dispatch({ type: MESSAGE_SEND, payload: messageSend });
};

export const settingsToggle = () => (dispatch: any) => {
  dispatch({ type: SETTINGS_TOGGLE });
};

export const setTheme = (item: any) => (dispatch: any) => {
  dispatch({ type: THEME_SET, payload: item });
};

export const setThemeToDefault = (item: any) => (dispatch: any) => {
  dispatch({ type: THEME_SET_DEFAULT });
};

export const logOff = (item: any) => (dispatch: any) => {
  dispatch({ type: LOG_OFF });
};

export const removeSnackbarNotification = (id: number) => (dispatch: any) => {
  dispatch({ type: SNACKBAR_NOTIFICATION_REMOVE, payload: id });
};

export const addSnackbarNotification = (
  notification: ISnackbarNotification
) => (dispatch: any) => {
  dispatch({ type: SNACKBAR_NOTIFICATION_ADD, payload: notification });
};

export const setSettings = (settings: any) => (dispatch: any) => {
  dispatch({ type: SETTINGS_SET, payload: settings });
};

export const setRoomNickname = (roomNickname: any) => (dispatch: any) => {
  dispatch({ type: ROOM_SET_NICKNAME, payload: roomNickname });
};

export const editRoom = (jid: string, room: IRoomJoin) => (dispatch: any) => {
  dispatch({ type: ROOM_EDIT, payload: { jid, room } });
};
