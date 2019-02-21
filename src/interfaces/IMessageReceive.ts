import { Moment } from 'moment';

export default interface IMessageReceive {
  id: string;
  type: string;
  from: string;
  body: string;
  timestamp: Moment;
  isHistory: boolean;
}
