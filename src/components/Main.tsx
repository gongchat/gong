import * as React from 'react';

const { ipcRenderer } = window.require('electron');

// redux & actions
import { connect } from 'react-redux';
import { addSnackbarNotification, autoLogin } from 'src/actions/dispatcher';

// material
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

// libs
import * as WebFont from 'webfontloader';

// components
import Chat from './chat/Chat';
import SidebarLeft from './chat/SidebarLeft';
import SidebarRight from './chat/SidebarRight';
import ToolBar from './chat/ToolBar';
import Discover from './discover/Discover';
import MenuBar from './MenuBar';
import Settings from './settings/Settings';

// interfaces
import IStates from 'src/interfaces/IStates';

class Main extends React.Component<any, any> {
  public state = {
    shouldReconnect: true,
    updateOpen: false,
  };

  private reconnectTimer: any;

  public componentDidMount() {
    if (this.props.connection) {
      if (
        !this.props.connection.isConnecting &&
        !this.props.connection.isConnected
      ) {
        this.props.autoLogin();
      }
    }
    if (this.props.theme) {
      this.loadFont(this.props.theme.typography.fontFamily);
    }
    if (this.props.app && this.props.app.hasUpdate) {
      this.setState({ updateOpen: true });
    }
  }

  public componentDidUpdate(prevProps: any) {
    // TODO: need to handle errors better
    if (this.state.shouldReconnect) {
      if (
        this.props.connection.connectionError === 'Connection has been aborted'
      ) {
        this.setState({ shouldReconnect: false });
      } else if (
        this.props.connection &&
        this.props.connection.hasSavedCredentials !== undefined &&
        !this.props.connection.isConnecting &&
        !this.props.connection.isConnected
      ) {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
        this.reconnectTimer = setTimeout(() => {
          this.props.autoLogin();
        }, 10000);
      }
    }

    if (
      this.props.theme &&
      (!prevProps.theme ||
        this.props.theme.typography.fontFamily !==
          prevProps.theme.typography.fontFamily)
    ) {
      this.loadFont(this.props.theme.typography.fontFamily);
    }

    if (
      this.props.app &&
      this.props.app.hasUpdate &&
      (!prevProps.app || this.props.app.hasUpdate !== prevProps.app.hasUpdate)
    ) {
      this.setState({ updateOpen: true });
    }
  }

  public render() {
    const { classes, current, menuBarNotification, connection } = this.props;
    const { updateOpen } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.bars}>
          <MenuBar
            showOffline={connection ? !connection.isConnected : true}
            menuBarNotification={menuBarNotification}
          />
          <ToolBar />
        </div>
        <div className={classes.content}>
          <div className={classes.left}>
            <SidebarLeft />
          </div>
          <div className={classes.middle}>
            <Chat />
          </div>
          {(current && current.type) === 'groupchat' && (
            <div className={classes.right}>
              <SidebarRight />
            </div>
          )}
        </div>
        <Discover />
        <Settings />
        <Snackbar
          open={updateOpen}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          message={'Update has been downloaded. Would you like to...'}
          action={
            <React.Fragment>
              <Button color="primary" size="small" onClick={this.handleUpdate}>
                Install Now
              </Button>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleUpdateClose}
              >
                Install After Restart
              </Button>
            </React.Fragment>
          }
        />
      </div>
    );
  }

  private loadFont(fontFamily: string) {
    const font: string = fontFamily.split(',')[0].replace(/"/g, '');
    WebFont.load({
      google: {
        families: [`${font}:400,700`, 'sans-serif'],
      },
    });
  }

  private handleUpdateClose = () => {
    this.setState({ updateOpen: false });
  };

  private handleUpdate = () => {
    ipcRenderer.send('app-update');
  };
}

const mapStateToProps = (states: IStates) => {
  return {
    app: states.gong.app,
    connection: states.gong.connection,
    current: states.gong.current,
    menuBarNotification: states.gong.menuBarNotification,
    theme: states.gong.theme,
  };
};

const mapDispatchToProps = {
  addSnackbarNotification,
  autoLogin,
};

const styles: any = (theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexGrow: 1,
  },
  bars: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  left: {
    flex: `0 0 ${theme.sidebarWidth}px`,
    display: 'flex',
    flexDirection: 'column',
    width: theme.sidebarWidth,
    backgroundColor: theme.palette.background.default,
  },
  middle: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  right: {
    flex: `0 0 ${theme.sidebarWidth * 0.9}px`,
    backgroundColor: theme.palette.background.default,
    overflowX: 'hidden',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Main));
