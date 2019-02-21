import IVCard from './IVCard';

export default interface IProfile {
  jid: string;
  username: string;
  group: string;
  status: string;
  color: string;
  vCard: IVCard | undefined;
}
