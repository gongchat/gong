const { ipcRenderer } = window.require('electron');

import IState from 'src/interfaces/IState';
import IUser from 'src/interfaces/IUser';
import IVCard from 'src/interfaces/IVCard';

export const userActions = {
  setMyStatus(status: string, state: IState): IState {
    ipcRenderer.send('xmpp-my-status', status);
    return {
      ...state,
      profile: { ...state.profile, status },
    };
  },
  setUserVCard(vCard: IVCard, state: IState): IState {
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
  },
  setMyVCard(vCard: IVCard, state: IState): IState {
    ipcRenderer.send('xmpp-set-vcard', vCard);
    return {
      ...state,
      profile: { ...state.profile, vCard },
    };
  },
  addUsersToChannels(users: IUser[], state: IState): IState {
    users.forEach((user: IUser) => {
      ipcRenderer.send('xmpp-get-vcard', {
        from: state.profile.jid,
        to: user.jid,
      });
    });
    // update user status to online after roster is received
    ipcRenderer.send('xmpp-my-status', 'online');
    return {
      ...state,
      profile: { ...state.profile, status: 'online' },
      channels: [...state.channels, ...users],
    };
  },
};
