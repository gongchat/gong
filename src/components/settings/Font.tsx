import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// interfaces
import IStates from 'src/interfaces/IStates';

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
    const { classes } = this.props;
    const { font, size } = this.state;

    return (
      <div className={classes.root}>
        <Typography className={classes.link}>
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
          className={classes.font}
        />
        <TextField
          name="size"
          id="filled-number"
          label="Font Size"
          value={size}
          onChange={this.handleSizeChange}
          onKeyDown={this.handleKeyDown}
          type="number"
          margin="normal"
          variant="filled"
          inputProps={{ className: classes.size, min: MIN_SIZE, max: MAX_SIZE }}
          helperText={`From ${MIN_SIZE} to ${MAX_SIZE}`}
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

  private handleSizeChange = (event: any) => {
    this.setState({ size: event.target.value });
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
  root: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  size: {
    textAlign: 'right',
  },
  link: {
    width: '500px',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Font));
