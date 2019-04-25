import * as React from 'react';
import { useState } from 'react';
import { useContext } from '../context';

// material
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/styles';

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

const { ipcRenderer } = window.require('electron');

const Main = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const [shouldReconnect, setShouldReconnect] = useState(true);
  const [updateOpen, setUpdateOpen] = useState(false);

  let reconnectTimer: any;

  const loadFont = (fontFamily: string) => {
    const font: string = fontFamily.split(',')[0].replace(/"/g, '');
    WebFont.load({
      google: {
        families: [`${font}:400,700`, 'sans-serif'],
      },
    });
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleUpdate = () => {
    ipcRenderer.send('app-update');
  };

  React.useEffect(() => {
    if (context.connection) {
      if (!context.connection.isConnecting && !context.connection.isConnected) {
        actions.autoConnect();
      }
    }
    if (context.theme) {
      loadFont(context.theme.typography.fontFamily);
    }
    if (context.app && context.app.hasUpdate) {
      setUpdateOpen(true);
    }
  }, []);

  React.useEffect(() => {
    // TODO: need to handle errors better
    if (shouldReconnect) {
      if (
        context.connection.connectionError === 'Connection has been aborted'
      ) {
        setShouldReconnect(false);
      } else if (
        context.connection &&
        context.connection.hasSavedCredentials !== undefined &&
        !context.connection.isConnecting &&
        !context.connection.isConnected
      ) {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
        reconnectTimer = setTimeout(() => {
          actions.autoConnect();
        }, 10000);
      }
    }
  }, [context.connection]);

  React.useEffect(() => {
    loadFont(context.theme.typography.fontFamily);
  }, [context.theme.typography.fontFamily]);

  React.useEffect(() => {
    if (context.app.hasUpdate) {
      setUpdateOpen(true);
    }
  }, [context.app.hasUpdate]);

  return (
    <div className={classes.root}>
      <div className={classes.bars}>
        <MenuBar
          showOffline={
            context.connection ? !context.connection.isConnected : true
          }
          menuBarNotification={context.menuBarNotification}
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
        {(context.current && context.current.type) === 'groupchat' && (
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
            <Button color="primary" size="small" onClick={handleUpdate}>
              Install Now
            </Button>
            <Button color="secondary" size="small" onClick={handleUpdateClose}>
              Install After Restart
            </Button>
          </React.Fragment>
        }
      />
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
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
}));

export default Main;
