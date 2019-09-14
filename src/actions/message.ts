import moment from 'moment';

import IChannel from '../interfaces/IChannel';
import IChannelUser from '../interfaces/IChannelUser';
import IMessage from '../interfaces/IMessage';
import IMessageReceive from '../interfaces/IMessageReceive';
import IMessageSend from '../interfaces/IMessageSend';
import IMessageUrl from '../interfaces/IMessageUrl';
import IRoom from '../interfaces/IRoom';
import IState from '../interfaces/IState';
import IUser from '../interfaces/IUser';

import { saveRooms } from './channel';
import { handleOnMessage } from './notification';

import { stringToHexColor } from '../utils/colorUtils';
import { makeId } from '../utils/stringUtils';

const { ipcRenderer } = window.require('electron');

export const messageActions: any = {
  sendMessage(messageSend: IMessageSend) {
    return (state: IState): IState => {
      ipcRenderer.send('xmpp-send-message', messageSend);

      if (state.current && state.current.type === 'chat') {
        const newState: IState = { ...state };
        const message: IMessage = {
          id: messageSend.id,
          index: 0,
          channelName: messageSend.channelName,
          to: messageSend.to,
          from: messageSend.from,
          body: messageSend.body,
          urls: [],
          timestamp: moment(),
          userNickname:
            newState.profile.vCard && newState.profile.vCard.fullName
              ? newState.profile.vCard.fullName
              : newState.profile.username,
          color: newState.profile.color,
          isMe: true,
          isRead: true,
          isHistory: false,
          isMentioningMe: false,
        };
        processMessage(newState, message, [], '');
        addMessage(newState, message, 'chat', messageSend.body);

        return newState;
      }

      return state;
    };
  },
  receiveMessage(messageReceive: IMessageReceive) {
    return (state: IState): IState => {
      if (messageReceive.type === 'error') {
        return {
          ...state,
          notifications: {
            ...state.notifications,
            snackbar: [
              ...state.notifications.snackbar,
              {
                id: new Date().getTime() + Math.random() + '',
                source: 'message',
                variant: 'error',
                message: `Unable to send message to ${messageReceive.from}`,
              },
            ],
          },
        };
      }

      const newState: IState = { ...state };
      let channelName: string = messageReceive.from.split('/')[0];
      let userNickname: string = messageReceive.from.split('/')[1];
      let color: string = stringToHexColor(userNickname);
      let channel: IRoom | IUser | undefined = newState.channels.find(
        (c: IChannel) => c.type === messageReceive.type && c.jid === channelName
      ) as IRoom | IUser;
      let channelUsers: IChannelUser[] = [];
      let myChannelNickname = '';

      // assign internal id if one is not received
      if (!messageReceive.id) {
        messageReceive.id = `gong-${makeId}`;
      }

      switch (messageReceive.type) {
        case 'groupchat':
          if (channel) {
            channel = channel as IRoom; // TODO: Need to type check
            channelUsers = channel.users;
            myChannelNickname = channel.myNickname;
            const channelUser: IChannelUser | undefined = !channel.users
              ? undefined
              : channel.users.find(
                  (u: IChannelUser) => u.nickname === userNickname
                );
            if (channelUser) {
              userNickname = channelUser.nickname;
              color = channelUser.color;
            }
          }
          break;
        case 'chat':
          if (channel) {
            channel = channel as IUser; // TODO: Need to type check
            userNickname = channel.username;
            color = channel.color;

            // update session jid
            if (channel.sessionJid !== messageReceive.from) {
              channel.sessionJid = messageReceive.from;
              const session = channel.connections.find(
                connection => connection.jid === messageReceive.from
              );
              if (session) {
                channel.status = session.status;
              }
            }
            if (newState.current && newState.current.jid === channel.jid) {
              (newState.current as IUser).sessionJid = messageReceive.from;
            }
          } else {
            channelName = messageReceive.from;
          }
          break;
        default:
          break;
      }

      const message: IMessage = {
        id: messageReceive.id,
        index: 0,
        channelName,
        to: newState.settings.jid,
        from: messageReceive.from,
        body: messageReceive.body,
        urls: [],
        timestamp: messageReceive.timestamp,
        isMe: false,
        isRead: false,
        isHistory: messageReceive.isHistory,
        isMentioningMe: false,
        userNickname,
        color,
      };

      processMessage(newState, message, channelUsers, myChannelNickname);
      addMessage(newState, message, messageReceive.type, messageReceive.body);

      return newState;
    };
  },
  markMessagesRead(channelJid: string) {
    return (state: IState): IState => {
      let current = state.current;
      const channels = state.channels.map((channel: IChannel) => {
        if (channel.jid === channelJid) {
          const newChannel = {
            ...channel,
            messages: channel.messages.map((message: IMessage) => ({
              ...message,
              isRead: true,
            })),
            unreadMessages: 0,
            hasUnreadMentionMe: false,
          };
          if (state.current && state.current.jid === channelJid) {
            current = newChannel;
          }
          return newChannel;
        } else {
          return channel;
        }
      });
      return {
        ...state,
        current,
        channels,
      };
    };
  },
};

const processMessage = (
  state: IState,
  message: IMessage,
  channelUsers: IChannelUser[],
  myChannelNickname: string
) => {
  let formattedMessage = message.body;

  if (formattedMessage) {
    // check if message is me
    message.isMe = message.isMe || message.userNickname === myChannelNickname;

    // process urls
    if (state.settings.renderVideos) {
      message.urls = [...message.urls, ...getVideoUrls(message.body)];
    }
    if (state.settings.renderGetYarn) {
      message.urls = [...message.urls, ...getGetYarnUrls(message.body)];
    }
    if (state.settings.renderImages) {
      message.urls = [...message.urls, ...getImageUrls(message.body)];
    }

    // escape tags
    formattedMessage = formattedMessage.replace(/</g, '&lt;');
    formattedMessage = formattedMessage.replace(/>/g, '&gt;');

    // handle mentions this only applies to IRoom
    channelUsers.forEach((user: IChannelUser) => {
      const isMe = user.nickname === myChannelNickname;

      // handle mentions with @
      const htmlWithAt = `<span class="${isMe ? 'mention-me' : 'mention'}">@${
        user.nickname
      }</span>`;
      const regExpWithAt = new RegExp(`@${user.nickname}\\b`, 'gi');

      // handle mentions without @
      const htmlWithoutAt = `<span class="${isMe ? 'mention-me' : 'mention'}">${
        user.nickname
      }</span>`;
      const regExpWithoutAt = new RegExp(
        // TODO: test@test matches, should not match so emails get generated properly
        `(?<=[^a-zA-Z0-9@]|\\s|^)${user.nickname}(?=\\W|\\s+|$)(?=[^@]|$)`,
        'gi'
      );

      // if mentioned me
      message.isMentioningMe =
        message.isMentioningMe ||
        ((regExpWithAt.test(formattedMessage) ||
          regExpWithoutAt.test(formattedMessage)) &&
          !message.isHistory &&
          isMe);

      // replace all the things
      formattedMessage = formattedMessage.replace(regExpWithAt, htmlWithAt);
      formattedMessage = formattedMessage.replace(
        regExpWithoutAt,
        htmlWithoutAt
      );
    });

    // handle new lines
    message.body = formattedMessage
      .replace(/\n\r/g, '<br />')
      .replace(/\n/g, '<br />');
  }
};

const getVideoUrls = (text: string): IMessageUrl[] => {
  if (text) {
    const linkConfig = [
      {
        // find youtube videos, regExp from: https://github.com/regexhq/youtube-regex/blob/master/index.js
        source: 'youtube',
        regEx: new RegExp(
          /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gi
        ),
      },
      {
        source: 'twitch',
        regEx: new RegExp(/(?:twitch\.tv\/)(\S{1,})/gi),
      },
      {
        source: 'soundcloud',
        regEx: new RegExp(/(?:soundcloud\.com\/)(\S{1,})/gi),
      },
      {
        source: 'vimeo',
        regEx: new RegExp(/(?:(https|http):\/\/vimeo\.com\/)(\S{1,})/gi),
      },
    ];

    let urls: any[] = [];

    linkConfig.forEach((config: any) => {
      const matches = text.match(config.regEx);
      if (matches) {
        urls = [
          ...urls,
          ...matches.map((url: string) => ({
            type: 'video',
            source: config.source,
            url,
          })),
        ];
      }
    });

    return urls;
  }
  return [];
};

const getGetYarnUrls = (text: string): IMessageUrl[] => {
  if (text) {
    const getYarnRegExp = new RegExp(
      /(?:getyarn\.io\/yarn-clip\/)([a-zA-Z0-9_-]{36,36})(\b)/gi
    );
    const scannedGetYarnUrls = text.match(getYarnRegExp);
    if (scannedGetYarnUrls) {
      return scannedGetYarnUrls.map((url: string) => ({
        type: 'getyarn',
        url,
      }));
    }
  }
  return [];
};

const getImageUrls = (text: string): IMessageUrl[] => {
  if (text) {
    const getImageRegExp = new RegExp(
      /(https?:\/\/.*\.(?:png|jpg|jpeg|gifv|gif))/gi
    );
    const scannedImageUrls = text.match(getImageRegExp);
    if (scannedImageUrls) {
      return scannedImageUrls.map((url: string) => ({
        type: 'image',
        url,
      }));
    }
  }
  return [];
};

const addMessage = (
  state: IState,
  message: IMessage,
  type: string,
  rawText: string
): IState => {
  // Looks for channel, if found, it will update it
  const updated = updateChannel(state, type, message, rawText);
  if (!updated) {
    // if no channel is found add it to the open channels
    addToOpenChannels(state, message, rawText);
  }

  return { ...state };
};

const updateChannel = (
  state: IState,
  type: string,
  message: IMessage,
  rawText: string
): boolean => {
  let channelUpdated = false;
  let lastReadTimestampUpdated = false;

  state.channels = [
    ...state.channels.map((channel: IChannel | IUser | IRoom) => {
      if (channel.jid === message.channelName && channel.type === type) {
        channelUpdated = true;

        const isCurrent = !!(
          state.current &&
          state.current.jid === message.channelName &&
          state.current.type === type
        );
        const isUnreadOne = !state.current || state.current.jid !== channel.jid;
        const isUnreadTwo =
          !(channel as IRoom).lastReadTimestamp ||
          message.timestamp.diff(
            (channel as IRoom).lastReadTimestamp,
            'seconds'
          ) > 0;
        message.isRead = !isUnreadOne || !isUnreadTwo || isCurrent;

        const newChannel: IChannel = {
          ...channel,
          inputText: '',
          messageIndex: channel.messageIndex + 1,
          messages: [
            ...(message.isMe
              ? channel.messages.map((message: IMessage) => ({
                  ...message,
                  isRead: true,
                }))
              : channel.messages),
            { ...message, index: channel.messageIndex + 1 },
          ],
          unreadMessages: message.isMe
            ? 0
            : isUnreadOne && isUnreadTwo
            ? channel.unreadMessages + 1
            : channel.unreadMessages,
          hasUnreadMentionMe:
            !message.isMe &&
            isUnreadOne &&
            (message.isMentioningMe ||
              channel.messages.find(
                (m: IMessage) => m.isMentioningMe && !m.isRead
              ) !== undefined),
        };

        if (type === 'groupchat') {
          if (!isUnreadOne) {
            (newChannel as IRoom).lastReadTimestamp = moment();
            lastReadTimestampUpdated = true;
          }

          if (!message.isHistory && message.isMentioningMe) {
            const channelUser = (newChannel as IRoom).users.find(
              user => user.nickname === message.userNickname
            );
            if (channelUser) {
              channelUser.lastTimeMentionedMe = moment();
            }
          }
        }

        log(state.profile.jid, channel, message);

        if (isCurrent) {
          state.current = newChannel;
        }

        return newChannel;
      }
      return channel;
    }),
  ];

  if (channelUpdated) {
    handleOnMessage(state, message, type, rawText);
  }

  if (!message.isHistory && lastReadTimestampUpdated) {
    saveRooms(state.channels);
  }

  return channelUpdated;
};

const addToOpenChannels = (
  state: IState,
  message: IMessage,
  rawText: string
) => {
  if (state.current) {
    message.isRead = state.current.jid === message.channelName;
  }

  const newChannel: IChannel = {
    type: 'chat',
    order: 10,
    jid: message.channelName,
    name: message.channelName,
    inputText: '',
    messageIndex: 0,
    messages: [message],
    unreadMessages: message.isRead ? 1 : 0,
    hasUnreadMentionMe: message.isMentioningMe,
    scrollPosition: -1,
    hasNoMoreLogs: undefined,
  };
  state.channels = [...state.channels, newChannel];

  handleOnMessage(state, message, 'chat', rawText);
};

const log = (user: string, channel: IChannel, message: IMessage) => {
  ipcRenderer.send('set-log', {
    user,
    date: message.timestamp.format('YYYY-MM-DD'),
    channel,
    message: { ...message, timestamp: message.timestamp.format() },
  });
};
