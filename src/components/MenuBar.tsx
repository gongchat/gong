import * as React from 'react';

// material
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import RemoveIcon from '@material-ui/icons/Remove';

const { BrowserWindow } = (window as any).require('electron').remote;

class MenuBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const { classes, showOffline } = this.props;

    return (
      <div className={['menu-bar', classes.root].join(' ')}>
        <div className={classes.brand}>
          <Typography>Gong{showOffline ? ' (offline)' : ''}</Typography>
        </div>
        <div className={['menu-bar--items', classes.menu].join(' ')}>
          {/* <Typography>File</Typography> */}
        </div>
        <div className={['menu-bar--actions', classes.actions].join(' ')}>
          <Typography
            onClick={this.minimize}
            className={[classes.actionItem].join(' ')}
          >
            <RemoveIcon />
          </Typography>
          <Typography
            onClick={this.toggleMaximize}
            className={[classes.actionItem].join(' ')}
          >
            <CropSquareIcon />
          </Typography>
          <Typography
            onClick={this.close}
            className={[classes.actionItem, classes.close].join(' ')}
          >
            <CloseIcon />
          </Typography>
        </div>
      </div>
    );
  }

  private minimize = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.minimize();
  };

  private toggleMaximize = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  };

  private close = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.close();
  };
}

const styles: any = (theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    background: theme.palette.backgroundAccent,
    '& $brand, & $menu': {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  brand: {
    textTransform: 'uppercase',
    '& p': {
      fontWeight: 'bold',
    },
  },
  menu: {
    flexGrow: 1,
  },
  actions: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  actionItem: {
    padding: '5px 15px',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    '& svg': {
      height: '18px',
      width: '18px',
    },
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  close: {
    '&:hover': {
      backgroundColor: 'red',
    },
  },
});

export default withStyles(styles)(MenuBar);
