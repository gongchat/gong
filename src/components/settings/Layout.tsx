import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

// interface
import IStates from 'src/interfaces/IStates';

const MIN_SIZE = 200;
const MAX_SIZE = 250;
const DEFAULT_SIZE = 200;

class Layout extends React.Component<any, any> {
  public state = {
    sidebarWidth: this.props.theme.sidebarWidth.replace('px', ''),
  };

  private sidebarWidthTimer: any;

  public render() {
    const { classes } = this.props;
    const { sidebarWidth } = this.state;

    return (
      <div className={classes.root}>
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
            min: MIN_SIZE,
            max: MAX_SIZE,
          }}
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

  private handleSidebarWidthChange = (event: any) => {
    this.setState({ sidebarWidth: event.target.value });
    if (this.sidebarWidthTimer) {
      clearTimeout(this.sidebarWidthTimer);
    }
    this.sidebarWidthTimer = setTimeout(() => {
      const sidebarWidth =
        this.state.sidebarWidth < MIN_SIZE || this.state.sidebarWidth > MAX_SIZE
          ? DEFAULT_SIZE
          : this.state.sidebarWidth;
      this.props.setTheme({
        themeKey: 'sidebarWidth',
        value: sidebarWidth + 'px',
      });
      this.setState({ sidebarWidth });
    }, 1000);
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
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));
