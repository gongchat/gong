import IDiscoverRoom from '../interfaces/IDiscoverRoom';
import IState from '../interfaces/IState';
import ISubdomain from '../interfaces/ISubdomain';

const { ipcRenderer } = window.require('electron');

export const discoverActions: any = {
  setShowDiscover(value: boolean) {
    return (state: IState): IState => {
      if (value === true) {
        ipcRenderer.send('xmpp-discover-top-level-items');
      }
      return { ...state, showDiscover: value };
    };
  },
  discoverItems(subdomain: string) {
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-discover-sub-level-items', subdomain);
      return state;
    };
  },
  setDiscoverRooms(rooms: IDiscoverRoom[]) {
    return (state: IState): IState => ({ ...state, rooms });
  },
  setDiscoverSubdomains(subdomains: ISubdomain[]) {
    return (state: IState): IState => ({ ...state, subdomains });
  },
};
