import React, { useState, useEffect } from 'react';
import { useContext } from '../context';
import { usePrevious } from '../utils/usePrevious';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import CloseIcon from '@material-ui/icons/Close';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import RemoveIcon from '@material-ui/icons/Remove';

import IChannel from '../interfaces/IChannel';

const { BrowserWindow } = (window as any).require('electron').remote;

interface IProps {
  showOffline: boolean;
}

const MenuBar: React.FC<IProps> = ({ showOffline }: IProps) => {
  const classes = useStyles();
  const [{ connection, menuBarNotification, channels }] = useContext();
  const [isFlashing, setIsFlashing] = useState(false);
  const [notification, setNotification] = useState('');
  const [countOfUnreadMessages, setCountOfUnreadMessages] = useState(0);
  const prevMenuBarNotification = usePrevious(menuBarNotification);
  const menuBarNotificationFrequency = notification
    ? notification.split(',')[0]
    : '';

  const minimize = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.minimize();
  };

  const toggleMaximize = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  };

  const close = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow.close();
  };

  useEffect(() => {
    setCountOfUnreadMessages(
      channels.reduce((a: number, b: IChannel) => a + b.unreadMessages, 0)
    );
  }, [channels]);

  useEffect(() => {
    if (menuBarNotification !== '') {
      if (
        menuBarNotification !== prevMenuBarNotification &&
        (!isFlashing || menuBarNotification.split(',')[0] === 'once')
      ) {
        setNotification('');
        setTimeout(() => {
          setNotification(menuBarNotification);
          setIsFlashing(menuBarNotification.split(',')[0] === 'repeat');
        }, 1);
      }
    } else {
      setNotification('');
      setIsFlashing(false);
    }
  }, [menuBarNotification, isFlashing, prevMenuBarNotification]);

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
        <div className={classes.text}>
          <Typography>Gong</Typography>
          {!connection.isConnected && showOffline && (
            <Typography variant="caption">offline</Typography>
          )}
          {countOfUnreadMessages > 0 && (
            <Typography variant="caption">
              {countOfUnreadMessages} unread message
              {countOfUnreadMessages > 1 && 's'}
            </Typography>
          )}
        </div>
        <div className={['menu-bar--items', classes.menu].join(' ')}>
          {/* <Typography>File</Typography> */}
        </div>
        <div className={['menu-bar--actions', classes.actions].join(' ')}>
          <Typography
            onClick={minimize}
            className={[classes.actionItem].join(' ')}
          >
            <RemoveIcon />
          </Typography>
          <Typography
            onClick={toggleMaximize}
            className={[classes.actionItem].join(' ')}
          >
            <CropSquareIcon />
          </Typography>
          <Typography
            onClick={close}
            className={[classes.actionItem, classes.close].join(' ')}
          >
            <CloseIcon />
          </Typography>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    background: theme.palette.backgroundAccent,
  },
  menuBar: {
    margin: 1, // to allow resizing on menu bar
    display: 'flex',
    flexWrap: 'nowrap',
    '& $text, & $menu': {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  text: {
    display: 'flex',
    flexWrap: 'nowrap',
    textTransform: 'uppercase',
    '& p': {
      fontWeight: 'bold',
      marginRight: theme.spacing.unit * 2,
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
    animation: '$flashPrimary 1s linear',
  },
  flashRepeat: {
    animation: '$flashPrimary 1s infinite',
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
}));

export default MenuBar;
