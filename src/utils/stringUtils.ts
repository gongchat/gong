export const makeId = (length: number) => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const getAbbreviation = (value: string): string => {
  const values: string[] = value.split(' ');
  return values.length > 1
    ? values[0].substring(0, 1).toUpperCase() +
        values[1].substring(0, 1).toUpperCase()
    : values[0].substring(0, 1).toUpperCase();
};
