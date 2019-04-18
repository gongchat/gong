import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

// material ui
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import { makeStyles } from '@material-ui/styles';

// interfaces
import BasePage from './BasePage';
import BaseSection from './BaseSection';
import SliderMarkers from './SliderMarkers';

const MIN_SIZE = 8;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 15;

let fontTimer: any;
let sizeTimer: any;

const Font = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const [font, setFont] = useState(
    context.theme.typography.fontFamily.split(',')[0].replace(/"/g, '')
  );
  const [size, setSize] = useState(context.theme.typography.fontSize);

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
    }

    if (!regex.test(key)) {
      event.preventDefault();
      return;
    }
  };

  const handleFontChange = (event: any) => {
    setFont(event.target.value);
    if (fontTimer) {
      clearTimeout(fontTimer);
    }
    fontTimer = setTimeout(() => {
      actions.setTheme({
        themeKey: 'typography.fontFamily',
        value: font,
      });
    }, 1000);
  };

  const updateSize = (value: any) => {
    setSize(value);
    if (sizeTimer) {
      clearTimeout(sizeTimer);
    }
    sizeTimer = setTimeout(() => {
      value = value < MIN_SIZE ? MIN_SIZE : value > MAX_SIZE ? MAX_SIZE : value;
      actions.setTheme({
        themeKey: 'typography.fontSize',
        value,
      });
      // need to set again in case size is out of bounds
      setSize(value);
    }, 1000);
  };

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
        <div className={classes.slider}>
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
        </div>
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
    </BasePage>
  );
};

const useStyles = makeStyles((theme: any) => ({
  slider: { position: 'relative' },
}));

export default Font;
