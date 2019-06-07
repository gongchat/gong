import { addSavedRoomsToChannels } from './room';
import { DEFAULT_VCARD } from './user';
import {
  mapSettingsSavedToSettings,
  DEFAULT as DEFAULT_SETTINGS,
} from './settings';
import { INITIAL_STATE } from '../context';
import IConnection from '../interfaces/IConnection';
import ICredentials from '../interfaces/ICredentials';
import IProfile from '../interfaces/IProfile';
import ISettings from '../interfaces/ISettings';
import ISettingsSaved from '../interfaces/ISettingsSaved';
import ISnackbarNotification from '../interfaces/ISnackbarNotification';
import IState from '../interfaces/IState';
import { stringToHexColor } from '../utils/colorUtil';

const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

export const connectionActions: any = {
  autoConnect() {
    return (state: IState): IState => {
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
        if (state.connection.hasSavedCredentials) {
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
    };
  },
  connecting(credentials: ICredentials) {
    return (state: IState): IState => {
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
    };
  },
  // TODO: turn payload into an interface
  connected(payload: any) {
    return (state: IState): IState => {
      let settingsSaved: ISettingsSaved = electronStore.get('settings');

      // if no saved settings should be first log in.
      // save credentials and default settings
      if (!settingsSaved) {
        settingsSaved = {
          ...DEFAULT_SETTINGS,
          jid: payload.jid,
          domain: payload.domain,
          username: payload.username,
          resource: payload.jid.split('/')[1],
          port: payload.port,
          password: payload.password,
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
        color: stringToHexColor(payload.username),
        vCard: DEFAULT_VCARD,
      };

      const settings: ISettings = mapSettingsSavedToSettings(settingsSaved);

      ipcRenderer.send('xmpp-roster');
      ipcRenderer.send('xmpp-get-vcard', { from: payload.jid });

      // handle reconnected message if already authenticated
      let snackbarNotifications = state.snackbarNotifications;
      if (state.connection.hasSavedCredentials) {
        const snackbarNotification: ISnackbarNotification = {
          id: new Date().getTime() + Math.random() + '',
          source: 'connection',
          variant: 'success',
          message: 'Connected!',
        };
        snackbarNotifications = [
          ...snackbarNotifications,
          snackbarNotification,
        ];
      }

      return {
        ...addSavedRoomsToChannels(state),
        connection,
        settings,
        profile,
        snackbarNotifications,
      };
    };
  },
  // TODO: turn payload into an interface
  connectionFailed(payload: any) {
    return (state: IState): IState => {
      let snackbarNotifications = state.snackbarNotifications;
      if (state.connection.hasSavedCredentials) {
        const snackbarNotification: ISnackbarNotification = {
          id: new Date().getTime() + Math.random() + '',
          source: 'connection',
          variant: 'error',
          message: payload.error,
        };
        snackbarNotifications = [
          ...snackbarNotifications,
          snackbarNotification,
        ];
      }

      if (
        state.connection.hasSavedCredentials &&
        payload.error === 'Cannot authorize your credentials'
      ) {
        ipcRenderer.send('xmpp-log-off');
        return { ...INITIAL_STATE };
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
    };
  },
  logOff() {
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-log-off');
      return {
        ...INITIAL_STATE,
        connection: { ...INITIAL_STATE.connection, hasSavedCredentials: false },
      };
    };
  },
};
