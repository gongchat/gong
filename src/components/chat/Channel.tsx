import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

// material ui
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

import EditRoom from './EditRoom';

const Channel = (props: any) => {
  const classes = useStyles();
  const actions = useContext()[1];

  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const name =
    props.channel.name.startsWith('#') && props.channel.name.length > 1
      ? props.channel.name.substring(1)
      : props.channel.name;

  const handleOnClick = () => {
    actions.selectChannel(props.channel.jid);
  };

  const handleOnContextMenu = (event: any) => {
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickEdit = (event: any) => {
    event.preventDefault();
    setAnchorEl(null);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  return (
    <React.Fragment>
      <div
        className={[
          classes.root,
          props.channel.isConnected || props.channel.type === 'chat'
            ? classes.connected
            : classes.notConnected,
          props.isSelected ? classes.active : '',
        ].join(' ')}
      >
        <div
          className={classes.content}
          onContextMenu={handleOnContextMenu}
          onClick={handleOnClick}
        >
          <Typography
            className={classes.hashtag}
            color={props.channel.connectionError ? 'error' : 'default'}
          >
            {props.prefix}
          </Typography>
          <Typography className={classes.name}>{name}</Typography>
          {props.channel.unreadMessages > 0 && (
            <Badge
              badgeContent={props.channel.unreadMessages}
              classes={{
                badge: [
                  classes.badge,
                  props.channel.hasUnreadMentionMe ? classes.badgeFlash : '',
                ].join(' '),
              }}
              color="error"
            >
              <span />
            </Badge>
          )}
        </div>
        <Typography
          className={classes.close}
          onClick={() => actions.removeChannel(props.channel.jid)}
        >
          <CloseIcon className={classes.closeIcon} />
        </Typography>
      </div>
      <Menu
        id="context-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleContextMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleOnClickEdit}>Edit</MenuItem>
      </Menu>
      <Dialog
        open={isEditOpen}
        onClose={handleEditClose}
        className={classes.dialog}
        BackdropProps={{ className: classes.dialog }}
        aria-labelledby="room-edit-dialog-title"
      >
        <EditRoom onClose={handleEditClose} channel={props.channel} />
      </Dialog>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: 0,
    flexGrow: 1,
  },
  connected: {
    opacity: 1,
    '&:hover': {
      background: 'rgba(125,125,125,.2)',
    },
  },
  notConnected: {
    justifyContent: 'space-between',
    opacity: 0.4,
  },
  connectionError: {
    color: theme.palette.secondary.main,
  },
  content: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexGrow: 1,
    paddingLeft: theme.spacing.unit,
    paddingRight: 0,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
  },
  name: {
    flexGrow: 1,
    // TODO: without the 1px width name doesn't overflow properly, not sure why
    width: '1px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    marginRight: '20px',
  },
  active: {
    background: 'rgba(125,125,125,.4)',
    '&:hover': {
      background: 'rgba(125,125,125,.4)',
    },
  },
  badge: {
    width: '20px',
    marginRight: '10px',
    borderRadius: '5px',
  },
  badgeFlash: {
    animation: 'flash 1s linear infinite',
  },
  hashtag: {
    opacity: 0.5,
    marginRight: theme.spacing.unit / 2,
    fontWeight: 'bold',
  },
  close: {
    cursor: 'pointer',
    opacity: 0.5,
    marginLeft: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    '&:hover': {
      opacity: 1,
    },
  },
  closeIcon: {
    fontSize: '15px',
  },
  dialog: {
    top: '23px',
  },
  '@keyframes flash': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.1,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

export default Channel;
