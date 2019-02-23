import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { addSnackbarNotification, autoLogin } from 'src/actions/dispatcher';

// material
import { withStyles } from '@material-ui/core';

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
  };

  private reconnectTimer: any;

  public componentWillMount() {
    if (this.props.connection) {
      if (
        !this.props.connection.isConnecting &&
        !this.props.connection.isConnected
      ) {
        this.props.autoLogin();
      }
    }
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.chatType) {
      this.setState({ chatType: nextProps.chatType });
    }

    if (nextProps.connection) {
      this.setState({ isConnected: nextProps.connection.isConnected });
      if (
        !nextProps.connection.isConnecting &&
        !nextProps.connection.isConnected
      ) {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
        this.reconnectTimer = setTimeout(() => {
          this.props.autoLogin();
        }, 10000);
      }
    }
  }

  public render() {
    const { classes, current } = this.props;
    const { isConnected } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.bars}>
          <MenuBar showOffline={!isConnected} />
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
}

const mapStateToProps = (states: IStates) => {
  return {
    connection: states.gong.connection,
    current: states.gong.current,
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
