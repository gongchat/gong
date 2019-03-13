import store from 'src/store';

import XmppJsMapper from 'src/utils/xmppJsMapper';

import {
  CHANNEL_SET_LOGGED_MESSAGES,
  CHANNELS_SET,
  MESSAGE_RECEIVE,
  MY_STATUS_SET,
  PRESENCE_SET,
  ROOMS_SET,
  SUBDOMAINS_SET,
  USER_SET,
  VCARD_SET,
  XMPP_CONNECTION_CONNECTED,
  XMPP_CONNECTION_FAILED,
} from 'src/actions/constants';

export default class IpcRenderer {
  public static attachEvents(ipcRenderer: any) {
    ipcRenderer.on('xmpp-connection-failed', (event: any, arg: any) => {
      store.dispatch({ type: XMPP_CONNECTION_FAILED, payload: arg.error });
    });

    ipcRenderer.on('xmpp-connected', (event: any, arg: any) => {
      // TODO: this will save for both login and auto login, need to make it so it saves on login only
      store.dispatch({ type: XMPP_CONNECTION_CONNECTED, payload: arg });
      store.dispatch({ type: CHANNELS_SET });
    });

    ipcRenderer.on('xmpp-roster', (event: any, arg: any) => {
      store.dispatch({ type: USER_SET, payload: XmppJsMapper.mapToUsers(arg) });
      store.dispatch({ type: MY_STATUS_SET, payload: 'online' });
    });

    ipcRenderer.on('xmpp-presence', (event: any, arg: any) => {
      store.dispatch({
        type: PRESENCE_SET,
        payload: XmppJsMapper.mapToPresence(arg),
      });
    });

    ipcRenderer.on('xmpp-discover-top-level-items', (event: any, arg: any) => {
      store.dispatch({
        type: SUBDOMAINS_SET,
        payload: XmppJsMapper.mapToSubdomains(arg),
      });
    });

    ipcRenderer.on('xmpp-reply', (event: any, arg: any) => {
      store.dispatch({
        type: MESSAGE_RECEIVE,
        payload: XmppJsMapper.mapToReply(arg),
      });
    });

    ipcRenderer.on('xmpp-discover-sub-level-items', (event: any, arg: any) => {
      store.dispatch({
        type: ROOMS_SET,
        payload: XmppJsMapper.mapToRooms(arg),
      });
    });

    ipcRenderer.on('xmpp-vcard', (event: any, arg: any) => {
      store.dispatch({
        type: VCARD_SET,
        payload: XmppJsMapper.mapToVCard(arg),
      });
    });

    ipcRenderer.on('get-log', (event: any, arg: any) => {
      store.dispatch({ type: CHANNEL_SET_LOGGED_MESSAGES, payload: arg });
    });
  }
}
