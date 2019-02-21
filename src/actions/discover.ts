const { ipcRenderer } = window.require('electron');

import IDiscoverRoom from 'src/interfaces/IDiscoverRoom';
import IState from 'src/interfaces/IState';
import ISubdomain from 'src/interfaces/ISubdomain';

export default class Discover {
  public static setShow = (state: IState, value: boolean): IState => {
    if (value === true) {
      ipcRenderer.send('xmpp-discover-top-level-items');
    }
    return { ...state, showDiscover: value };
  };

  public static discoverItems = (state: IState, subdomain: string): IState => {
    ipcRenderer.send('xmpp-discover-sub-level-items', subdomain);
    return state;
  };

  public static setDiscoverRooms = (
    state: IState,
    rooms: IDiscoverRoom[]
  ): IState => {
    return { ...state, rooms };
  };

  public static setSubdomains = (
    state: IState,
    subdomains: ISubdomain[]
  ): IState => {
    return { ...state, subdomains };
  };
}
