import IDiscoverRoom from '../interfaces/IDiscoverRoom';
import IState from '../interfaces/IState';
import ISubdomain from '../interfaces/ISubdomain';

const { ipcRenderer } = window.require('electron');

export const discoverActions: any = {
  setShowDiscover(value: boolean) {
    return (): IState => {
      if (value === true) {
        ipcRenderer.send('xmpp-discover-top-level-items');
      }
      return { ...this.state, showDiscover: value };
    };
  },
  discoverItems(subdomain: string) {
    return (): IState => {
      ipcRenderer.send('xmpp-discover-sub-level-items', subdomain);
      return this.state;
    };
  },
  setDiscoverRooms(rooms: IDiscoverRoom[]) {
    return (): IState => ({ ...this.state, rooms });
  },
  setDiscoverSubdomains(subdomains: ISubdomain[]) {
    return (): IState => ({ ...this.state, subdomains });
  },
};
