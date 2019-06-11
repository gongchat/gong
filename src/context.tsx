import React from 'react';
import { appActions } from './actions/app';
import { channelActions } from './actions/channel';
import { connectionActions } from './actions/connection';
import { discoverActions } from './actions/discover';
import { messageActions } from './actions/message';
import { notificationActions } from './actions/notification';
import { presenceActions } from './actions/presence';
import { roomActions } from './actions/room';
import {
  settingsActions,
  DEFAULT as DEFAULT_SETTINGS,
} from './actions/settings';
import { themeActions } from './actions/theme';
import { userActions, DEFAULT_VCARD } from './actions/user';
import { getTheme } from './actions/theme';
import { useContextDevTools } from './hooks/useContextDevTools';
import IState from './interfaces/IState';

export const INITIAL_STATE: IState = {
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
  settings: { ...DEFAULT_SETTINGS },
  channels: [],
  current: undefined,
  profile: {
    jid: '',
    username: '',
    group: '',
    status: '',
    color: '',
    vCard: DEFAULT_VCARD,
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

const Context = React.createContext(INITIAL_STATE);

export default function ContextProvider(props: any) {
  const [state, actions] = useContextDevTools(INITIAL_STATE, contract);

  const { children } = props;

  return (
    <Context.Provider value={[state, actions] as any}>
      {children}
    </Context.Provider>
  );
}

export function useContext(): [IState, any] {
  return React.useContext(Context) as any;
}
