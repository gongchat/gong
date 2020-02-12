export default interface IPresence {
  from: string;
  priority: number;
  status: string;
  statusText: string;
  user: string;
  role: 'moderator' | 'participant';
  affiliation: string;
  code: string;
}
