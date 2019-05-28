import moment from 'moment';

import IChannel from '../interfaces/IChannel';
import IChannelUser from '../interfaces/IChannelUser';
import IRoom from '../interfaces/IRoom';
import IRoomJoin from '../interfaces/IRoomJoin';
import IRoomSaved from '../interfaces/IRoomSaved';
import IState from '../interfaces/IState';

import { saveRooms } from './channel';

const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();
const { ipcRenderer } = window.require('electron');

export const roomActions = {
  addRoomToChannels(roomJoin: IRoomJoin, state: IState): IState {
    if (state.channels.find((c: IChannel) => c.jid === roomJoin.jid)) {
      return state;
    }
    const room: IRoom = {
      type: 'groupchat',
      order: 20,
      jid: roomJoin.jid,
      password: roomJoin.password,
      name: roomJoin.channelName,
      inputText: '',
      messages: [],
      users: [],
      isConnected: false,
      isConnecting: true,
      connectionError: '',
      myNickname: roomJoin.nickname,
      unreadMessages: 0,
      hasUnreadMentionMe: false,
      hasNoMoreLogs: undefined,
      scrollPosition: -1,
      lastReadTimestamp: undefined,
      lastReadMessageId: '',
    };
    const channels: IChannel[] = [...state.channels, room];
    ipcRenderer.send('xmpp-subscribe-to-room', roomJoin);
    saveRooms(channels);
    return {
      ...state,
      channels,
    };
  },
  selectRoomUser(user: IChannelUser, state: IState): IState {
    let channel = state.channels.find(
      (c: IChannel) => c.jid === user.jid && c.type === 'chat'
    );

    if (!channel) {
      channel = state.channels.find(
        (c: IChannel) => c.jid === user.jid.split('/')[0] && c.type === 'chat'
      );
    }

    if (!channel) {
      const newChannel: IChannel = {
        type: 'chat',
        order: 10,
        jid: user.jid,
        name: user.jid,
        inputText: '',
        messages: [],
        unreadMessages: 0,
        hasUnreadMentionMe: false,
        hasNoMoreLogs: undefined,
        scrollPosition: -1,
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
  },
  editRoom(jid: string, payload: any, state: IState): IState {
    const channel = state.channels.find((c: IChannel) => c.jid === jid);
    if (channel) {
      const room: IRoom = {
        type: 'groupchat',
        order: 20,
        jid: payload.jid,
        password: payload.password,
        name: payload.channelName,
        inputText: '',
        messages: [],
        users: [],
        isConnected: false,
        isConnecting: true,
        connectionError: '',
        myNickname: payload.nickname,
        unreadMessages: 0,
        hasUnreadMentionMe: false,
        hasNoMoreLogs: undefined,
        scrollPosition: -1,
        lastReadTimestamp: undefined,
        lastReadMessageId: '',
      };
      const channels: IChannel[] = [
        ...state.channels.filter((c: IChannel) => c !== channel),
        room,
      ];
      ipcRenderer.send('xmpp-subscribe-to-room', payload);
      saveRooms(channels);
      return {
        ...state,
        channels,
      };
    } else {
      return state;
    }
  },
  setChannelNickname(payload: any, state: IState): IState {
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
    saveRooms(channels);
    return {
      ...state,
      channels,
    };
  },
};

export const addSavedRoomsToChannels = (state: IState): IState => {
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
      ...state.channels.filter((channel: IChannel) => channel.type === 'chat'),
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
          inputText: '',
          messages: [],
          users: [],
          unreadMessages: 0,
          hasUnreadMentionMe: false,
          hasNoMoreLogs: undefined,
          scrollPosition: -1,
          lastReadTimestamp: moment(roomSaved.lastReadTimestamp),
          lastReadMessageId: roomSaved.lastReadMessageId,
        };
        return room;
      }),
    ],
  };
};
