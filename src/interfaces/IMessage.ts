import { Moment } from 'moment';

import IMessageUrl from './IMessageUrl';

export default interface IMessage {
  id: string;
  channelName: string;
  to: string;
  from: string;
  body: string;
  urls: IMessageUrl[];
  timestamp: Moment;
  userNickname: string;
  color: string;
  isRead: boolean;
  isHistory: boolean;
  isMentioningMe: boolean;
}
