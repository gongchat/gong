import IDiscoverRoom from './IDiscoverRoom';
import ISubdomain from './ISubdomain';

export default interface IDiscover {
  isOpen: boolean;
  isSubdomainsLoaded: boolean;
  subdomains: ISubdomain[];
  isRoomsLoaded: boolean;
  rooms: IDiscoverRoom[];
}
