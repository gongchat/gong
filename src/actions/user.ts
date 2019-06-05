import IChannel from '../interfaces/IChannel';
import IState from '../interfaces/IState';
import IUser from '../interfaces/IUser';
import IVCard from '../interfaces/IVCard';

const { ipcRenderer } = window.require('electron');

export const DEFAULT_VCARD: IVCard = {
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

export const userActions: any = {
  setMyStatus(status: string) {
    return (): IState => {
      ipcRenderer.send('xmpp-my-status', status);
      return {
        ...this.state,
        profile: { ...this.state.profile, status },
      };
    };
  },
  setUserVCard(vCard: IVCard) {
    return (): IState => {
      if (this.state.profile.jid === vCard.jid) {
        return {
          ...this.state,
          profile: { ...this.state.profile, vCard },
        };
      } else {
        const channels = this.state.channels.map((c: IChannel) => {
          if (c.type === 'chat' && c.jid === vCard.jid.split('/')[0]) {
            return { ...c, vCard };
          } else {
            return c;
          }
        });
        return {
          ...this.state,
          channels,
        };
      }
    };
  },
  setMyVCard(vCard: IVCard) {
    return (): IState => {
      ipcRenderer.send('xmpp-set-vcard', vCard);
      return {
        ...this.state,
        profile: { ...this.state.profile, vCard },
      };
    };
  },
  addUsersToChannels(users: IUser[]) {
    return (): IState => {
      users.forEach((user: IUser) => {
        ipcRenderer.send('xmpp-get-vcard', {
          from: this.state.profile.jid,
          to: user.jid,
        });
      });
      // update user status to online after roster is received
      ipcRenderer.send('xmpp-my-status', 'online');
      return {
        ...this.state,
        profile: { ...this.state.profile, status: 'online' },
        channels: [
          ...this.state.channels.filter(
            (channel: IChannel) => channel.type === 'groupchat'
          ),
          ...users,
        ],
      };
    };
  },
};
