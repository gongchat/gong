import IChannel from '../interfaces/IChannel';
import IChannelUser from '../interfaces/IChannelUser';
import IPresence from '../interfaces/IPresence';
import IRoom from '../interfaces/IRoom';
import IRoomJoin from '../interfaces/IRoomJoin';
import IState from '../interfaces/IState';
import IUser from '../interfaces/IUser';
import IUserConnection from '../interfaces/IUserConnection';

import { stringToHexColor } from '../utils/colorUtils';

const { ipcRenderer } = window.require('electron');

export const presenceActions: any = {
  setPresence(payload: IPresence) {
    return (state: IState): IState => {
      if (payload.from === state.profile.jid) {
        return setMe({ ...state }, payload);
      } else if (!payload.user && !payload.code) {
        return setChat({ ...state }, payload);
      } else {
        const newState = setGroupchat({ ...state }, payload);
        return newState;
      }
    };
  },
};

const setMe = (state: IState, presence: IPresence): IState => {
  return {
    ...state,
    profile: {
      ...state.profile,
      status: presence.status,
      statusText: presence.statusText,
    },
  };
};

const setChat = (state: IState, presence: IPresence): IState => {
  let user: IUser | undefined = state.channels.find(
    (channel: IChannel) => channel.jid === presence.from
  ) as IUser;
  if (!user) {
    user = state.channels.find(
      (channel: IChannel) => channel.jid === presence.from.split('/')[0]
    ) as IUser;
  }

  const channels: IChannel[] = state.channels.filter(
    (channel: IChannel) => channel !== user
  );

  if (user) {
    // update connections
    let connectionFound = false;

    if (!user.connections) {
      user.connections = [];
    }

    let connections: IUserConnection[] = user.connections.map(
      (connection: IUserConnection) => {
        if (connection.jid === presence.from) {
          connectionFound = true;
          return {
            ...connection,
            status: presence.status,
            statusText: presence.statusText,
            priority: presence.priority,
          };
        } else {
          return connection;
        }
      }
    );

    // if no connection found, add it
    if (!connectionFound) {
      const newConnection: IUserConnection = {
        jid: presence.from,
        priority: presence.priority,
        status: presence.status,
        statusText: presence.statusText,
      };
      connections = [...connections, newConnection];
    }

    // get lowest priority connection and use it for status
    const priorityConnection: IUserConnection = connections
      .filter((c: IUserConnection) => c.status !== 'offline')
      .sort(
        (a: IUserConnection, b: IUserConnection) => a.priority - b.priority
      )[0];

    user = {
      ...user,
      status: priorityConnection ? priorityConnection.status : 'offline',
      statusText: priorityConnection ? priorityConnection.statusText : '',
      sessionJid: priorityConnection ? priorityConnection.jid : undefined,
      connections,
    };

    let current = state.current as IUser;
    if (current && current.jid === user.jid) {
      current = user;
    }

    return { ...state, current, channels: [...channels, user] };
  }

  return state;
};

const setGroupchat = (state: IState, presence: IPresence): IState => {
  let room: IRoom = state.channels.find(
    (channel: IChannel) => channel.jid === presence.from.split('/')[0]
  ) as IRoom;

  const channels = state.channels.filter(
    (channel: IChannel) => channel !== room
  );

  if (room) {
    if (presence.code === '401') {
      // not authorized
      room = {
        ...room,
        isConnected: false,
        isConnecting: false,
        connectionError: 'Not authorized',
      };
    } else if (presence.code === '409') {
      // nickname conflict
      room = {
        ...room,
        isConnected: false,
        isConnecting: false,
        connectionError: 'Nickname conflict',
      };
    } else {
      room = {
        ...room,
        isConnected: true,
        isConnecting: false,
        connectionError: '',
      };

      if (presence.status === 'offline') {
        // remove user if status is no longer online
        room.users = [
          ...room.users.filter(
            (user: IChannelUser) => user.channelJid !== presence.from
          ),
        ];
        // if is from me
        if (`${room.jid}/${room.myNickname}` === presence.from) {
          handleGroupchatPresenceCode(presence.code, room);
        }
      } else {
        // if user with same nickname exists, remove it
        room.users = room.users.filter(
          (u: IChannelUser) =>
            u.channelJid.split('/')[1] !== presence.from.split('/')[1]
        );

        // if user does not exist, add it
        if (
          !room.users.find((u: IChannelUser) => u.channelJid === presence.from)
        ) {
          const nickname: string = presence.from.split('/')[1];
          const newUser: IChannelUser = {
            channelJid: presence.from,
            userJid: presence.user,
            role: presence.role,
            nickname,
            color: stringToHexColor(nickname),
            lastTimeMentionedMe: undefined,
          };
          room.users = [...room.users, newUser];
        }
      }
    }

    // if channel is the current one, update it
    let current = state.current;
    if (state.current && state.current.jid === room.jid) {
      current = room;
    }

    return { ...state, channels: [...channels, room], current };
  }

  return state;
};

const handleGroupchatPresenceCode = (code: string, room: IRoom) => {
  const channelJoin: IRoomJoin = {
    jid: room.jid,
    channelName: room.name,
    nickname: room.myNickname,
    password: room.password,
  };

  // Status code reference: https://xmpp.org/registrar/mucstatus.html
  switch (code) {
    case '301': // banned from room
      room.isConnected = false;
      room.isConnecting = false;
      room.connectionError = 'Banned from room';
      break;
    case '307': // kicked from room
      room.isConnected = false;
      room.isConnecting = true;
      room.connectionError = 'Kicked from room';
      setTimeout(() => {
        ipcRenderer.send('xmpp-subscribe-to-room', channelJoin);
      }, 30_000);
      break;
    case '321': // affiliation change
      room.isConnected = false;
      room.isConnecting = false;
      room.connectionError = 'Affiliation change';
      break;
    case '322': // members-only
      room.isConnected = false;
      room.isConnecting = false;
      room.connectionError = 'Members-only and you are not a member';
      break;
    case '332': // system shutdown
      room.isConnected = false;
      room.isConnecting = false;
      room.connectionError = 'System shutdown';
      break;
  }
};
