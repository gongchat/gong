import { Moment } from 'moment';

export default interface IChannelUser {
  jid: string;
  role: 'moderator' | 'participant';
  nickname: string;
  color: string;
  lastTimeMentionedMe: Moment | undefined;
}
