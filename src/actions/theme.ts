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

    backgroundAccent: '#222',
    backgroundInput: '#555',

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
    fontSize: 15,
  },
};

const TYPOGRAPHY_PROPS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
  'overline',
];

const TYPOGRAPHY_SPECIAL_PROPS = ['caption'];

export const themeActions = {
  setThemeToDefault(state: IState): IState {
    const theme = createMuiTheme({ ...DEFAULT });
    electronStore.set('theme', theme);
    return { ...state, theme: { ...theme } };
  },
  setTheme(items: any, state: IState): IState {
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
  TYPOGRAPHY_PROPS.forEach((prop: string) => {
    theme.typography[prop].color = color;
  });
  const alphaColor = addAlphaToRgb(convertHexToRgb(color), 0.7);
  TYPOGRAPHY_SPECIAL_PROPS.forEach((prop: string) => {
    theme.typography[prop].color = alphaColor;
  });
};

const updateTypographyFontSize = (theme: any, size: number) => {
  theme.typography = { ...theme.typography };
  theme.typography.fontSize = size;
  theme.typography.htmlFontSize = size;
  TYPOGRAPHY_PROPS.forEach((prop: string) => {
    theme.typography[prop].fontSize = theme.typography.pxToRem(size);
  });
};

const updateTypographyFontFamily = (theme: any, font: string) => {
  theme.typography = { ...theme.typography };
  theme.typography.fontFamily = `"${font}", sans-serif`;
  TYPOGRAPHY_PROPS.forEach((prop: string) => {
    theme.typography[prop].fontFamily = theme.typography.fontFamily;
  });
};

const updatePalette = (
  theme: any,
  props: string[],
  prop: string,
  color: string
) => {
  // do normal update
  let currentProp = theme;
  for (const p of props) {
    if (currentProp[p] && p !== prop) {
      currentProp = currentProp[p];
    }
  }
  currentProp[prop] = color;
};

const convertHexToRgb = (hex: string): string => {
  const bigInt = parseInt(hex, 16);
  const r = (bigInt >> 16) & 255; // tslint:disable-line
  const g = (bigInt >> 8) & 255; // tslint:disable-line
  const b = bigInt & 255; // tslint:disable-line

  return `rgb(${r}, ${g}, ${b})`;
};

const addAlphaToRgb = (rgb: string, value: number): string => {
  return rgb.replace(/rgb/i, 'rgba').replace(/\)/i, `,${value})`);
};
