export default interface IPresence {
  from: string;
  priority: number;
  status: 'online' | 'chat' | 'away' | 'xa' | 'dnd' | 'offline';
  statusText: string;
  user: string;
  role: 'moderator' | 'participant';
  affiliation: string;
  code: string;
}
