export const stringToHexColor = (str: string): string => {
  if (!str) {
    return '';
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let hex = '#';
  for (let i = 0; i < 3; i++) {
    // tslint:disable-next-line
    const value = (hash >> (i * 8)) & 0xff;
    hex += ('00' + value.toString(16)).substr(-2);
  }
  return shadeColor(hex, 0.5);
};

// 1 lightens; -1 shades
export const shadeColor = (color: string, percent: number): string => {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16; // tslint:disable-line
  const G = (f >> 8) & 0x00ff; // tslint:disable-line
  const B = f & 0x0000ff; // tslint:disable-line
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
};
