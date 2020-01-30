import { Moment } from 'moment';

import IMessageUrl from './IMessageUrl';

export default interface IMessage {
  id: string;
  channelName: string;
  to: string;
  from: string;
  body: string;
  urls: IMessageUrl[];
  mentions: string[];
  timestamp: Moment;
  userNickname: string;
  myNickname: string;
  color: string;
  isRead: boolean;
  isHistory: boolean;
  isMe: boolean;
  isMentioningMe: boolean;
}
