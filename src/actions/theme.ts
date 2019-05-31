import cyan from '@material-ui/core/colors/cyan';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

import IState from '../interfaces/IState';
import MaterialColorsUtil from '../utils/materialColors';

const ElectronStore = window.require('electron-store');
const electronStore = new ElectronStore();

const DEFAULT: any = {
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
  setTheme(item: any, state: IState): IState {
    const theme = { ...state.theme };
    const props = item.themeKey.split('.');
    const lastProp = props[props.length - 1];

    // order matters
    if (lastProp === 'fontFamily') {
      updateTypographyFontFamily(theme, item.value);
    } else if (lastProp === 'fontSize') {
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

    const muiTheme = createMuiTheme(theme);
    electronStore.set('theme', muiTheme);

    return {
      ...state,
      theme: muiTheme,
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
  const color: any = MaterialColorsUtil.colors.find(
    (c: any) => c.name === item.name
  );
  const baseShadeIndex = MaterialColorsUtil.shades.indexOf(item.shade);
  const shadeLength = MaterialColorsUtil.shades.length;
  if (color) {
    theme.palette.primary = {
      light:
        color.color[
          MaterialColorsUtil.shades[
            baseShadeIndex - 1 <= 0 ? 0 : baseShadeIndex - 2
          ]
        ],
      main: color.color[MaterialColorsUtil.shades[baseShadeIndex]],
      dark:
        color.color[
          MaterialColorsUtil.shades[
            baseShadeIndex + 1 >= shadeLength ? shadeLength : baseShadeIndex + 2
          ]
        ],
    };
  }
};

const updateSecondaryColor = (theme: any, item: any) => {
  const color: any = MaterialColorsUtil.colors.find(
    (c: any) => c.name === item.name
  );
  const baseShadeIndex = MaterialColorsUtil.shades.indexOf(item.shade);
  const shadeLength = MaterialColorsUtil.shades.length;
  if (color) {
    theme.palette.secondary = {
      light:
        color.color[
          MaterialColorsUtil.shades[
            baseShadeIndex - 1 <= 0 ? 0 : baseShadeIndex - 2
          ]
        ],
      main: color.color[MaterialColorsUtil.shades[baseShadeIndex]],
      dark:
        color.color[
          MaterialColorsUtil.shades[
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
  // save font color, family
  const color = theme.typography.h1.color;
  const family = theme.typography.fontFamily;
  // clear out typography for each
  theme.typography = {};
  // update font size and family
  theme.typography.fontSize = size;
  theme.typography.fontFamily = family;
  theme = createMuiTheme(theme);
  // update color again
  updateTypographyColor(theme, color);
};

const updateTypographyFontFamily = (theme: any, font: string) => {
  // save font color, size
  const color = theme.typography.h1.color;
  const size = theme.typography.fontSize;
  // clear out typography for each
  theme.typography = {};
  // update font family and size
  theme.typography.fontSize = size;
  theme.typography.fontFamily = `"${font}", sans-serif`;
  theme = createMuiTheme(theme);
  // update color again
  updateTypographyColor(theme, color);
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
