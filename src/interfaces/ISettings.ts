export default interface ISettings {
  isOpen: boolean;

  jid: string;
  domain: string;
  username: string;
  resource: string;
  port: string;

  minimizeToTrayOnClose: boolean;

  systemNotificationOnGroupchat: 'always' | 'unread' | 'never';
  systemNotificationOnMentionMe: 'always' | 'unread' | 'never';
  systemNotificationOnChat: 'always' | 'unread' | 'never';

  flashFrameOnGroupchat: 'unread' | 'never';
  flashFrameOnMentionMe: 'unread' | 'never';
  flashFrameOnChat: 'unread' | 'never';

  renderVideos: boolean;
  renderGetYarn: boolean;
  renderImages: boolean;

  soundName: string;
  soundVolume: number;
  playAudioOnGroupchat: 'always' | 'unread' | 'never';
  playAudioOnChat: 'always' | 'unread' | 'never';
  playAudioOnMentionMe: 'always' | 'unread' | 'never';

  flashMenuBarOnGroupchat: 'always' | 'unread' | 'never';
  flashMenuBarOnGroupchatFrequency: 'once' | 'repeat' | 'never';
  flashMenuBarOnMentionMe: 'always' | 'unread' | 'never';
  flashMenuBarOnMentionMeFrequency: 'once' | 'repeat' | 'never';
  flashMenuBarOnChat: 'always' | 'unread' | 'never';
  flashMenuBarOnChatFrequency: 'once' | 'repeat' | 'never';

  previousStatus: 'online' | 'chat' | 'away' | 'xa' | 'dnd' | 'offline' | '';
  previousStatusText: string;
}
