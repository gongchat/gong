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

export const roomActions: any = {
  addRoomToChannels(roomJoin: IRoomJoin) {
    return (state: IState): IState => {
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
        lastPingedTimestamp: undefined,
        isSearching: false,
        searchText: '',
        searchOrder: 'newest',
        searchResults: [],
      };
      const channels: IChannel[] = [...state.channels, room];
      ipcRenderer.send('xmpp-subscribe-to-room', roomJoin);
      saveRooms(channels);
      return {
        ...state,
        channels,
      };
    };
  },
  selectRoomUser(user: IChannelUser) {
    return (state: IState): IState => {
      let channel = state.channels.find(
        (c: IChannel) => c.jid === user.userJid && c.type === 'chat'
      );

      if (!channel) {
        channel = state.channels.find(
          (c: IChannel) =>
            c.jid === user.userJid.split('/')[0] && c.type === 'chat'
        );
      }

      if (!channel) {
        const newChannel: IChannel = {
          type: 'chat',
          order: 10,
          jid: user.userJid,
          name: user.userJid,
          inputText: '',
          messages: [],
          unreadMessages: 0,
          hasUnreadMentionMe: false,
          hasNoMoreLogs: undefined,
          scrollPosition: -1,
          isSearching: false,
          searchText: '',
          searchOrder: 'newest',
          searchResults: [],
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
  },
  editRoom(jid: string, payload: any) {
    return (state: IState): IState => {
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
          lastPingedTimestamp: undefined,
          isSearching: false,
          searchText: '',
          searchOrder: 'newest',
          searchResults: [],
        };
        const channels: IChannel[] = [
          ...state.channels.filter((c: IChannel) => c !== channel),
          room,
        ];
        ipcRenderer.send('xmpp-unsubscribe-to-room', channel);
        ipcRenderer.send('xmpp-subscribe-to-room', payload);
        saveRooms(channels);
        return {
          ...state,
          channels,
        };
      } else {
        return state;
      }
    };
  },
  setChannelNickname(payload: any) {
    return (state: IState): IState => {
      let current = state.current;
      const channels = state.channels.map((channel: IChannel) => {
        if (channel.jid === payload.jid && channel.type === 'groupchat') {
          const room = channel as IRoom;
          const user = room.users.find(
            (u: IChannelUser) => u.nickname === payload.currentNickname
          );
          const check = room.users.find(
            (u: IChannelUser) => u.nickname === payload.newNickname
          );
          if (user && !check) {
            ipcRenderer.send('xmpp-set-room-nickname', {
              jid: payload.jid,
              nickname: payload.newNickname,
            });
            const updatedChannel: IRoom = {
              ...(channel as IRoom),
              myNickname: payload.newNickname,
            };
            current = updatedChannel;
            return updatedChannel;
          }
        }
        return channel;
      });
      saveRooms(channels);
      return {
        ...state,
        channels,
        current,
      };
    };
  },
  sendRoomPings() {
    return (state: IState): IState => {
      const channels = [...state.channels];
      let didPing = false;
      channels.forEach(channel => {
        if (channel.type === 'groupchat') {
          const room = channel as IRoom;
          if (room.isConnected) {
            ipcRenderer.send(
              'xmpp-send-ping',
              `${room.jid}/${room.myNickname}`
            );
            didPing = true;
            room.lastPingedTimestamp = moment();
          }
        }
      });
      if (didPing) {
        return {
          ...state,
          channels,
        };
      }
      return state;
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
          lastPingedTimestamp: undefined,
          isSearching: false,
          searchText: '',
          searchOrder: 'newest',
          searchResults: [],
        };
        return room;
      }),
    ],
  };
};
