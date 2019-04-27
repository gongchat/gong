import { Moment } from 'moment';

export default interface IChannelUser {
  jid: string;
  role: string;
  nickname: string;
  color: string;
  lastTimeMentionedMe: Moment | undefined;
}
