import * as React from 'react';

import { useGovernor } from '@techempower/react-governor';

import IState from 'src/interfaces/IState';

import { appActions } from 'src/actions/app';
import { channelActions } from 'src/actions/channel';
import { connectionActions } from 'src/actions/connection';
import { discoverActions } from 'src/actions/discover';
import { messageActions } from 'src/actions/message';
import { notificationActions } from 'src/actions/notification';
import { presenceActions } from 'src/actions/presence';
import { roomActions } from 'src/actions/room';
import { settingsActions } from 'src/actions/settings';
import { themeActions } from 'src/actions/theme';
import { userActions } from 'src/actions/user';

import { getTheme } from 'src/actions/theme';

export const initialState: IState = {
  app: {
    version: '',
    operatingSystem: '',
    hasUpdate: undefined,
    isUpdateDownloaded: false,
  },
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
  theme: getTheme(),
  menuBarNotification: '',
};

const contract = {
  ...appActions,
  ...channelActions,
  ...connectionActions,
  ...discoverActions,
  ...messageActions,
  ...notificationActions,
  ...presenceActions,
  ...roomActions,
  ...settingsActions,
  ...themeActions,
  ...userActions,
};

const Context = React.createContext(initialState);

export default function ContextProvider(props: any) {
  const [context, actions] = useGovernor(initialState, contract);

  return (
    <Context.Provider value={[context, actions] as any}>
      {props.children}
    </Context.Provider>
  );
}

export function useContext(): any {
  return React.useContext(Context);
}
