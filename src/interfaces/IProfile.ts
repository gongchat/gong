import IVCard from './IVCard';

export default interface IProfile {
  jid: string;
  username: string;
  group: string;
  status: string;
  statusText: string;
  color: string;
  vCard: IVCard;
}
