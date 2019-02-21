const { ipcRenderer } = window.require('electron');

import * as moment from 'moment';
import * as sanitizeHtml from 'sanitize-html';

import * as MarkdownIt from 'markdown-it';
const markdownIt = new MarkdownIt({
  linkify: true,
  html: true,
  typographer: true,
});
const emoji = require('markdown-it-emoji'); // tslint:disable-line

import IChannel from 'src/interfaces/IChannel';
import IChannelUser from 'src/interfaces/IChannelUser';
import IMessage from 'src/interfaces/IMessage';
import IMessageReceive from 'src/interfaces/IMessageReceive';
import IMessageSend from 'src/interfaces/IMessageSend';
import IRoom from 'src/interfaces/IRoom';
import IState from 'src/interfaces/IState';
import IUser from 'src/interfaces/IUser';

import Settings from './settings';

import ColorUtil from 'src/utils/colorUtil';
import StringUtil from 'src/utils/stringUtils';

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

export default class Message {
  public static send = (state: IState, messageSend: IMessageSend): IState => {
    // TODO: if message fails to send it will fail silently, need to add acknowledgement
    // for some reason messages from yourself do not contain an id, need to look into this
    // as this is what I was intending to use for acknowledgement.

    ipcRenderer.send('xmpp-send-message', messageSend);

    const newState: IState = { ...state };
    if (newState.current && newState.current.type === 'chat') {
      const message: IMessage = {
        id: StringUtil.makeId(7),
        channelName: messageSend.to,
        to: messageSend.to,
        from: messageSend.from,
        body: messageSend.body,
        videoUrls: [],
        timestamp: moment(),
        userNickname:
          newState.profile.vCard && newState.profile.vCard.nickname
            ? newState.profile.vCard.nickname
            : newState.profile.username,
        color: newState.profile.color,
        isHistory: false,
        isMentioningMe: false,
      };
      Message.processMessage(message, [], '');
      Message.addMessage(newState, message, 'chat');
    }
    return newState;
  };

  public static receive = (
    state: IState,
    messageReceive: IMessageReceive
  ): IState => {
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
        } else {
          channelName = messageReceive.from;
        }
        break;
    }

    const message: IMessage = {
      id: messageReceive.id,
      channelName,
      to: newState.settings.jid,
      from: messageReceive.from,
      body: messageReceive.body,
      videoUrls: [],
      timestamp: messageReceive.timestamp,
      isHistory: messageReceive.isHistory,
      isMentioningMe: false,
      userNickname,
      color,
    };

    Message.processMessage(message, channelUsers, myChannelNickname);
    Message.addMessage(newState, message, messageReceive.type);

    return newState;
  };

  private static processMessage = (
    message: IMessage,
    channelUsers: IChannelUser[],
    myChannelNickname: string
  ) => {
    let formattedMessage = message.body;

    // find youtube videos, regExp from: https://github.com/regexhq/youtube-regex/blob/master/index.js
    const youtubeRegExp = new RegExp(
      /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g
    );
    const scannedYoutubeUrls = message.body.match(youtubeRegExp);
    if (scannedYoutubeUrls) {
      message.videoUrls = scannedYoutubeUrls;
    }

    // handle mentions this only applies to IRoom
    channelUsers.forEach((user: IChannelUser) => {
      const isMe = user.nickname === myChannelNickname;

      // handle mentions with @
      const htmlWithAt = `<span class="${isMe ? 'mention-me' : 'mention'}">@${
        user.nickname
      }</span>`;
      const regExpWithAt = new RegExp(`\@${user.nickname}\\b`, 'gi');
      if (!message.isHistory && isMe && regExpWithAt.test(formattedMessage)) {
        message.isMentioningMe = true;
      }

      // handle mentions without @
      const htmlWithoutAt = `<span class="${isMe ? 'mention-me' : 'mention'}">${
        user.nickname
      }</span>`;
      const regExpWithoutAt = new RegExp(
        // TODO: test@test matches, should not match so emails get generated properly
        `(?<=[^a-zA-Z0-9@]|\\s|^)${user.nickname}(?=\\W|\\s+|$)(?=[^@])`,
        'gi'
      );

      // if mentioned me
      if (
        !message.isHistory &&
        isMe &&
        (formattedMessage.match(regExpWithAt) ||
          formattedMessage.match(regExpWithoutAt))
      ) {
        message.isMentioningMe = true;
      }

      // replace all the things
      formattedMessage = formattedMessage.replace(regExpWithAt, htmlWithAt);
      formattedMessage = formattedMessage.replace(
        regExpWithoutAt,
        htmlWithoutAt
      );
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

  private static addMessage = (
    state: IState,
    message: IMessage,
    type: string
  ) => {
    // Checks if current, if it is, it will add the message to it
    Message.updateCurrent(state, type, message);

    // Looks for channel, if found, it will update it
    const channelUpdated = Message.updateChannel(state, type, message);
    if (!channelUpdated) {
      // if no channel is found add it to the open channels
      Message.addToOpenChannels(state, message);
    }

    return { ...state };
  };

  private static updateCurrent(state: IState, type: string, message: IMessage) {
    if (
      state.current &&
      state.current.jid === message.channelName &&
      state.current.type === type
    ) {
      Settings.playAudio(state, message, type, false);
      state.current = {
        ...state.current,
        messages: [...state.current.messages, message],
      };
    }
  }

  private static updateChannel(
    state: IState,
    type: string,
    message: IMessage
  ): boolean {
    let channelUpdated: boolean = false;
    state.channels = [
      ...state.channels.map((channel: IChannel) => {
        if (channel.jid === message.channelName && channel.type === type) {
          channelUpdated = true;

          const isUnread = !state.current || state.current.jid !== channel.jid;
          Settings.playAudio(state, message, type, isUnread);

          return {
            ...channel,
            messages: [...channel.messages, message],
            unreadMessages: isUnread
              ? channel.unreadMessages + 1
              : channel.unreadMessages,
            hasUnreadMentionMe: isUnread && message.isMentioningMe,
          };
        }
        return channel;
      }),
    ];
    return channelUpdated;
  }

  private static addToOpenChannels(state: IState, message: IMessage) {
    const isUnread =
      !state.current || state.current.jid !== message.channelName;
    Settings.playAudio(state, message, 'chat', isUnread);

    const newChannel: IChannel = {
      type: 'chat',
      order: 10,
      jid: message.channelName,
      name: message.channelName,
      messages: [message],
      unreadMessages: isUnread ? 1 : 0,
      hasUnreadMentionMe: message.isMentioningMe,
      scrollPosition: 0,
    };
    state.channels = [...state.channels, newChannel];
  }
}
