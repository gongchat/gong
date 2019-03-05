import { Moment } from 'moment';

export default interface IRoomSaved {
  jid: string;
  name: string;
  type: string;
  nickname: string;
  password: string;
  lastReadTimestamp: Moment | undefined;
}
