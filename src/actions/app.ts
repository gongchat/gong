import IState from '../interfaces/IState';
import moment from 'moment';

const { ipcRenderer } = window.require('electron');

export const appActions: any = {
  setApp(payload: any) {
    // handle moment
    if (payload.lastDateTimeUpdatedChecked) {
      payload.lastDateTimeUpdatedChecked = moment(
        payload.lastDateTimeUpdatedChecked
      );
    }

    return (state: IState): IState => ({
      ...state,
      app: { ...state.app, ...payload },
    });
  },
  checkForUpdates() {
    ipcRenderer.send('app-check-for-updates');
    return (state: IState): IState => ({
      ...state,
      app: {
        ...state.app,
        hasUpdate: undefined,
        isCheckingForUpdate: true,
        isUpdateDownloaded: false,
        isAutoUpdateError: false,
        lastDateTimeUpdatedChecked: undefined,
      },
    });
  },
};
