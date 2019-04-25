import React from 'react';

// material ui
import { makeStyles } from '@material-ui/styles';

const Status = (props: any) => {
  const classes = useStyles();
  switch (props.status) {
    case 'online':
      return <div className={[classes.root, classes.online].join(' ')} />;
    case 'chat':
      return <div className={[classes.root, classes.chat].join(' ')} />;
    case 'away':
      return <div className={[classes.root, classes.away].join(' ')} />;
    case 'xa':
      return <div className={[classes.root, classes.xa].join(' ')} />;
    case 'dnd':
      return <div className={[classes.root, classes.dnd].join(' ')} />;
    case 'offline':
      return <div className={[classes.root, classes.offline].join(' ')} />;
    default:
      return <div className={[classes.root, classes.offline].join(' ')} />;
  }
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
  },
  online: {
    backgroundColor: theme.palette.online,
  },
  chat: {
    backgroundColor: theme.palette.chat,
  },
  away: {
    backgroundColor: theme.palette.away,
  },
  xa: {
    backgroundColor: theme.palette.xa,
  },
  dnd: {
    backgroundColor: theme.palette.dnd,
  },
  offline: {
    backgroundColor: theme.palette.offline,
  },
}));

export default Status;
