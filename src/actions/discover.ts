const { ipcRenderer } = window.require('electron');

import IDiscoverRoom from 'src/interfaces/IDiscoverRoom';
import IState from 'src/interfaces/IState';
import ISubdomain from 'src/interfaces/ISubdomain';

export const discoverActions = {
  setShowDiscover(value: boolean, state: IState): IState {
    if (value === true) {
      ipcRenderer.send('xmpp-discover-top-level-items');
    }
    return { ...state, showDiscover: value };
  },
  discoverItems(subdomain: string, state: IState): IState {
    ipcRenderer.send('xmpp-discover-sub-level-items', subdomain);
    return state;
  },
  setDiscoverRooms(rooms: IDiscoverRoom[], state: IState): IState {
    return { ...state, rooms };
  },
  setDiscoverSubdomains(subdomains: ISubdomain[], state: IState): IState {
    return { ...state, subdomains };
  },
};
