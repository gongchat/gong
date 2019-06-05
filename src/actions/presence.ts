import IChannel from '../interfaces/IChannel';
import IChannelUser from '../interfaces/IChannelUser';
import IPresence from '../interfaces/IPresence';
import IRoom from '../interfaces/IRoom';
import IState from '../interfaces/IState';
import IUser from '../interfaces/IUser';
import IUserConnection from '../interfaces/IUserConnection';

import { stringToHexColor } from '../utils/colorUtil';

export const presenceActions: any = {
  setPresence(payload: IPresence) {
    return (): IState => {
      if (!payload.user && !payload.code) {
        return setChat({ ...this.state }, payload);
      } else {
        return setGroupchat({ ...this.state }, payload);
      }
    };
  },
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
      connections,
    };

    // update sessionJid
    if (presence.status === 'offline') {
      user.sessionJid = undefined;
    }
    let current = state.current as IUser;
    if (current && current.jid === user.jid) {
      current = { ...current, sessionJid: undefined };
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
            (user: IChannelUser) => user.jid !== presence.user
          ),
        ];
      } else {
        // if user does not exist, add it
        if (
          room.users &&
          !room.users.find((u: IChannelUser) => u.jid === presence.user)
        ) {
          const nickname: string = presence.from.split('/')[1];
          const newUser: IChannelUser = {
            jid: presence.user,
            role: presence.role,
            nickname,
            color: stringToHexColor(nickname),
            lastTimeMentionedMe: undefined,
          };
          room.users = [...room.users, newUser];
        }
      }

      // if channel is the current one, update it
      if (state.current && state.current.jid === room.jid) {
        state.current = {
          ...state.current,
          users: room.users,
        };
      }
    }

    return { ...state, channels: [...channels, room] };
  }

  return state;
};
