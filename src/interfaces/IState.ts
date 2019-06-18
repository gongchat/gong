import IApp from './IApp';
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
  app: IApp;
  connection: IConnection;
  settings: ISettings;
  profile: IProfile;

  channels: Array<IRoom | IChannel | IUser>;
  current?: IChannel | IRoom | IUser;

  showDiscover: boolean;
  isSubdomainsLoaded: boolean;
  subdomains: ISubdomain[];
  isRoomsLoaded: boolean;
  rooms: IDiscoverRoom[];

  showSettings: boolean;
  snackbarNotifications: ISnackbarNotification[];
  menuBarNotification: string;

  // TODO: once theme is better defined convert to an interface
  theme: any;
}
