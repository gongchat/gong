const { ipcRenderer } = window.require('electron');
const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

import * as moment from 'moment';

import IChannel from 'src/interfaces/IChannel';
import IMessage from 'src/interfaces/IMessage';
import IRoom from 'src/interfaces/IRoom';
import IRoomSaved from 'src/interfaces/IRoomSaved';
import IState from 'src/interfaces/IState';

import Notification from './notification';

export default class Channel {
  public static remove = (state: IState, jid: string): IState => {
    const channel: IChannel | undefined = state.channels.find(
      (c: IChannel) => c.jid === jid
    );
    if (channel) {
      const channels: IChannel[] = state.channels.filter(c => c !== channel);
      ipcRenderer.send('xmpp-unsubscribe-to-room', channel);
      Channel.saveRooms(channels);
      return {
        ...state,
        channels,
        current:
          state.current && state.current.jid === jid
            ? undefined
            : state.current,
      };
    } else {
      return state;
    }
  };

  public static select = (state: IState, channelJid: string): IState => {
    const channels: IChannel[] = state.channels.map((channel: IChannel) => {
      if (channel.jid === channelJid) {
        const newChannel = {
          ...channel,
          unreadMessages: 0,
          hasUnreadMentionMe: false,
        };

        if (channel.type === 'groupchat') {
          (newChannel as IRoom).lastReadTimestamp = moment();
        }

        return newChannel;
      } else {
        if (state.current && state.current.jid === channel.jid) {
          return {
            ...channel,
            messages: channel.messages.map((message: IMessage) => ({
              ...message,
              isRead: true,
            })),
          };
        }
        return channel;
      }
    });
    const newState: IState = {
      ...state,
      current: channels.find((channel: IChannel) => channel.jid === channelJid),
      channels,
    };
    Channel.saveRooms(channels);
    Notification.setMenuBarNotificationOnChannelSelect(newState);
    return newState;
  };

  public static setScrollPosition = (state: IState, payload: any): IState => {
    // do not need to update current as it only matters when we change channels
    return {
      ...state,
      channels: state.channels.map((channel: IChannel) => {
        if (channel.jid === payload.jid) {
          return { ...channel, scrollPosition: payload.position };
        }
        return channel;
      }),
    };
  };

  public static saveRooms = (channels: IChannel[]) => {
    electronStore.set(
      'channels',
      channels
        .filter((channel: IChannel) => channel.type === 'groupchat')
        .map((room: IRoom) => {
          const roomSaved: IRoomSaved = {
            jid: room.jid,
            name: room.name,
            type: room.type,
            nickname: room.myNickname,
            password: room.password,
            lastReadTimestamp: room.lastReadTimestamp,
          };
          return roomSaved;
        })
    );
  };
}
