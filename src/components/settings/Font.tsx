import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Slider from '@material-ui/lab/Slider';

// interfaces
import IStates from 'src/interfaces/IStates';
import BasePage from './BasePage';
import BaseSection from './BaseSection';
import SliderMarkers from './SliderMarkers';

const MIN_SIZE = 8;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 15;

class Font extends React.Component<any, any> {
  public state = {
    font: this.props.theme.typography.fontFamily
      .split(',')[0]
      .replace(/"/g, ''),
    size: this.props.theme.typography.fontSize,
  };

  private fontTimer: any;
  private sizeTimer: any;

  public render() {
    const { font, size } = this.state;

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
              onChange={this.handleFontChange}
              onKeyDown={this.handleKeyDown}
              type="text"
              margin="normal"
              variant="filled"
            />
          </div>
        </BaseSection>
        <BaseSection title="Font Size">
          <div>
            <Slider
              value={size === '' ? 0 : parseInt(size, 10)}
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={1}
              onChange={this.handleSizeChangeSlider}
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
              onChange={this.handleSizeChangeInput}
              onKeyDown={this.handleKeyDown}
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
  }

  private handleKeyDown = (event: any) => {
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

  private handleFontChange = (event: any) => {
    this.setState({ font: event.target.value });
    if (this.fontTimer) {
      clearTimeout(this.fontTimer);
    }
    this.fontTimer = setTimeout(() => {
      this.props.setTheme({
        themeKey: 'typography.fontFamily',
        value: this.state.font,
      });
    }, 1000);
  };

  private handleSizeChangeInput = (event: any) => {
    this.updateSize(event.target.value);
  };

  private handleSizeChangeSlider = (event: any, value: number) => {
    this.updateSize(value);
  };

  private updateSize = (value: any) => {
    this.setState({ size: value });
    if (this.sizeTimer) {
      clearTimeout(this.sizeTimer);
    }
    this.sizeTimer = setTimeout(() => {
      const size =
        this.state.size < MIN_SIZE || this.state.size > MAX_SIZE
          ? DEFAULT_SIZE
          : this.state.size;
      this.props.setTheme({
        themeKey: 'typography.fontSize',
        value: size,
      });
      // need to set again in case size is out of bounds
      this.setState({ size });
    }, 1000);
  };
}

const mapStateToProps = (states: IStates) => {
  return {
    theme: states.gong.theme,
  };
};

const mapDispatchToProps = {
  setTheme,
};

const styles: any = (theme: any) => ({
  root: {},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Font));
