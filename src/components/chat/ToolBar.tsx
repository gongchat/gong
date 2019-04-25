import React from 'react';
import { useContext } from '../../context';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// components
import Status from './Status';

const ToolBar = (props: any) => {
  const classes = useStyles();
  const [context] = useContext();

  let chatName = '';
  let chatStatus = '';

  if (context.current) {
    switch (context.current.type) {
      case 'groupchat':
        chatName =
          context.current.name.startsWith('#') &&
          context.current.name.length > 1
            ? context.current.name.substring(1)
            : context.current.name;
        chatStatus = context.current.isConnected ? 'online' : 'offline';
        break;
      case 'chat':
        chatName =
          context.current.vCard && context.current.vCard.fullName
            ? context.current.vCard.fullName
            : context.current.name;
        chatStatus = context.current.status;
        break;
      default:
        break;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Typography>{context.settings.domain}</Typography>
      </div>
      <div className={classes.right}>
        <Typography>
          <span className={classes.symbol}>
            {context.current && context.current.type === 'groupchat' && '# '}
            {context.current && context.current.type === 'chat' && '@ '}
          </span>
          {chatName}
        </Typography>
        {context.current && context.current.connectionError && (
          <Typography color="error">
            ({context.current.connectionError})
          </Typography>
        )}
        {context.current &&
          context.current.type === 'chat' &&
          context.current.order !== 10 && <Status status={chatStatus} />}
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
