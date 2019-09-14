import React from 'react';
import { useGovernor } from '@techempower/react-governor';

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
import IState from './interfaces/IState';
import governorMiddleware from './utils/governorMiddleware';

export const INITIAL_STATE: IState = {
  app: {
    version: '',
    operatingSystem: '',
    hasUpdate: undefined,
    isCheckingForUpdate: false,
    isUpdateDownloaded: false,
    lastDateTimeUpdatedChecked: undefined,
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
  notifications: {
    snackbar: [],
    menuBar: '',
  },
  discover: {
    isOpen: false,
    isSubdomainsLoaded: false,
    subdomains: [],
    isRoomsLoaded: false,
    rooms: [],
  },
  theme: getTheme(),
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
  const [state, actions] = useGovernor(
    INITIAL_STATE,
    contract,
    governorMiddleware
  );

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
