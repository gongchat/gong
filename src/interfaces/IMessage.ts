import { Moment } from 'moment';

export default interface IMessage {
  id: string;
  channelName: string;
  to: string;
  from: string;
  body: string;
  videoUrls: string[];
  timestamp: Moment;
  userNickname: string;
  color: string;
  isHistory: boolean;
  isMentioningMe: boolean;
}
