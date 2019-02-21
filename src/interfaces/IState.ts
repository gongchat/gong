import IChannel from './IChannel';
import IConnection from './IConnection';
import IDiscoverRoom from './IDiscoverRoom';
import IProfile from './IProfile';
import IRoom from './IRoom';
import ISettings from './ISettings';
import ISnackbarNotification from './ISnackbarNotification';
import ISubdomain from './ISubdomain';
import IUser from './IUser';

export default interface IState {
  connection: IConnection;
  settings: ISettings;
  profile: IProfile;

  channels: IChannel[];
  current?: IChannel | IRoom | IUser;

  showDiscover: boolean;
  subdomains: ISubdomain[];
  rooms: IDiscoverRoom[];

  showSettings: boolean;
  snackbarNotifications: ISnackbarNotification[];

  // TODO: once theme is better defined convert to an interface
  theme: any;
}
