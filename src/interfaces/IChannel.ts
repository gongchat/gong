import IMessage from './IMessage';

export default interface IChannel {
  type: 'chat' | 'groupchat';
  order: number; // open - 10, rooms - 20, roster - 30
  jid: string;
  name: string;
  inputText: string;
  messages: IMessage[];
  unreadMessages: number;
  hasUnreadMentionMe: boolean;
  scrollPosition: number;
  hasNoMoreLogs: boolean | undefined;

  isSearching: boolean;
  searchText: string;
  searchOrder: 'newest' | 'oldest';
  searchResults: IMessage[];
}
