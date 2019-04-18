const { ipcRenderer } = window.require('electron');
const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

import * as moment from 'moment';

import IChannel from 'src/interfaces/IChannel';
import IMessage from 'src/interfaces/IMessage';
import IRoom from 'src/interfaces/IRoom';
import IRoomSaved from 'src/interfaces/IRoomSaved';
import IState from 'src/interfaces/IState';

import { setMenuBarNotificationOnChannelSelect } from './notification';

export const channelActions = {
  removeChannel(jid: string, state: IState): IState {
    const channel: IChannel | undefined = state.channels.find(
      (c: IChannel) => c.jid === jid
    );
    if (channel) {
      const channels: IChannel[] = state.channels.filter(c => c !== channel);
      ipcRenderer.send('xmpp-unsubscribe-to-room', channel);
      saveRooms(channels);
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
  },
  selectChannel(channelJid: string, state: IState): IState {
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
    saveRooms(channels);
    setMenuBarNotificationOnChannelSelect(newState);
    return newState;
  },
  setChannelScrollPosition(payload: any, state: IState): IState {
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
  },
  getChannelLogs(channel: IChannel, state: IState) {
    ipcRenderer.send('get-log', {
      user: state.profile.jid,
      date:
        channel.messages && channel.messages.length > 0
          ? moment(channel.messages[0].timestamp).format('YYYY-MM-DD')
          : '',
      channel,
    });

    const current =
      state.current && state.current.jid === channel.jid
        ? {
            ...state.current,
            isRequestingLogs: true,
          }
        : state.current;

    const channels = state.channels.map((c: IChannel) => {
      if (c.jid === channel.jid) {
        return {
          ...c,
          isRequestingLogs: true,
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
  },
  setChannelLogs(payload: any, state: IState) {
    const { channelJid, messages, hasNoMoreLogs } = payload;

    messages.forEach(message => {
      message.timestamp = moment(message.timestamp);
      message.isRead = true;
    });

    const current =
      state.current && state.current.jid === channelJid
        ? {
            ...state.current,
            messages:
              messages.length > 0
                ? [...messages, ...state.current.messages]
                : state.current.messages,
            hasNoMoreLogs,
            isRequestingLogs: false,
          }
        : state.current;

    const channels = state.channels.map((c: IChannel) => {
      if (c.jid === channelJid) {
        return {
          ...c,
          messages:
            messages.length > 0 ? [...messages, ...c.messages] : c.messages,
          hasNoMoreLogs,
          isRequestingLogs: false,
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
  },
};

export const saveRooms = (channels: IChannel[]) => {
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
