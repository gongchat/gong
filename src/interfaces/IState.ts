import IApp from './IApp';
import IChannel from './IChannel';
import IConnection from './IConnection';
import IDiscover from './IDiscover';
import INotifications from './INotifications';
import IProfile from './IProfile';
import IRoom from './IRoom';
import ISettings from './ISettings';
import IUser from './IUser';

export default interface IState {
  app: IApp;
  connection: IConnection;
  settings: ISettings;
  profile: IProfile;
  channels: Array<IRoom | IChannel | IUser>;
  current?: IChannel | IRoom | IUser;
  discover: IDiscover;
  notifications: INotifications;

  // TODO: once theme is better defined convert to an interface
  theme: any;
}
