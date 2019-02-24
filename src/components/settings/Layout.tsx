import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import Slider from '@material-ui/lab/Slider';

// interface
import IStates from 'src/interfaces/IStates';
import BasePage from './BasePage';
import BaseSection from './BaseSection';
import SliderMarkers from './SliderMarkers';

const MIN_SIDEBAR_WIDTH = 150;
const MAX_SIDEBAR_WIDTH = 250;
const DEFAULT_SIDEBAR_WIDTH = 225;

const MIN_SPACING = 0;
const MAX_SPACING = 16;
const DEFAULT_SPACING = 8;

class Layout extends React.Component<any, any> {
  public state = {
    spacing: this.props.theme.spacing.unit,
    sidebarWidth: this.props.theme.sidebarWidth,
    sidebarLeftShowAvatar: this.props.theme.sidebarLeftShowAvatar,
    sidebarRightShowAvatar: this.props.theme.sidebarRightShowAvatar,
  };

  private spacingTimer: any;
  private sidebarWidthTimer: any;

  public render() {
    const { classes } = this.props;
    const {
      spacing,
      sidebarWidth,
      sidebarLeftShowAvatar,
      sidebarRightShowAvatar,
    } = this.state;

    return (
      <BasePage title="Layout">
        <BaseSection title="Spacing">
          <div className={classes.slider}>
            <Slider
              value={spacing === '' ? 0 : parseInt(spacing, 10)}
              min={MIN_SPACING}
              max={MAX_SPACING}
              step={1}
              onChange={this.handleSpacingChangeSlider}
            />
            <SliderMarkers
              minSize={MIN_SPACING}
              maxSize={MAX_SPACING}
              defaultSize={DEFAULT_SPACING}
            />
          </div>
          <div>
            <TextField
              name="spacing"
              label="Spacing"
              value={spacing}
              onChange={this.handleSpacingChangeInput}
              onKeyDown={this.handleKeyDown}
              type="number"
              margin="normal"
              variant="filled"
              inputProps={{
                min: MIN_SPACING,
                max: MAX_SPACING,
              }}
            />
          </div>
        </BaseSection>
        <BaseSection title="Sidebar Width">
        <div className={classes.slider}>
            <Slider
              value={sidebarWidth === '' ? 0 : parseInt(sidebarWidth, 10)}
              min={MIN_SIDEBAR_WIDTH}
              max={MAX_SIDEBAR_WIDTH}
              step={1}
              onChange={this.handleSidebarWidthChangeSlider}
            />
            <SliderMarkers
              minSize={MIN_SIDEBAR_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              defaultSize={DEFAULT_SIDEBAR_WIDTH}
            />
          </div>
          <div>
            <TextField
              name="sidebarWidth"
              label="Sidebar Width"
              value={sidebarWidth}
              onChange={this.handleSidebarWidthChangeInput}
              onKeyDown={this.handleKeyDown}
              type="number"
              margin="normal"
              variant="filled"
              inputProps={{
                min: MIN_SIDEBAR_WIDTH,
                max: MAX_SIDEBAR_WIDTH,
              }}
            />
          </div>
        </BaseSection>
        <BaseSection title="Avatars">
          <FormControlLabel
            control={
              <Switch
                name="sidebarLeftShowAvatar"
                checked={sidebarLeftShowAvatar}
                onChange={this.handleSidebarAvatarChange}
              />
            }
            label="Show avatars in the left sidebar"
          />
          <FormControlLabel
            control={
              <Switch
                name="sidebarRightShowAvatar"
                checked={sidebarRightShowAvatar}
                onChange={this.handleSidebarAvatarChange}
              />
            }
            label="Show avatars in the right sidebar"
          />
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
      case 'spacing':
      case 'sidebarWidth':
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

  private handleSpacingChangeSlider = (event: any, value: any) => {
    this.updateSpacing(value);
  };

  private handleSpacingChangeInput = (event: any) => {
    this.updateSpacing(event.target.value);
  };

  private updateSpacing = (value: any) => {
    this.setState({ spacing: value });
    if (this.spacingTimer) {
      clearTimeout(this.spacingTimer);
    }
    this.spacingTimer = setTimeout(() => {
      const spacing =
        this.state.spacing < MIN_SPACING || this.state.spacing > MAX_SPACING
          ? DEFAULT_SPACING
          : this.state.spacing;
      this.props.setTheme({
        themeKey: 'theme.spacing.unit',
        value: parseInt(spacing, 10),
      });
      this.setState({ spacing });
    }, 1000);
  };

  private handleSidebarWidthChangeSlider = (event: any, value: any) => {
    this.updateSidebarWidth(value);
  };

  private handleSidebarWidthChangeInput = (event: any) => {
    this.updateSidebarWidth(event.target.value);
  };

  private updateSidebarWidth = (value: any) => {
    this.setState({ sidebarWidth: value });
    if (this.sidebarWidthTimer) {
      clearTimeout(this.sidebarWidthTimer);
    }
    this.sidebarWidthTimer = setTimeout(() => {
      const sidebarWidth =
        this.state.sidebarWidth < MIN_SIDEBAR_WIDTH ||
        this.state.sidebarWidth > MAX_SIDEBAR_WIDTH
          ? DEFAULT_SIDEBAR_WIDTH
          : this.state.sidebarWidth;
      this.props.setTheme({
        themeKey: 'sidebarWidth',
        value: parseInt(sidebarWidth, 10),
      });
      this.setState({ sidebarWidth });
    }, 1000);
  };

  private handleSidebarAvatarChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.checked });
    this.props.setTheme({
      themeKey: event.target.name,
      value: event.target.checked,
    });
  };
}

const mapStateToProps = (states: IStates) => ({
  theme: states.gong.theme,
});

const mapDispatchToProps = {
  setTheme,
};

const styles: any = (theme: any) => ({
  slider: { position: 'relative' },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
