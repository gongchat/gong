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
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-my-status', {
        status,
        statusText: state.profile.statusText,
      });
      return {
        ...state,
        // TODO: add a new property to the profile to keep track of requests
        // statusText will be set on the acknowledgement
        // profile: { ...state.profile, status },
      };
    };
  },
  setMyStatusText(statusText: string) {
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-my-status', {
        status: state.profile.status,
        statusText,
      });
      return {
        ...state,
        // TODO: add a new property to the profile to keep track of requests
        // statusText will be set on the acknowledgement
        // profile: { ...state.profile, statusText },
      };
    };
  },
  setUserVCard(vCard: IVCard) {
    return (state: IState): IState => {
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
    };
  },
  setMyVCard(vCard: IVCard) {
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-set-vcard', vCard);
      return {
        ...state,
        profile: { ...state.profile, vCard },
      };
    };
  },
  addUsersToChannels(users: IUser[]) {
    return (state: IState): IState => {
      users.forEach((user: IUser) => {
        ipcRenderer.send('xmpp-get-vcard', {
          from: state.profile.jid,
          to: user.jid,
        });
      });

      // Need to send after getting roster as the XMPP server will return
      // the status for each user.
      ipcRenderer.send('xmpp-my-status', {
        status: state.settings.previousStatus,
        statusText: state.settings.previousStatusText,
      });

      return {
        ...state,
        profile: {
          ...state.profile,
          status: state.settings.previousStatus,
          statusText: state.settings.previousStatusText,
        },
        channels: [
          ...state.channels.filter(
            (channel: IChannel) => channel.type === 'groupchat'
          ),
          ...users,
        ],
      };
    };
  },
  setSessionJid(userJid: string, sessionJid: string) {
    return (state: IState): IState => {
      let current = state.current;
      const newState = {
        ...state,
        channels: state.channels.map((channel: IChannel) => {
          if (channel.type === 'groupchat' || channel.jid !== userJid) {
            return channel;
          }
          const user = channel as IUser;
          const connection = user.connections.find(u => u.jid === sessionJid);
          const updatedUser = {
            ...channel,
            sessionJid,
            status: connection ? connection.status : user.status,
          };
          if (current && current.jid === updatedUser.jid) {
            current = updatedUser;
          }
          return updatedUser;
        }),
      };
      if (current && current.jid === userJid) {
        newState.current = current;
      }
      return newState;
    };
  },
};
