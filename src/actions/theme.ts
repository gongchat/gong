import cyan from '@material-ui/core/colors/cyan';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

import IState from '../interfaces/IState';
import { COLORS, SHADES } from '../utils/materialColors';

const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

export const DEFAULT: any = {
  palette: {
    type: 'dark',
    primary: cyan,
    secondary: orange,
    error: red,

    backgroundAccent: '#222222',
    backgroundInput: '#555555',

    online: '#64dd17',
    chat: '#aeea00',
    away: '#ffca28',
    xa: '#ffa726',
    dnd: '#d84315',
    offline: '#757575',
  },
  sidebarWidth: 225,
  sidebarLeftShowAvatar: true,
  sidebarRightShowAvatar: true,
  sortChannelsByMostRecentUnread: true,
  typography: {
    fontFamily: '"Source Sans Pro", sans-serif',
    fontSize: 14,
  },
};

const TYPOGRAPHY_PROPS = [
  { prop: 'h1', size: 96, lineHeight: 1, letterSpacing: -1.5 },
  { prop: 'h2', size: 60, lineHeight: 1, letterSpacing: -0.5 },
  { prop: 'h3', size: 48, lineHeight: 1.04, letterSpacing: 0 },
  { prop: 'h4', size: 34, lineHeight: 1.17, letterSpacing: 0.25 },
  { prop: 'h5', size: 24, lineHeight: 1.33, letterSpacing: 0 },
  { prop: 'h6', size: 20, lineHeight: 1.6, letterSpacing: 0.15 },
  { prop: 'subtitle1', size: 16, lineHeight: 1.75, letterSpacing: 0.15 },
  { prop: 'subtitle2', size: 14, lineHeight: 1.57, letterSpacing: 0.1 },
  { prop: 'body1', size: 16, lineHeight: 1.5, letterSpacing: 0.15 },
  { prop: 'body2', size: 14, lineHeight: 1.43, letterSpacing: 0.15 },
  { prop: 'button', size: 14, lineHeight: 1.75, letterSpacing: 0.4 },
  { prop: 'caption', size: 12, lineHeight: 1.66, letterSpacing: 0.4 },
  { prop: 'overline', size: 12, lineHeight: 2.66, letterSpacing: 1 },
];

const TYPOGRAPHY_SPECIAL_PROPS = ['caption'];

export const themeActions: any = {
  setThemeToDefault() {
    return (state: IState): IState => {
      const theme = createMuiTheme({ ...DEFAULT });
      electronStore.set('theme', theme);
      return { ...state, theme: { ...theme } };
    };
  },
  setTheme(items: any) {
    return (state: IState): IState => {
      let theme = { ...state.theme };

      items.forEach((item: any) => {
        theme = { ...theme };
        const props = item.themeKey.split('.');
        const lastProp = props[props.length - 1];
        // order matters
        if (lastProp === 'fontFamily') {
          // theme.typography.fontFamily = item.value;
          updateTypographyFontFamily(theme, item.value);
        } else if (lastProp === 'fontSize') {
          // theme.typography.fontSize = item.value;
          updateTypographyFontSize(theme, item.value);
        } else if (item.themeKey === 'palette.text.primary') {
          updateTypographyColor(theme, item.value);
        } else if (props[1] === 'primary') {
          updatePrimaryColor(theme, item);
        } else if (props[1] === 'secondary') {
          updateSecondaryColor(theme, item);
        } else if (props[0] === 'palette') {
          updatePalette(theme, props, lastProp, item.value);
        } else if (lastProp === 'unit') {
          theme.spacing = item.value;
        } else {
          theme[lastProp] = item.value;
        }
        theme = createMuiTheme(theme);
      });

      electronStore.set('theme', theme);

      return {
        ...state,
        theme,
      };
    };
  },
};

export const getTheme = () => {
  const theme = electronStore.get('theme');
  if (theme) {
    // set default props for new props
    if (theme.sortChannelsByMostRecentUnread === undefined) {
      theme.sortChannelsByMostRecentUnread =
        DEFAULT.sortChannelsByMostRecentUnread;
    }

    return createMuiTheme(theme);
  } else {
    return createMuiTheme({ ...DEFAULT });
  }
};

const updatePrimaryColor = (theme: any, item: any) => {
  const color: any = COLORS.find((c: any) => c.name === item.name);
  const baseShadeIndex = SHADES.indexOf(item.shade);
  const shadeLength = SHADES.length;
  if (color) {
    theme.palette.primary = {
      light:
        color.color[SHADES[baseShadeIndex - 1 <= 0 ? 0 : baseShadeIndex - 2]],
      main: color.color[SHADES[baseShadeIndex]],
      dark:
        color.color[
          SHADES[
            baseShadeIndex + 1 >= shadeLength ? shadeLength : baseShadeIndex + 2
          ]
        ],
    };
  }
};

const updateSecondaryColor = (theme: any, item: any) => {
  const color: any = COLORS.find((c: any) => c.name === item.name);
  const baseShadeIndex = SHADES.indexOf(item.shade);
  const shadeLength = SHADES.length;
  if (color) {
    theme.palette.secondary = {
      light:
        color.color[SHADES[baseShadeIndex - 1 <= 0 ? 0 : baseShadeIndex - 2]],
      main: color.color[SHADES[baseShadeIndex]],
      dark:
        color.color[
          SHADES[
            baseShadeIndex + 1 >= shadeLength ? shadeLength : baseShadeIndex + 2
          ]
        ],
    };
  }
};

const updateTypographyColor = (theme: any, color: string) => {
  // update nontypography props
  theme.palette.text.primary = color;
  theme.palette.action.active = color;
  // TODO: bottom border color on text areas are set by type (light vs dark), unable to change from theme properties. may have to figure out if light or dark from background color (machine learning?)

  // update each individually
  TYPOGRAPHY_PROPS.forEach((item: any) => {
    theme.typography[item.prop].color = color;
  });
  const alphaColor = addAlphaToRgb(convertHexToRgb(color), 0.7);
  console.log(alphaColor, color, convertHexToRgb(color));
  TYPOGRAPHY_SPECIAL_PROPS.forEach((prop: string) => {
    theme.typography[prop].color = alphaColor;
  });
};

const round = (value: number) => {
  return Math.round(value * 1e5) / 1e5;
};

const updateTypographyFontSize = (theme: any, size: number) => {
  theme.typography = { ...theme.typography };
  theme.typography.fontSize = size;
  theme.typography.htmlFontSize = size;

  TYPOGRAPHY_PROPS.forEach((item: any) => {
    theme.typography[item.prop].fontSize = theme.typography.pxToRem(
      (size / 15) * item.size
    );
    theme.typography[item.prop].lineHeight = item.lineHeight;
    theme.typography[item.prop].letterSpacing = `${round(
      item.letterSpacing / item.size
    )}px`;
  });
};

const updateTypographyFontFamily = (theme: any, font: string) => {
  theme.typography = { ...theme.typography };
  theme.typography.fontFamily = `"${font}", sans-serif`;
  TYPOGRAPHY_PROPS.forEach((item: any) => {
    theme.typography[item.prop].fontFamily = theme.typography.fontFamily;
  });
};

const updatePalette = (
  theme: any,
  props: string[],
  prop: string,
  color: string
) => {
  let currentProp = theme;
  for (const p of props) {
    if (currentProp[p] && p !== prop) {
      currentProp = currentProp[p];
    }
  }
  currentProp[prop] = color;
};

const convertHexToRgb = (hex: string): string => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // tslint: disable-next-line
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : '';
};

const addAlphaToRgb = (rgb: string, value: number): string => {
  return rgb.replace(/rgb/i, 'rgba').replace(/\)/i, `,${value})`);
};
