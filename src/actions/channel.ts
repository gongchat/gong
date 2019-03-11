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
          if (newChannel.messages && newChannel.messages.length > 0) {
            (newChannel as IRoom).lastReadMessageId =
              channel.messages[channel.messages.length - 1].id;
          }
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
            lastReadMessageId: room.lastReadMessageId,
          };
          return roomSaved;
        })
    );
  };

  public static addLoggedMessages = (state: IState, channel: IChannel) => {
    let messages: IMessage[] = [];
    let hasNoMoreLogs = false;
    const date =
      channel.messages && channel.messages.length > 0
        ? moment(channel.messages[0].timestamp).format('YYYY-MM-DD')
        : '';
    const logsElectronStore = new ElectronStore({
      cwd: `logs/${channel.jid}`,
      name: 'index',
    });
    const logs = logsElectronStore.get('logs');
    if (logs) {
      const currentLogIndex = date ? logs.indexOf(date) : logs.length - 1;
      if (currentLogIndex >= 0) {
        // this should be the first log, need to get any items for that day
        const currentMessagesElectronStore = new ElectronStore({
          cwd: `logs/${channel.jid}`,
          name: logs[currentLogIndex],
        });
        const currentSavedMessages: IMessage[] = currentMessagesElectronStore.get(
          'messages'
        );
        if (currentSavedMessages && currentSavedMessages.length > 0) {
          messages = currentSavedMessages.filter(
            (message: IMessage) =>
              channel.messages.find((m: IMessage) => m.id === message.id) ===
              undefined
          );
        }
        if (currentLogIndex - 1 >= 0) {
          const nextMessagesElectronStore = new ElectronStore({
            cwd: `logs/${channel.jid}`,
            name: logs[currentLogIndex - 1],
          });
          const nextSavedMessages = nextMessagesElectronStore.get('messages');
          if (nextSavedMessages && nextSavedMessages.length > 0) {
            messages = [...nextSavedMessages, ...messages];
          }
        } else {
          hasNoMoreLogs = true;
        }
        if (messages.length > 0) {
          messages.forEach((message: IMessage) => {
            message.timestamp = moment(message.timestamp);
          });
        }
      } else {
        hasNoMoreLogs = true;
      }
    } else {
      hasNoMoreLogs = true;
    }

    const current =
      state.current && state.current.jid === channel.jid
        ? {
            ...state.current,
            messages:
              messages.length > 0
                ? [...messages, ...state.current.messages]
                : state.current.messages,
            hasNoMoreLogs,
          }
        : state.current;

    const channels = state.channels.map((c: IChannel) => {
      if (c.jid === channel.jid) {
        return {
          ...c,
          messages:
            messages.length > 0 ? [...messages, ...c.messages] : c.messages,
          hasNoMoreLogs,
        };
      } else {
        return c;
      }
    });

    return {
      ...state,
      current,
      channels,
    };
  };
}
