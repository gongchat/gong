import React, { FC, useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useContext } from '../context';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import LoadingIcon from './icons/LoadingIcon';

interface IProps {
  path: string;
  noThrow: boolean;
}

const Loading: FC<IProps> = () => {
  const classes = useStyles();
  const [{ app, connection }, { autoConnect }] = useContext();
  const [text, setText] = useState('Loading please wait...');
  const [showLogin, setShowLogin] = useState(false);
  const [goToLogin, setGoToLogin] = useState(false);
  const [goToMain, setGoToMain] = useState(false);
  const reconnectTimer = useRef<any>();

  const handleLoginClick = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    setGoToLogin(true);
  };

  useEffect(() => {
    autoConnect();
  }, [autoConnect]);

  useEffect(() => {
    if (!connection.isConnecting && connection.isConnecting !== undefined) {
      if (connection.isConnected) {
        setGoToMain(true);
      } else if (connection.hasSavedCredentials === false) {
        setGoToLogin(true);
      } else if (!connection.isAuthenticated) {
        if (
          connection.connectionError !== 'Cannot authorize your credentials'
        ) {
          setText('Unable to find the server, retrying connection');
          setShowLogin(true);
          if (reconnectTimer.current) {
            clearTimeout(reconnectTimer.current);
            setText('Server not found, retrying connection');
          }
          reconnectTimer.current = setTimeout(() => {
            setText('Looking for the server');
            autoConnect();
          }, 10000);
        }
      }
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [autoConnect, connection]);

  if (goToLogin) {
    return <Redirect to="/login" />;
  } else if (goToMain) {
    return <Redirect to="/main" />;
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.filler} />
        <div className={classes.content}>
          <h1 className={classes.title}>GONG</h1>
          <LoadingIcon />
          <p className={classes.message}>{text}</p>
          {app.version !== '' && (
            <p className={classes.version}>v{app.version}</p>
          )}
        </div>
        {showLogin && (
          <div className={classes.goToLogin}>
            <div className={classes.filler} />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLoginClick}
            >
              Take me to login
            </Button>
            <div className={classes.filler} />
          </div>
        )}
        <div className={classes.filler} />
      </div>
    );
  }
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '-webkit-app-region': 'drag',
  },
  filler: {
    flexGrow: 1,
    '-webkit-app-region': 'drag',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: '68px',
    marginTop: 0,
    marginBottom: '20px',
  },
  message: {
    color: 'white',
    textAlign: 'center',
    margin: theme.spacing(1/3),
  },
  version: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.25,
    margin: theme.spacing(0.5),
    fontSize: '0.9rem',
  },
  goToLogin: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

export default Loading;
