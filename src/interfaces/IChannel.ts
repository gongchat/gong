import IMessage from './IMessage';

export default interface IChannel {
  type: string; // chat, groupchat
  order: number; // open - 10, rooms - 20, roster - 30
  jid: string;
  name: string;
  messages: IMessage[];
  unreadMessages: number;
  hasUnreadMentionMe: boolean;
  scrollPosition: number;
  isRequestingLogs: boolean;
  hasNoMoreLogs: boolean | undefined;
}
