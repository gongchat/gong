const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

import * as moment from 'moment';

import IChannel from 'src/interfaces/IChannel';
import IChannelUser from 'src/interfaces/IChannelUser';
import IRoom from 'src/interfaces/IRoom';
import IRoomJoin from 'src/interfaces/IRoomJoin';
import IRoomSaved from 'src/interfaces/IRoomSaved';
import IState from 'src/interfaces/IState';

import Channel from './channel';

export default class Room {
  public static addSavedToChannels = (state: IState): IState => {
    let channels: IRoomSaved[] = electronStore.get('channels');

    if (channels) {
      channels.forEach((channel: IRoomSaved) => {
        const channelJoin: IRoomJoin = {
          jid: channel.jid,
          channelName: channel.name,
          nickname: channel.nickname,
          password: channel.password,
        };
        ipcRenderer.send('xmpp-subscribe-to-room', channelJoin);
      });
    } else {
      channels = [];
    }

    return {
      ...state,
      channels: [
        ...state.channels,
        ...channels.map((roomSaved: IRoomSaved) => {
          const room: IRoom = {
            type: 'groupchat',
            order: 20,
            jid: roomSaved.jid,
            password: roomSaved.password,
            name: roomSaved.name,
            myNickname: roomSaved.nickname,
            isConnected: false,
            isConnecting: true,
            connectionError: '',
            messages: [],
            users: [],
            unreadMessages: 0,
            hasUnreadMentionMe: false,
            scrollPosition: 0,
            lastReadTimestamp: moment(roomSaved.lastReadTimestamp),
          };
          return room;
        }),
      ],
    };
  };

  public static addToChannels = (
    state: IState,
    roomJoin: IRoomJoin
  ): IState => {
    if (state.channels.find((c: IChannel) => c.jid === roomJoin.jid)) {
      return state;
    }
    const room: IRoom = {
      type: 'groupchat',
      order: 20,
      jid: roomJoin.jid,
      password: roomJoin.password,
      name: roomJoin.channelName,
      messages: [],
      users: [],
      isConnected: false,
      isConnecting: true,
      connectionError: '',
      myNickname: roomJoin.nickname,
      unreadMessages: 0,
      hasUnreadMentionMe: false,
      scrollPosition: 0,
      lastReadTimestamp: undefined,
    };
    const channels: IChannel[] = [...state.channels, room];
    ipcRenderer.send('xmpp-subscribe-to-room', roomJoin);
    Channel.saveRooms(channels);
    return {
      ...state,
      channels,
    };
  };

  public static selectUser = (state: IState, user: IChannelUser): IState => {
    const channel = state.channels.find(
      (c: IChannel) => c.jid === user.jid && c.type === 'chat'
    );

    if (!channel) {
      const newChannel: IChannel = {
        type: 'chat',
        order: 10,
        jid: user.jid,
        name: user.jid,
        messages: [],
        unreadMessages: 0,
        hasUnreadMentionMe: false,
        scrollPosition: 0,
      };
      return {
        ...state,
        channels: [...state.channels, newChannel],
        current: newChannel,
      };
    } else {
      return {
        ...state,
        current: channel,
      };
    }
  };

  public static edit = (state: IState, payload: any): IState => {
    const channel = state.channels.find((c: IChannel) => c.jid === payload.jid);
    if (channel) {
      const room: IRoom = {
        type: 'groupchat',
        order: 20,
        jid: payload.room.jid,
        password: payload.room.password,
        name: payload.room.channelName,
        messages: [],
        users: [],
        isConnected: false,
        isConnecting: true,
        connectionError: '',
        myNickname: payload.room.nickname,
        unreadMessages: 0,
        hasUnreadMentionMe: false,
        scrollPosition: 0,
        lastReadTimestamp: undefined,
      };
      const channels: IChannel[] = [
        ...state.channels.filter((c: IChannel) => c !== channel),
        room,
      ];
      ipcRenderer.send('xmpp-subscribe-to-room', payload.room);
      Channel.saveRooms(channels);
      return {
        ...state,
        channels,
      };
    } else {
      return state;
    }
  };

  public static setNickname = (state: IState, payload: any): IState => {
    ipcRenderer.send('xmpp-set-room-nickname', {
      jid: payload.jid,
      nickname: payload.newNickname,
    });
    const channels = state.channels.map((channel: IChannel) => {
      if (channel.jid === payload.jid && channel.type === 'groupchat') {
        const room = channel as IRoom;
        const user = room.users.find(
          (u: IChannelUser) =>
            u.nickname !== payload.newNickname &&
            u.nickname !== payload.currentNickname
        );
        if (user) {
          return { ...channel, myNickname: payload.newNickname };
        }
      }
      return channel;
    });
    Channel.saveRooms(channels);
    return {
      ...state,
      channels,
    };
  };
}
