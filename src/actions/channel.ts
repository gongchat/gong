import moment from 'moment';

import IChannel from '../interfaces/IChannel';
import IMessage from '../interfaces/IMessage';
import IRoom from '../interfaces/IRoom';
import IRoomSaved from '../interfaces/IRoomSaved';
import IState from '../interfaces/IState';

import { setMenuBarNotificationOnChannelSelect } from './notification';

const { ipcRenderer } = window.require('electron');
const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

export const TRIM_AT: number = 200;
export const TRIM_TO: number = 150;

export const channelActions: any = {
  removeChannel(jid: string) {
    return (state: IState): IState => {
      const channel: IChannel | undefined = state.channels.find(
        (c: IChannel) => c.jid === jid
      );
      if (channel) {
        const channels: IChannel[] = state.channels.filter(
          (c: IChannel) => c !== channel
        );
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
    };
  },
  selectChannel(channelJid: string) {
    return (state: IState): IState => {
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
        current: channels.find(
          (channel: IChannel) => channel.jid === channelJid
        ),
        channels,
      };
      saveRooms(channels);
      setMenuBarNotificationOnChannelSelect(newState);
      return newState;
    };
  },
  setInputText(jid: string, text: string) {
    // do not need to update current as it only matters when we change channels
    return (state: IState): IState => ({
      ...state,
      channels: state.channels.map((channel: IChannel) => {
        if (channel.jid === jid) {
          return { ...channel, inputText: text };
        } else {
          return channel;
        }
      }),
    });
  },
  setSearchText(jid: string, text: string) {
    let current: IChannel;
    return (state: IState): IState => ({
      ...state,
      channels: state.channels.map((channel: IChannel) => {
        if (channel.jid === jid) {
          current = {
            ...channel,
            isSearching: !!text,
            searchText: text,
            searchResults: [],
          };
          ipcRenderer.send('search-log', {
            user: state.profile.jid,
            jid: jid,
            order: current.searchOrder,
            text: current.searchText,
          });
          return current;
        } else {
          return channel;
        }
      }),
      current:
        state.current && state.current.jid === jid ? current : state.current,
    });
  },
  setSearchOrder(jid: string, order: 'newest' | 'oldest') {
    let current: IChannel;
    return (state: IState): IState => ({
      ...state,
      channels: state.channels.map((channel: IChannel) => {
        if (channel.jid === jid) {
          current = {
            ...channel,
            isSearching: true,
            searchOrder: order,
            searchResults: [],
          };
          ipcRenderer.send('search-log', {
            user: state.profile.jid,
            jid: jid,
            order: current.searchOrder,
            text: current.searchText,
          });
          return current;
        } else {
          return channel;
        }
      }),
      current:
        state.current && state.current.jid === jid ? current : state.current,
    });
  },
  setSearchResults(results: any) {
    let current: IChannel;
    return (state: IState): IState => ({
      ...state,
      channels: state.channels.map((channel: IChannel) => {
        if (channel.jid === results.jid) {
          results.messages.forEach((message: IMessage) => {
            message.timestamp = moment(message.timestamp);
            message.isRead = true;
          });
          current = {
            ...channel,
            isSearching: false,
            searchResults: results.messages,
          };
          return current;
        } else {
          return channel;
        }
      }),
      current:
        state.current && state.current.jid === results.jid
          ? current
          : state.current,
    });
  },
  setChannelScrollPosition(channelJid: string, position: number) {
    return (state: IState): IState => ({
      ...state,
      channels: state.channels.map((channel: IChannel) => {
        if (channel.jid === channelJid) {
          return { ...channel, scrollPosition: position };
        }
        return channel;
      }),
    });
  },
  getChannelLogs(channel: IChannel) {
    return (state: IState): IState => {
      ipcRenderer.send('get-log', {
        user: state.profile.jid,
        date:
          channel.messages && channel.messages.length > 0
            ? moment(channel.messages[0].timestamp).format('YYYY-MM-DD')
            : '',
        channel,
      });
      return state;
    };
  },
  setChannelLogs({ channelJid, messages, hasNoMoreLogs }) {
    return (state: IState): IState => {
      let messageIndex = 0;

      const channels = state.channels.map((c: IChannel) => {
        if (c.jid === channelJid) {
          messageIndex = c.messageIndex + 1;
          messages.forEach((message: IMessage) => {
            message.timestamp = moment(message.timestamp);
            message.isRead = true;
            message.index = messageIndex;
            messageIndex++;
          });
          return {
            ...c,
            messageIndex,
            messages:
              messages.length > 0 ? [...messages, ...c.messages] : c.messages,
            hasNoMoreLogs,
            isRequestingLogs: false,
          };
        } else {
          return c;
        }
      });

      const current =
        state.current && state.current.jid === channelJid
          ? {
              ...state.current,
              messageIndex,
              messages:
                messages.length > 0
                  ? [...messages, ...state.current.messages]
                  : state.current.messages,
              hasNoMoreLogs,
              isRequestingLogs: false,
            }
          : state.current;

      return {
        ...state,
        current,
        channels,
      };
    };
  },
  trimOldMessages(jid: string) {
    return (state: IState): IState => {
      const newState = { ...state };
      let updatedChannel: IChannel | undefined;
      newState.channels = state.channels.map((channel: IChannel) => {
        if (channel.jid === jid && channel.messages.length >= TRIM_AT) {
          updatedChannel = {
            ...channel,
            hasNoMoreLogs: false,
            messages: channel.messages.slice(
              channel.messages.length - TRIM_TO,
              channel.messages.length
            ),
          };
          return updatedChannel;
        } else {
          return channel;
        }
      });
      if (updatedChannel && state.current && state.current.jid === jid) {
        newState.current = updatedChannel;
      }
      return newState;
    };
  },
};

export const saveRooms = (channels: IChannel[]) => {
  electronStore.set(
    'channels',
    channels
      .filter((channel: IChannel) => channel.type === 'groupchat')
      .map((channel: IChannel) => {
        const room = channel as IRoom;
        const roomSaved: IRoomSaved = {
          jid: room.jid,
          name: room.name,
          type: 'groupchat',
          nickname: room.myNickname,
          password: room.password,
          lastReadTimestamp: room.lastReadTimestamp,
          lastReadMessageId: room.lastReadMessageId,
        };
        return roomSaved;
      })
  );
};
