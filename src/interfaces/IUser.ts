import IChannel from './IChannel';
import IUserConnection from './IUserConnection';
import IVCard from './IVCard';

export default interface IUser extends IChannel {
  username: string;
  group: string;
  status: string;
  color: string;
  unreadMessages: number;
  connections: IUserConnection[];
  vCard: IVCard | undefined;
}
