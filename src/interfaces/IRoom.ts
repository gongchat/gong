import { Moment } from 'moment';

import IChannel from './IChannel';
import IChannelUser from './IChannelUser';

export default interface IRoom extends IChannel {
  password: string;
  users: IChannelUser[];
  myNickname: string;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string;
  lastReadTimestamp: Moment | undefined;
  lastReadMessageId: string;
}
