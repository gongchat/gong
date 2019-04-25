import React from 'react';
import { useState } from 'react';
import { useContext } from '../context';

import { navigate } from '@reach/router';

// material ui
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

// components
import LoadingIcon from './icons/LoadingIcon';

let reconnectTimer: any;

const Loading = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();
  const { app, connection } = context;
  const { autoConnect } = actions;

  const [text, setText] = useState('Loading please wait...');
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    navigate('/login');
  };

  React.useEffect(() => {
    autoConnect();
  }, [autoConnect]);

  React.useEffect(() => {
    if (!connection.isConnecting && connection.isConnecting !== undefined) {
      if (connection.isConnected) {
        navigate('/main');
      } else if (connection.hasSavedCredentials === false) {
        navigate('/login');
      } else if (!connection.isAuthenticated) {
        if (
          connection.connectionError !== 'Cannot authorize your credentials'
        ) {
          setText('Unable to find the server, retrying connection');
          setShowLogin(true);
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            setText('Server not found, retrying connection');
          }
          reconnectTimer = setTimeout(() => {
            setText('Looking for the server');
            autoConnect();
          }, 10000);
        }
      }
    }

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [autoConnect, connection]);

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
};

const useStyles = makeStyles((theme: any) => ({
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
    margin: theme.spacing.unit / 3,
  },
  version: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.25,
    margin: theme.spacing.unit / 2,
    fontSize: '0.9rem',
  },
  goToLogin: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,
  },
}));

export default Loading;
