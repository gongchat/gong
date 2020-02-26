import React, { FC, useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router';
import { useContext } from '../context';
import * as WebFont from 'webfontloader';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/styles';

import Chat from './chat/Chat';
import Discover from './discover/Discover';
import MenuBar from './MenuBar';
import Ping from './Ping';
import Settings from './settings/Settings';
import SidebarLeft from './chat/SidebarLeft';
import SidebarRight from './chat/SidebarRight';
import ToolBar from './chat/ToolBar';

const { ipcRenderer } = window.require('electron');

interface IProps {
  path: string;
  noThrow: boolean;
}

const Main: FC<IProps> = () => {
  const classes = useStyles();
  const [{ connection, theme, app, current }, { autoConnect }] = useContext();
  const [goToLogin, setGoToLogin] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const reconnectTimer = useRef<any>();
  const shouldReconnect = useRef(true);

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
    setUpdateOpen(false);
  };

  useEffect(() => {
    if (
      !connection.isAuthenticated &&
      !connection.isConnecting &&
      !connection.hasSavedCredentials &&
      connection.hasSavedCredentials !== undefined
    ) {
      setGoToLogin(true);
    }
  }, [connection]);

  useEffect(() => {
    if (theme) {
      loadFont(theme.typography.fontFamily);
    }
  }, [theme]);

  useEffect(() => {
    if (app.isUpdateDownloaded) {
      setUpdateOpen(true);
    }
  }, [app]);

  useEffect(() => {
    if (shouldReconnect.current) {
      if (connection.connectionError === 'Connection has been aborted') {
        shouldReconnect.current = false;
      } else if (
        connection &&
        !connection.isConnecting &&
        !connection.isConnected
      ) {
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
        }
        if (!reconnectTimer.current) {
          reconnectTimer.current = setTimeout(() => {
            autoConnect();
          });
        } else {
          reconnectTimer.current = setTimeout(() => {
            autoConnect();
          }, 10000);
        }
      }
    }
  }, [autoConnect, connection]);

  if (goToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.bars}>
        <MenuBar showOffline={true} />
        <ToolBar />
      </div>
      <div className={classes.content}>
        <SidebarLeft />
        <div className={classes.middle}>{current && <Chat />}</div>
        <SidebarRight />
      </div>
      <Ping />
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
          <>
            <Button color="primary" size="small" onClick={handleUpdate}>
              Install Now
            </Button>
            <Button color="secondary" size="small" onClick={handleUpdateClose}>
              Install After Restart
            </Button>
          </>
        }
      />
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexGrow: 1,
    overflowY: 'hidden',
  },
  bars: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  middle: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
}));

export default Main;
