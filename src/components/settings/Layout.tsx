import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

// interface
import IStates from 'src/interfaces/IStates';

const MIN_SIDEBAR_SIZE = 200;
const MAX_SIDEBAR_SIZE = 250;
const DEFAULT_SIDEBAR_SIZE = 200;

const MIN_SPACING_SIZE = 0;
const MAX_SPACING_SIZE = 16;
const DEFAULT_SPACING_SIZE = 8;

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
      <div className={classes.root}>
        <TextField
          name="spacing"
          label="Spacing"
          value={spacing}
          onChange={this.handleSpacingChange}
          onKeyDown={this.handleKeyDown}
          type="number"
          margin="normal"
          variant="filled"
          inputProps={{
            className: classes.size,
            min: MIN_SPACING_SIZE,
            max: MAX_SPACING_SIZE,
          }}
          helperText={`From ${MIN_SPACING_SIZE} to ${MAX_SPACING_SIZE}`}
        />
        <TextField
          name="sidebarWidth"
          label="Sidebar Width"
          value={sidebarWidth}
          onChange={this.handleSidebarWidthChange}
          onKeyDown={this.handleKeyDown}
          type="number"
          margin="normal"
          variant="filled"
          inputProps={{
            className: classes.size,
            min: MIN_SIDEBAR_SIZE,
            max: MAX_SIDEBAR_SIZE,
          }}
          helperText={`From ${MIN_SIDEBAR_SIZE} to ${MAX_SIDEBAR_SIZE}`}
        />
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
      </div>
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

  private handleSpacingChange = (event: any) => {
    this.setState({ spacing: event.target.value });
    if (this.spacingTimer) {
      clearTimeout(this.spacingTimer);
    }
    this.spacingTimer = setTimeout(() => {
      const spacing =
        this.state.spacing < MIN_SPACING_SIZE ||
        this.state.spacing > MAX_SPACING_SIZE
          ? DEFAULT_SPACING_SIZE
          : this.state.spacing;
      this.props.setTheme({
        themeKey: 'theme.spacing.unit',
        value: parseInt(spacing, 10),
      });
      this.setState({ spacing });
    }, 1000);
  };

  private handleSidebarWidthChange = (event: any) => {
    this.setState({ sidebarWidth: event.target.value });
    if (this.sidebarWidthTimer) {
      clearTimeout(this.sidebarWidthTimer);
    }
    this.sidebarWidthTimer = setTimeout(() => {
      const sidebarWidth =
        this.state.sidebarWidth < MIN_SIDEBAR_SIZE ||
        this.state.sidebarWidth > MAX_SIDEBAR_SIZE
          ? DEFAULT_SIDEBAR_SIZE
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
  root: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
