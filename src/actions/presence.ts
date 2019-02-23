import IChannel from 'src/interfaces/IChannel';
import IChannelUser from 'src/interfaces/IChannelUser';
import IPresence from 'src/interfaces/IPresence';
import IRoom from 'src/interfaces/IRoom';
import IState from 'src/interfaces/IState';
import IUser from 'src/interfaces/IUser';
import IUserConnection from 'src/interfaces/IUserConnection';

import ColorUtil from 'src/utils/colorUtil';

export default class Presence {
  public static set = (state: IState, payload: IPresence): IState => {
    if (payload.user === undefined) {
      return Presence.setChat(state, payload);
    } else {
      return Presence.setGroupchat(state, payload);
    }
  };

  private static setChat = (state: IState, presence: IPresence): IState => {
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
      const priorityConnection: IUserConnection = connections.sort(
        (a: IUserConnection, b: IUserConnection) => a.priority - b.priority
      )[0];

      user = { ...user, status: priorityConnection.status, connections };

      return { ...state, channels: [...channels, user] };
    }

    return state;
  };

  private static setGroupchat = (
    state: IState,
    presence: IPresence
  ): IState => {
    let room: IRoom = state.channels.find(
      (channel: IChannel) => channel.jid === presence.from.split('/')[0]
    ) as IRoom;

    const channels = state.channels.filter(
      (channel: IChannel) => channel !== room
    );

    if (room) {
      // if presence is received, set channel to connected
      room = {
        ...room,
        isConnected: true,
        isConnecting: false,
        isUnableToConnect: false,
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
            color: ColorUtil.stringToHexColor(nickname),
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

      return { ...state, channels: [...channels, room] };
    }

    return state;
  };
}
