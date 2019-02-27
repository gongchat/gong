import * as React from 'react';

// material
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import RemoveIcon from '@material-ui/icons/Remove';

const { BrowserWindow } = (window as any).require('electron').remote;

class MenuBar extends React.Component<any, any> {
  public state = {
    isFlashing: false,
    menuBarNotification: this.props.menuBarNotification,
  };

  constructor(props: any) {
    super(props);
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.menuBarNotification !== '') {
      if (
        nextProps.menuBarNotification !== this.state.menuBarNotification &&
        !this.state.isFlashing
      ) {
        this.setState({ menuBarNotification: '' });
        setTimeout(() => {
          this.setState({
            menuBarNotification: nextProps.menuBarNotification,
            isFlashing:
              nextProps.menuBarNotification.split(',')[0] === 'repeat'
                ? true
                : false,
          });
        }, 1);
      }
    } else {
      this.setState({ menuBarNotification: '', isFlashing: false });
    }
  }

  public render() {
    const { classes, showOffline } = this.props;
    const { menuBarNotification } = this.state;
    const menuBarNotificationFrequency = menuBarNotification
      ? menuBarNotification.split(',')[0]
      : '';

    return (
      <div
        className={[
          classes.root,
          menuBarNotificationFrequency === 'once'
            ? classes.flashOnce
            : menuBarNotificationFrequency === 'repeat'
            ? classes.flashRepeat
            : '',
        ].join(' ')}
      >
        <div className={['menu-bar', classes.menuBar].join(' ')}>
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
    background: theme.palette.backgroundAccent,
  },
  menuBar: {
    margin: 1, // to allow resizing on menu bar
    display: 'flex',
    flexWrap: 'nowrap',
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
    margin: '-1px',
  },
  actionItem: {
    padding: '2px 7px',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    '& svg': {
      height: '18px',
      width: '18px',
    },
    '&:hover': {
      background: 'rgba(125,125,125,.2)',
    },
  },
  close: {
    '&:hover': {
      backgroundColor: 'red',
    },
  },
  flashOnce: {
    animation: 'flashPrimary 1s linear',
  },
  flashRepeat: {
    animation: 'flashPrimary 1s infinite',
  },
  '@keyframes flashPrimary': {
    '0%': {
      backgroundColor: theme.palette.backgroundAccent,
    },
    '50%': {
      backgroundColor: theme.palette.primary.main,
    },
    '100%': {
      backgroundColor: theme.palette.backgroundAccent,
    },
  },
});

export default withStyles(styles)(MenuBar);
