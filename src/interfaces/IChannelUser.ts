import { Moment } from 'moment';

export default interface IChannelUser {
  channelJid: string;
  userJid: string;
  role: 'moderator' | 'participant';
  nickname: string;
  color: string;
  lastTimeMentionedMe: Moment | undefined;
}
