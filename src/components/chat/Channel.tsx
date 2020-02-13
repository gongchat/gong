import React, { FC, useState } from 'react';
import { useContext } from '../../context';

import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

import EditRoom from './EditRoom';
import IRoom from '../../interfaces/IRoom';

interface IProps {
  channel: IRoom;
  isSelected: boolean | undefined;
  prefix: string;
}

const Channel: FC<IProps> = ({ channel, isSelected, prefix }: IProps) => {
  const classes = useStyles();
  const { selectChannel, removeChannel } = useContext()[1];
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const name =
    channel.name.startsWith('#') && channel.name.length > 1
      ? channel.name.substring(1)
      : channel.name;

  const handleOnClick = () => {
    selectChannel(channel.jid);
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
    <>
      <div
        className={[
          classes.root,
          channel.isConnected || channel.type === 'chat'
            ? classes.connected
            : classes.notConnected,
          isSelected ? classes.active : '',
        ]
          .join(' ')
          .trim()}
      >
        <div
          className={classes.content}
          onContextMenu={handleOnContextMenu}
          onClick={handleOnClick}
        >
          <Typography
            className={classes.hashtag}
            color={channel.connectionError ? 'error' : 'textPrimary'}
          >
            {prefix}
          </Typography>
          <Typography className={classes.name}>{name}</Typography>
          {channel.unreadMessages > 0 && (
            <Badge
              badgeContent={channel.unreadMessages}
              classes={{
                badge: [
                  classes.badge,
                  channel.hasUnreadMentionMe ? classes.badgeFlash : '',
                ]
                  .join(' ')
                  .trim(),
              }}
              color="error"
            >
              <span />
            </Badge>
          )}
        </div>
        <Typography
          className={classes.close}
          onClick={() => removeChannel(channel.jid)}
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
        <EditRoom onClose={handleEditClose} channel={channel} />
      </Dialog>
    </>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
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
    paddingLeft: theme.spacing(1),
    paddingRight: 0,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
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
    animation: '$flash 1s linear infinite',
  },
  hashtag: {
    opacity: 0.5,
    marginRight: theme.spacing(0.5),
    fontWeight: 'bold',
  },
  close: {
    cursor: 'pointer',
    opacity: 0.5,
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
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
