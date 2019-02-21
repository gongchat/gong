import IChannel from './IChannel';
import IChannelUser from './IChannelUser';

export default interface IRoom extends IChannel {
  password: string;
  users: IChannelUser[];
  myNickname: string;
  isConnected: boolean;
  isConnecting: boolean;
  isUnableToConnect: boolean;
}
