import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { addSnackbarNotification, autoLogin } from 'src/actions/dispatcher';

// material
import { withStyles } from '@material-ui/core';

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
    chatType: '',
    isConnected: true,
    fontFamily: '',
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
    // document.addEventListener;
  }

  public componentDidUpdate(prevProps: any) {
    if (this.state.chatType !== prevProps.chatType) {
      this.setState({ chatType: prevProps.chatType });
    }
    if (
      prevProps.connection &&
      this.state.isConnected !== prevProps.connection.isConnected
    ) {
      this.setState({ isConnected: prevProps.connection.isConnected });
      if (
        !prevProps.connection.isConnecting &&
        !prevProps.connection.isConnected
      ) {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
        this.reconnectTimer = setTimeout(() => {
          this.props.autoLogin();
        }, 10000);
      }
    }

    if (this.state.fontFamily !== prevProps.theme.typography.fontFamily) {
      this.loadFont(prevProps.theme.typography.fontFamily);
    }
  }

  public render() {
    const { classes, current, menuBarNotification } = this.props;
    const { isConnected } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.bars}>
          <MenuBar
            showOffline={!isConnected}
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
      </div>
    );
  }

  private loadFont(fontFamily: string) {
    this.setState({ fontFamily });
    const font: string = fontFamily.split(',')[0].replace(/"/g, '');
    WebFont.load({
      google: {
        families: [`${font}:400,700`, 'sans-serif'],
      },
    });
  }
}

const mapStateToProps = (states: IStates) => {
  return {
    connection: states.gong.connection,
    channel: states.gong.channels,
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
