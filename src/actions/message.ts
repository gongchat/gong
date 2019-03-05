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
import IMessageUrl from 'src/interfaces/IMessageUrl';
import IRoom from 'src/interfaces/IRoom';
import IState from 'src/interfaces/IState';
import IUser from 'src/interfaces/IUser';

import Notification from './notification';

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
        urls: [],
        timestamp: moment(),
        userNickname:
          newState.profile.vCard && newState.profile.vCard.fullName
            ? newState.profile.vCard.fullName
            : newState.profile.username,
        color: newState.profile.color,
        isHistory: false,
        isMentioningMe: false,
      };
      Message.processMessage(newState, message, [], '');
      Message.addMessage(newState, message, 'chat', messageSend.body);
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
      urls: [],
      timestamp: messageReceive.timestamp,
      isHistory: messageReceive.isHistory,
      isMentioningMe: false,
      userNickname,
      color,
    };

    Message.processMessage(newState, message, channelUsers, myChannelNickname);
    Message.addMessage(
      newState,
      message,
      messageReceive.type,
      messageReceive.body
    );

    return newState;
  };

  private static processMessage = (
    state: IState,
    message: IMessage,
    channelUsers: IChannelUser[],
    myChannelNickname: string
  ) => {
    let formattedMessage = message.body;

    // process urls
    if (state.settings.renderVideos) {
      message.urls = [...message.urls, ...Message.getVideoUrls(message.body)];
    }
    if (state.settings.renderGetYarn) {
      message.urls = [...message.urls, ...Message.getGetYarnUrls(message.body)];
    }
    if (state.settings.renderImages) {
      message.urls = [...message.urls, ...Message.getImageUrls(message.body)];
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
      const regExpWithAt = new RegExp(`\@${user.nickname}\\b`, 'gi');

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
      if (
        !message.isHistory &&
        isMe &&
        (regExpWithAt.test(formattedMessage) ||
          regExpWithoutAt.test(formattedMessage))
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

  private static getVideoUrls(text: string): IMessageUrl[] {
    // find youtube videos, regExp from: https://github.com/regexhq/youtube-regex/blob/master/index.js
    const youtubeRegExp = new RegExp(
      /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g
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
  }

  private static getGetYarnUrls(text: string): IMessageUrl[] {
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
  }

  private static getImageUrls(text: string): IMessageUrl[] {
    const getImageRegExp = new RegExp(/(https?:\/\/.*\.(?:png|jpg))/gi);
    const scannedImageUrls = text.match(getImageRegExp);
    if (scannedImageUrls) {
      return scannedImageUrls.map((url: string) => ({
        type: 'image',
        url,
      }));
    } else {
      return [];
    }
  }

  private static addMessage = (
    state: IState,
    message: IMessage,
    type: string,
    rawText: string
  ): IState => {
    // Checks if current, if it is, it will add the message to it
    Message.updateCurrent(state, type, message, rawText);

    // Looks for channel, if found, it will update it
    const channelUpdated = Message.updateChannel(state, type, message, rawText);
    if (!channelUpdated) {
      // if no channel is found add it to the open channels
      Message.addToOpenChannels(state, message, rawText);
    }

    return { ...state };
  };

  private static updateCurrent(
    state: IState,
    type: string,
    message: IMessage,
    rawText: string
  ) {
    if (
      state.current &&
      state.current.jid === message.channelName &&
      state.current.type === type
    ) {
      state.current = {
        ...state.current,
        messages: [...state.current.messages, message],
      };

      Notification.playAudioOnMessage(state, message, type, false);
      Notification.sendSystemNotificationOnMessage(
        state,
        message,
        type,
        false,
        rawText
      );

      if (!message.isHistory) {
        Notification.setMenuBarNotificationOnMessage(state);
      }
    }
  }

  private static updateChannel(
    state: IState,
    type: string,
    message: IMessage,
    rawText: string
  ): boolean {
    let channelUpdated: boolean = false;
    state.channels = [
      ...state.channels.map((channel: IChannel) => {
        if (channel.jid === message.channelName && channel.type === type) {
          channelUpdated = true;

          const isUnread = !state.current || state.current.jid !== channel.jid;
          Notification.playAudioOnMessage(state, message, type, isUnread);
          Notification.sendSystemNotificationOnMessage(
            state,
            message,
            type,
            isUnread,
            rawText
          );

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

    if (!message.isHistory) {
      Notification.setMenuBarNotificationOnMessage(state);
    }

    return channelUpdated;
  }

  private static addToOpenChannels(
    state: IState,
    message: IMessage,
    rawText: string
  ) {
    const isUnread =
      !state.current || state.current.jid !== message.channelName;

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

    Notification.playAudioOnMessage(state, message, 'chat', isUnread);
    Notification.sendSystemNotificationOnMessage(
      state,
      message,
      'chat',
      isUnread,
      rawText
    );

    if (message.isHistory) {
      Notification.setMenuBarNotificationOnMessage(state);
    }
  }
}
