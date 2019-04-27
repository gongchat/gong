import IChannel from '../interfaces/IChannel';
import IState from '../interfaces/IState';
import IUser from '../interfaces/IUser';
import IVCard from '../interfaces/IVCard';

const { ipcRenderer } = window.require('electron');

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
      const channels = state.channels.map((c: IChannel) => {
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
      channels: [
        ...state.channels.filter(
          (channel: IChannel) => channel.type === 'groupchat'
        ),
        ...users,
      ],
    };
  },
};

export const defaultVCard: IVCard = {
  jid: '',
  fullName: '',
  firstName: '',
  lastName: '',
  middleName: '',
  nickname: '',
  url: '',
  birthday: '',
  organizationName: '',
  organizationUnit: '',
  title: '',
  role: '',
  phoneNumber: '',
  street: '',
  streetExtended: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  email: '',
  description: '',
  photoType: '',
  photo: '',
};
