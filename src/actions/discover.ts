import IDiscoverRoom from '../interfaces/IDiscoverRoom';
import IState from '../interfaces/IState';
import ISubdomain from '../interfaces/ISubdomain';

const { ipcRenderer } = window.require('electron');

export const discoverActions: any = {
  setShowDiscover(isOpen: boolean) {
    return (state: IState): IState => {
      if (isOpen) {
        ipcRenderer.send('xmpp-discover-top-level-items');
        return {
          ...state,
          discover: {
            ...state.discover,
            isOpen,
            isSubdomainsLoaded: false,
            subdomains: [],
            isRoomsLoaded: false,
            rooms: [],
          },
        };
      }
      return {
        ...state,
        discover: {
          ...state.discover,
          isOpen,
        },
      };
    };
  },
  discoverItems(subdomain: string) {
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-discover-sub-level-items', subdomain);
      return {
        ...state,
        discover: {
          ...state.discover,
          isRoomsLoaded: false,
          rooms: [],
        },
      };
    };
  },
  setDiscoverRooms(rooms: IDiscoverRoom[]) {
    return (state: IState): IState => ({
      ...state,
      discover: {
        ...state.discover,
        isRoomsLoaded: true,
        rooms,
      },
    });
  },
  setDiscoverSubdomains(subdomains: ISubdomain[]) {
    return (state: IState): IState => ({
      ...state,
      discover: {
        ...state.discover,
        isSubdomainsLoaded: true,
        subdomains,
      },
    });
  },
};
