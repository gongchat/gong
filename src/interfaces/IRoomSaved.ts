import { Moment } from 'moment';

export default interface IRoomSaved {
  jid: string;
  name: string;
  type: 'groupchat';
  nickname: string;
  password: string;
  lastReadTimestamp: Moment | undefined;
  lastReadMessageId: string;
}
