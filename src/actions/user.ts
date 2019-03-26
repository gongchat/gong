const { ipcRenderer } = window.require('electron');

import IState from 'src/interfaces/IState';
import IUser from 'src/interfaces/IUser';
import IVCard from 'src/interfaces/IVCard';

export default class User {
  public static setMyStatus = (state: IState, status: string): IState => {
    ipcRenderer.send('xmpp-my-status', status);
    return {
      ...state,
      profile: { ...state.profile, status },
    };
  };

  public static setVCard = (state: IState, vCard: IVCard): IState => {
    if (state.profile.jid === vCard.jid) {
      return {
        ...state,
        profile: { ...state.profile, vCard },
      };
    } else {
      const channels = state.channels.map((c: IUser) => {
        if (c.type === 'chat' && c.jid === vCard.jid.split('/')[0]) {
          return { ...c, vCard };
        } else {
          return c;
        }
      });
      return {
        ...state,
        channels,
      };
    }
  };

  public static setMyVCard = (state: IState, vCard: IVCard): IState => {
    ipcRenderer.send('xmpp-set-vcard', vCard);
    return {
      ...state,
      profile: { ...state.profile, vCard },
    };
  };

  public static addToChannels = (state: IState, users: IUser[]): IState => {
    users.forEach((user: IUser) => {
      ipcRenderer.send('xmpp-get-vcard', {
        from: state.profile.jid,
        to: user.jid,
      });
    });
    return {
      ...state,
      channels: [...state.channels, ...users],
    };
  };

  public static setSettingsToggle = (state: IState): IState => {
    return { ...state, showSettings: !state.showSettings };
  };
}
