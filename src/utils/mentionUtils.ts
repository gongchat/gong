export const getHtmlWithAt = (isMe: boolean, nickname: string): string => {
  return `<span class="${isMe ? 'mention-me' : 'mention'}">@${nickname}</span>`;
};

export const getHtmlWithoutAt = (isMe: boolean, nickname: string): string => {
  return `<span class="${isMe ? 'mention-me' : 'mention'}">${nickname}</span>`;
};

export const getRegExpWithAt = (nickname: string): RegExp => {
  return new RegExp(`@${nickname}\\b`, 'gi');
};

export const getRegExpWithoutAt = (nickname: string): RegExp => {
  return new RegExp(
    // TODO: test@test matches, should not match so emails get generated properly
    `(?<=[^a-zA-Z0-9@]|\\s|^)${nickname}(?=\\W|\\s+|$)(?=[^@]|$)`,
    'gi'
  );
};
