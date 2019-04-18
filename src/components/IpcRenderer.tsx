const { ipcRenderer } = window.require('electron');

import * as React from 'react';
import { useContext } from 'src/context';
import XmppJsMapper from 'src/utils/xmppJsMapper';

const IpcRenderer = () => {
  const [context, actions] = useContext();

  React.useEffect(() => {
    // Do not call multiple actions inside an ipcRenderer event. This will
    // causes states to go out of sync.

    ipcRenderer.on('app-set', (event: any, arg: any) => {
      actions.setApp(arg);
    });

    ipcRenderer.on('xmpp-connection-failed', (event: any, arg: any) => {
      actions.connectionFailed(arg);
    });

    ipcRenderer.on('xmpp-connected', (event: any, arg: any) => {
      actions.connected(arg);
    });

    ipcRenderer.on('xmpp-roster', (event: any, arg: any) => {
      actions.addUsersToChannels(XmppJsMapper.mapToUsers(arg));
    });

    ipcRenderer.on('xmpp-presence', (event: any, arg: any) => {
      actions.setPresence(XmppJsMapper.mapToPresence(arg));
    });

    ipcRenderer.on('xmpp-discover-top-level-items', (event: any, arg: any) => {
      actions.setDiscoverSubdomains(XmppJsMapper.mapToSubdomains(arg));
    });

    ipcRenderer.on('xmpp-discover-sub-level-items', (event: any, arg: any) => {
      actions.setDiscoverRooms(XmppJsMapper.mapToRooms(arg));
    });

    ipcRenderer.on('xmpp-reply', (event: any, arg: any) => {
      actions.receiveMessage(XmppJsMapper.mapToReply(arg));
    });

    ipcRenderer.on('xmpp-vcard', (event: any, arg: any) => {
      actions.setUserVCard(XmppJsMapper.mapToVCard(arg));
    });

    ipcRenderer.on('get-log', (event: any, arg: any) => {
      actions.setChannelLogs(arg);
    });
  }, []);

  return null;
};

export default IpcRenderer;
