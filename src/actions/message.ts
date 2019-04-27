import moment from 'moment';
import sanitizeHtml from 'sanitize-html';

import MarkdownIt from 'markdown-it';

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

import ColorUtil from '../utils/colorUtil';

const { ipcRenderer } = window.require('electron');

const markdownIt = new MarkdownIt({
  linkify: true,
  html: true,
  typographer: true,
});
const emoji = require('markdown-it-emoji'); // tslint:disable-line

const ALLOWED_TAGS = [
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'p',
  'a',
  'ul',
  'ol',
  'nl',
  'li',
  'b',
  'i',
  'strong',
  'em',
  'strike',
  'code',
  'hr',
  'br',
  'div',
  'table',
  'thead',
  'caption',
  'tbody',
  'tr',
  'th',
  'td',
  'pre',
  'iframe',
  'span',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'name', 'target'],
  span: ['class'],
};

export const messageActions = {
  sendMessage(messageSend: IMessageSend, state: IState): IState {
    ipcRenderer.send('xmpp-send-message', messageSend);

    const newState: IState = { ...state };
    if (newState.current && newState.current.type === 'chat') {
      const message: IMessage = {
        id: messageSend.id,
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
        isRead: true,
        isHistory: false,
        isMentioningMe: false,
      };
      processMessage(newState, message, [], '');
      addMessage(newState, message, 'chat', messageSend.body);
    }
    return newState;
  },
  receiveMessage(messageReceive: IMessageReceive, state: IState): IState {
    if (messageReceive.type === 'error') {
      return {
        ...state,
        snackbarNotifications: [
          ...state.snackbarNotifications,
          {
            id: new Date().getTime() + Math.random() + '',
            source: 'message',
            variant: 'error',
            message: `Unable to send message to ${messageReceive.from}`,
          },
        ],
      };
    }

    const newState: IState = { ...state };
    let channelName: string = messageReceive.from.split('/')[0];
    let userNickname: string = messageReceive.from.split('/')[1];
    let color: string = ColorUtil.stringToHexColor(userNickname);
    let channel: IRoom | IUser | undefined = newState.channels.find(
      (c: IChannel) => c.type === messageReceive.type && c.jid === channelName
    ) as IRoom | IUser;
    let channelUsers: IChannelUser[] = [];
    let myChannelNickname = '';

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
      channelName,
      to: newState.settings.jid,
      from: messageReceive.from,
      body: messageReceive.body,
      urls: [],
      timestamp: messageReceive.timestamp,
      isRead: false,
      isHistory: messageReceive.isHistory,
      isMentioningMe: false,
      userNickname,
      color,
    };

    processMessage(newState, message, channelUsers, myChannelNickname);
    addMessage(newState, message, messageReceive.type, messageReceive.body);

    return newState;
  },
};

const processMessage = (
  state: IState,
  message: IMessage,
  channelUsers: IChannelUser[],
  myChannelNickname: string
) => {
  let formattedMessage = message.body;

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
      (regExpWithAt.test(formattedMessage) ||
        regExpWithoutAt.test(formattedMessage)) &&
      !message.isHistory &&
      isMe;

    // replace all the things
    formattedMessage = formattedMessage.replace(regExpWithAt, htmlWithAt);
    formattedMessage = formattedMessage.replace(regExpWithoutAt, htmlWithoutAt);
  });

  // markdown the message
  formattedMessage = sanitizeHtml(
    markdownIt.use(emoji).renderInline(formattedMessage),
    {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
    }
  );

  // handle new lines
  message.body = formattedMessage
    .replace(/\n\r/g, '<br />')
    .replace(/\n/g, '<br />');
};

const getVideoUrls = (text: string): IMessageUrl[] => {
  // find youtube videos, regExp from: https://github.com/regexhq/youtube-regex/blob/master/index.js
  const youtubeRegExp = new RegExp(
    /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g
  );
  const scannedYoutubeUrls = text.match(youtubeRegExp);
  if (scannedYoutubeUrls) {
    return scannedYoutubeUrls.map((url: string) => ({
      type: 'video',
      url,
    }));
  } else {
    return [];
  }
};

const getGetYarnUrls = (text: string): IMessageUrl[] => {
  const getYarnRegExp = new RegExp(
    /(?:getyarn\.io\/yarn-clip\/)([a-zA-Z0-9_-]{36,36})(\b)/g
  );
  const scannedGetYarnUrls = text.match(getYarnRegExp);
  if (scannedGetYarnUrls) {
    return scannedGetYarnUrls.map((url: string) => ({
      type: 'getyarn',
      url,
    }));
  } else {
    return [];
  }
};

const getImageUrls = (text: string): IMessageUrl[] => {
  const getImageRegExp = new RegExp(/(https?:\/\/.*\.(?:png|jpg|gif))/gi);
  const scannedImageUrls = text.match(getImageRegExp);
  if (scannedImageUrls) {
    return scannedImageUrls.map((url: string) => ({
      type: 'image',
      url,
    }));
  } else {
    return [];
  }
};

const addMessage = (
  state: IState,
  message: IMessage,
  type: string,
  rawText: string
): IState => {
  // Checks if current, if it is, it will add the message to it
  updateCurrent(state, type, message, rawText);

  // Looks for channel, if found, it will update it
  const updated = updateChannel(state, type, message, rawText);
  if (!updated) {
    // if no channel is found add it to the open channels
    addToOpenChannels(state, message, rawText);
  }

  return { ...state };
};

const updateCurrent = (
  state: IState,
  type: string,
  message: IMessage,
  rawText: string
) => {
  if (
    state.current &&
    state.current.jid === message.channelName &&
    state.current.type === type
  ) {
    message.isRead = true;
    state.current = {
      ...state.current,
      messages: [...state.current.messages, message],
    };

    handleOnMessage(state, message, type, rawText);
  }
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

        const isUnreadOne = !state.current || state.current.jid !== channel.jid;
        const isUnreadTwo =
          !(channel as IRoom).lastReadTimestamp ||
          message.timestamp.diff(
            (channel as IRoom).lastReadTimestamp,
            'seconds'
          ) > 0;
        message.isRead = !isUnreadOne || !isUnreadTwo;

        const newChannel = {
          ...channel,
          messages: [...channel.messages, message],
          unreadMessages:
            isUnreadOne && isUnreadTwo
              ? channel.unreadMessages + 1
              : channel.unreadMessages,
          hasUnreadMentionMe:
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
    messages: [message],
    unreadMessages: message.isRead ? 1 : 0,
    hasUnreadMentionMe: message.isMentioningMe,
    scrollPosition: -1,
    hasNoMoreLogs: undefined,
    isRequestingLogs: false,
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
