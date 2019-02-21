export default interface ISettings {
  jid: string;
  domain: string;
  name: string;
  username: string;
  resource: string;

  soundName: string;
  playAudioOnGroupchatMessage: string; // always, unread, never
  playAudioOnChatMessage: string; // always, unread, never
  playAudioOnMentionMe: string; // always, unread, never
  flashMenuBarOnGroupchatMessage: string; // always, unread, never
  flashMenuBarOnGroupchatMessageFrequency: string; // once, repeat, never
  flashMenuBarOnMentionMe: string; // always, unread, never
  flashMenuBarOnMentionMeFrequency: string; // once, repeat, never
  flashMenuBarOnChatMessage: string; // once, repeat, never
  flashMenuBarOnChatMessageFrequency: string; // once, repeat, never
}
