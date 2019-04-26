import React from 'react';

import { useGovernor } from '@techempower/react-governor';

import IState from './interfaces/IState';

import { appActions } from './actions/app';
import { channelActions } from './actions/channel';
import { connectionActions } from './actions/connection';
import { discoverActions } from './actions/discover';
import { messageActions } from './actions/message';
import { notificationActions } from './actions/notification';
import { presenceActions } from './actions/presence';
import { roomActions } from './actions/room';
import { settingsActions } from './actions/settings';
import { themeActions } from './actions/theme';
import { userActions } from './actions/user';

import { getTheme } from './actions/theme';

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

  const { children } = props;

  return (
    <Context.Provider value={[context, actions] as any}>
      {children}
    </Context.Provider>
  );
}

export function useContext(): any {
  return React.useContext(Context);
}
