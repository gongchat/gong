const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

import IConnection from 'src/interfaces/IConnection';
import ICredentials from 'src/interfaces/ICredentials';
import IProfile from 'src/interfaces/IProfile';
import ISettings from 'src/interfaces/ISettings';
import ISettingsSaved from 'src/interfaces/ISettingsSaved';
import ISnackbarNotification from 'src/interfaces/ISnackbarNotification';
import IState from 'src/interfaces/IState';

import ColorUtil from 'src/utils/colorUtil';
import { addSavedRoomsToChannels } from './room';
import { mapSettingsSavedToSettings } from './settings';

import { initialState } from 'src/context';

export const connectionActions = {
  autoConnect(state: IState): IState {
    const settingsSaved: ISettingsSaved = electronStore.get('settings');
    if (settingsSaved === undefined) {
      return {
        ...state,
        connection: {
          isConnecting: false,
          isConnected: false,
          isAuthenticated: false,
          hasSavedCredentials: false,
          connectionError: '',
        },
      };
    } else {
      const credentials: ICredentials = {
        domain: settingsSaved.domain,
        username: settingsSaved.username,
        resource: settingsSaved.resource,
        port: settingsSaved.port,
        password: settingsSaved.password,
      };
      ipcRenderer.send('xmpp-auto-connect', {
        credentials,
        minimizeToTrayOnClose: settingsSaved.minimizeToTrayOnClose,
      });

      // handle reconnecting message if already authenticated
      let snackbarNotifications = state.snackbarNotifications;
      if (state.connection.isAuthenticated) {
        const snackbarNotification: ISnackbarNotification = {
          id: new Date().getTime() + Math.random() + '',
          source: 'connection',
          variant: 'info',
          message: 'Attempting to reconnect...',
        };
        snackbarNotifications = [
          ...snackbarNotifications,
          snackbarNotification,
        ];
      }

      return {
        ...state,
        connection: {
          ...state.connection,
          isConnected: false,
          isConnecting: true,
          hasSavedCredentials: true,
          connectionError: '',
        },
        snackbarNotifications,
      };
    }
  },
  connecting(credentials: ICredentials, state: IState): IState {
    // gets called from login
    ipcRenderer.send('xmpp-connect', credentials);
    return {
      ...state,
      connection: {
        ...state.connection,
        isConnected: false,
        isConnecting: true,
        connectionError: '',
      },
    };
  },
  // TODO: turn payload into an interface
  connected(payload: any, state: IState): IState {
    let settingsSaved: ISettingsSaved = electronStore.get('settings');

    // if no saved settings should be first log in.
    // save credentials and default settings
    if (!settingsSaved) {
      settingsSaved = {
        jid: payload.jid,
        domain: payload.domain,
        username: payload.username,
        resource: payload.jid.split('/')[1],
        port: payload.port,
        password: payload.password,
        soundName: 'Gong 1',
        minimizeToTrayOnClose: true,
        systemNotificationOnGroupchat: 'never',
        systemNotificationOnMentionMe: 'unread',
        systemNotificationOnChat: 'unread',
        renderVideos: true,
        renderGetYarn: true,
        renderImages: true,
        playAudioOnGroupchat: 'never',
        playAudioOnChat: 'unread',
        playAudioOnMentionMe: 'always',
        flashMenuBarOnGroupchat: 'never',
        flashMenuBarOnGroupchatFrequency: 'once',
        flashMenuBarOnMentionMe: 'unread',
        flashMenuBarOnMentionMeFrequency: 'repeat',
        flashMenuBarOnChat: 'unread',
        flashMenuBarOnChatFrequency: 'repeat',
      };
      electronStore.set('settings', settingsSaved);
    }

    const connection: IConnection = {
      isConnected: true,
      isConnecting: false,
      isAuthenticated: true,
      hasSavedCredentials: true,
      connectionError: '',
    };

    const profile: IProfile = {
      jid: payload.jid,
      username: payload.username,
      group: '',
      status: 'online',
      color: ColorUtil.stringToHexColor(payload.username),
      vCard: undefined,
    };

    const settings: ISettings = mapSettingsSavedToSettings(settingsSaved);

    ipcRenderer.send('xmpp-roster');
    ipcRenderer.send('xmpp-get-vcard', { from: payload.jid });

    // handle reconnected message if already authenticated
    let snackbarNotifications = state.snackbarNotifications;
    if (state.connection.isAuthenticated) {
      const snackbarNotification: ISnackbarNotification = {
        id: new Date().getTime() + Math.random() + '',
        source: 'connection',
        variant: 'success',
        message: 'Reconnected!',
      };
      snackbarNotifications = [...snackbarNotifications, snackbarNotification];
    }

    state = addSavedRoomsToChannels(state);

    return {
      ...state,
      connection,
      settings,
      profile,
      snackbarNotifications,
    };
  },
  connectionFailed(payload: any, state: IState): IState {
    let snackbarNotifications = state.snackbarNotifications;
    if (state.connection.isAuthenticated) {
      const snackbarNotification: ISnackbarNotification = {
        id: new Date().getTime() + Math.random() + '',
        source: 'connection',
        variant: 'error',
        message: payload.error,
      };
      snackbarNotifications = [...snackbarNotifications, snackbarNotification];
    }

    if (
      state.connection.isAuthenticated &&
      payload.error === 'Cannot authorize your credentials'
    ) {
      ipcRenderer.send('xmpp-log-off');
      return { ...initialState };
    }

    return {
      ...state,
      connection: {
        ...state.connection,
        isConnected: false,
        isConnecting: false,
        connectionError: payload.error,
      },
      snackbarNotifications,
    };
  },
  logOff(): IState {
    ipcRenderer.send('xmpp-log-off');
    return { ...initialState };
  },
};
