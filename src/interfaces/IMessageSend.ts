export default interface IMessageSend {
  id: string;
  channelName: string;
  type: string;
  to: string;
  from: string;
  body: string;
}
