import React, { FC, useEffect, useState } from 'react';
import { useContext } from '../../context';

import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IRoom from '../../interfaces/IRoom';
import IUser from '../../interfaces/IUser';
import IUserConnection from '../../interfaces/IUserConnection';
import Status from './Status';

const ToolBar: FC = () => {
  const classes = useStyles();
  const [{ current, settings }, { setSessionJid }] = useContext();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [sessionName, setSessionName] = useState('');

  const [anchorEl, setAnchorEl] = React.useState<any | null>(null);

  const handleSessionClick = (event: React.MouseEvent<any, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSessionClose = () => {
    setAnchorEl(null);
  };

  const handleSessionSelection = (jid: string) => {
    if (current) {
      setSessionJid(current.jid, jid);
      handleSessionClose();
    }
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (current) {
      switch (current.type) {
        case 'groupchat':
          const room = current as IRoom;
          setName(
            current.name.startsWith('#') && current.name.length > 1
              ? current.name.substring(1)
              : current.name
          );
          setStatus(room.isConnected ? 'online' : 'offline');
          break;
        case 'chat':
          const user = current as IUser;
          setName(
            user.vCard && user.vCard.fullName ? user.vCard.fullName : user.name
          );
          setStatus(user.status);
          setSessionName(user.sessionJid ? user.sessionJid.split('/')[1] : '');
          break;
        default:
          break;
      }
    }
  }, [current]);

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
          {name}
        </Typography>
        {current &&
          current.type === 'groupchat' &&
          (current as IRoom).connectionError && (
            <Typography color="error">
              ({(current as IRoom).connectionError})
            </Typography>
          )}
        {current && current.type === 'chat' && current.order !== 10 && (
          <>
            <Status status={status} />
            {sessionName && (
              <>
                <div className={classes.divider} />
                <Typography
                  className={classes.sessionJid}
                  color="textSecondary"
                  variant="caption"
                  onClick={handleSessionClick}
                >
                  {sessionName}
                </Typography>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleSessionClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {(current as IUser).connections.map(
                    (connection: IUserConnection, index: number) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSessionSelection(connection.jid)}
                      >
                        {connection.jid.split('/')[1]}
                      </MenuItem>
                    )
                  )}
                </Popover>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    backgroundColor: theme.palette.background.default,
  },
  left: {
    width: theme.sidebarWidth,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing(2),
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
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& p': {
      paddingRight: theme.spacing(1),
    },
  },
  symbol: {
    opacity: 0.5,
  },
  divider: {
    height: '75%',
    borderLeft: `1px solid ${theme.palette.divider}`,
    marginLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  sessionJid: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default ToolBar;
