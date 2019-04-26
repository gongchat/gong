import React from 'react';
import { useContext } from '../../context';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Status from './Status';

const ToolBar: React.FC = () => {
  const classes = useStyles();
  const [context] = useContext();

  const { current, settings } = context;

  let chatName = '';
  let chatStatus = '';

  if (current) {
    switch (current.type) {
      case 'groupchat':
        chatName =
          current.name.startsWith('#') && current.name.length > 1
            ? current.name.substring(1)
            : current.name;
        chatStatus = current.isConnected ? 'online' : 'offline';
        break;
      case 'chat':
        chatName =
          current.vCard && current.vCard.fullName
            ? current.vCard.fullName
            : current.name;
        chatStatus = current.status;
        break;
      default:
        break;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Typography>{settings.domain}</Typography>
      </div>
      <div className={classes.right}>
        <Typography>
          <span className={classes.symbol}>
            {current && current.type === 'groupchat' && '# '}
            {current && current.type === 'chat' && '@ '}
          </span>
          {chatName}
        </Typography>
        {current && current.connectionError && (
          <Typography color="error">({current.connectionError})</Typography>
        )}
        {current && current.type === 'chat' && current.order !== 10 && (
          <Status status={chatStatus} />
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    backgroundColor: theme.palette.background.default,
  },
  left: {
    width: theme.sidebarWidth,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit * 2,
    flexShrink: 0,
    '& p': {
      fontWeight: 'bold',
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  right: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    '& p': {
      paddingRight: theme.spacing.unit,
    },
  },
  symbol: {
    opacity: 0.5,
  },
}));

export default ToolBar;
