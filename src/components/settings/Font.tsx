import React, { FC, useEffect, useRef, useState } from 'react';
import { useContext } from '../../context';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

import BasePage from './BasePage';
import BaseSection from './BaseSection';
import SliderContainer from './SliderContainer';
import SliderMarkers from './SliderMarkers';
import { DEFAULT as DEFAULT_THEME } from '../../actions/theme';

const MIN_SIZE = 8;
const MAX_SIZE = 20;
const DEFAULT_SIZE = 14;

const Font: FC = () => {
  const [{ theme }, { setTheme }] = useContext();
  const [font, setFont] = useState(
    theme.typography.fontFamily.split(',')[0].replace(/"/g, '')
  );
  const [size, setSize] = useState(theme.typography.fontSize);
  const fontTimer = useRef<any>();
  const sizeTimer = useRef<any>();

  const handleKeyDown = (event: any) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    const code = event.keyCode;
    let regex = new RegExp('');

    switch (event.target.name) {
      case 'font':
        if (code === 8 || (code >= 35 && code <= 46)) {
          return;
        }
        regex = new RegExp('^[a-zA-Z ]+$');
        break;
      case 'size':
        if (
          code === 8 ||
          (code >= 35 && code <= 46) ||
          (code >= 96 || code <= 105)
        ) {
          return;
        }
        regex = new RegExp('^[0-9]+$');
        break;
      default:
        break;
    }

    if (!regex.test(key)) {
      event.preventDefault();
      return;
    }
  };

  const handleFontChange = (event: any) => {
    const newFont = event.target.value;
    setFont(newFont);
    if (fontTimer) {
      clearTimeout(fontTimer.current);
    }
    fontTimer.current = setTimeout(() => {
      setTheme([{ themeKey: 'typography.fontFamily', value: newFont }]);
    }, 1000);
  };

  const updateSize = (value: any) => {
    setSize(value);
    if (sizeTimer) {
      clearTimeout(sizeTimer.current);
    }
    sizeTimer.current = setTimeout(() => {
      value = value < MIN_SIZE ? MIN_SIZE : value > MAX_SIZE ? MAX_SIZE : value;
      setTheme([{ themeKey: 'typography.fontSize', value }]);
      // need to set again in case size is out of bounds
      setSize(value);
    }, 1000);
  };

  const reset = () => {
    setTheme([
      {
        themeKey: 'typography.fontSize',
        value: DEFAULT_THEME.typography.fontSize,
      },
      {
        themeKey: 'typography.fontFamily',
        value: 'Source Sans Pro',
      },
    ]);
  };

  useEffect(() => {
    setFont(theme.typography.fontFamily.split(',')[0].replace(/"/g, ''));
  }, [theme.typography.fontFamily]);

  useEffect(() => {
    setSize(`${theme.typography.fontSize}`);
  }, [theme.typography.fontSize]);

  return (
    <BasePage title="Font">
      <BaseSection title="Font Name">
        <div>
          <Typography variant="body2">
            You can use any of the fonts available on{' '}
            <Link href="https://fonts.google.com/">Google Fonts</Link>
          </Typography>
          <TextField
            name="font"
            id="filled-number"
            label="Font"
            value={font}
            onChange={handleFontChange}
            onKeyDown={handleKeyDown}
            type="text"
            margin="normal"
            variant="filled"
          />
        </div>
      </BaseSection>
      <BaseSection title="Font Size">
        <SliderContainer>
          <Slider
            value={size === '' ? 0 : parseInt(size, 10)}
            min={MIN_SIZE}
            max={MAX_SIZE}
            step={1}
            onChange={(event: any, value: any) => updateSize(value)}
          />
          <SliderMarkers
            minSize={MIN_SIZE}
            maxSize={MAX_SIZE}
            defaultSize={DEFAULT_SIZE}
          />
        </SliderContainer>
        <div>
          <TextField
            name="size"
            id="filled-number"
            label="Font Size"
            value={size}
            onChange={(event: any) => updateSize(event.target.value)}
            onKeyDown={handleKeyDown}
            type="number"
            margin="normal"
            variant="filled"
            inputProps={{
              min: MIN_SIZE,
              max: MAX_SIZE,
            }}
          />
        </div>
      </BaseSection>
      <div>
        <Button color="secondary" onClick={reset} variant="outlined">
          RESET
        </Button>
      </div>
    </BasePage>
  );
};

export default Font;
