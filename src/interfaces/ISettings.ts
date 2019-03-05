export default interface ISettings {
  jid: string;
  domain: string;
  username: string;
  resource: string;

  minimizeToTrayOnClose: boolean;

  systemNotificationOnGroupchat: string; // always, unread, never TODO: instead of unread maybe not-focused
  systemNotificationOnMentionMe: string; // always, unread, never
  systemNotificationOnChat: string; // always, unread, never

  renderVideos: boolean;
  renderGetYarn: boolean;
  renderImages: boolean;

  soundName: string;
  playAudioOnGroupchat: string; // always, unread, never
  playAudioOnChat: string; // always, unread, never
  playAudioOnMentionMe: string; // always, unread, never

  flashMenuBarOnGroupchat: string; // always, unread, never
  flashMenuBarOnGroupchatFrequency: string; // once, repeat, never
  flashMenuBarOnMentionMe: string; // always, unread, never
  flashMenuBarOnMentionMeFrequency: string; // once, repeat, never
  flashMenuBarOnChat: string; // once, repeat, never
  flashMenuBarOnChatFrequency: string; // once, repeat, never
}
