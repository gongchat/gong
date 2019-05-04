import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Status from './Status';
import UserDetail from './UserDetail';
import IUser from '../../interfaces/IUser';
import StringUtil from '../../utils/stringUtils';

interface IProps {
  user: IUser;
  isSelected: boolean | undefined;
  showAvatar: boolean;
}

const User: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const actions = useContext()[1];

  const { user, isSelected, showAvatar } = props;
  const { selectChannel } = actions;

  const [anchorEl, setAnchorEl] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const displayName =
    user.vCard && user.vCard.fullName && user.vCard.fullName !== ''
      ? user.vCard.fullName
      : user.username;

  const handleOnClick = () => {
    selectChannel(user.jid);
  };

  const handleOnContextMenu = (event: any) => {
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickDetail = (event: any) => {
    event.preventDefault();
    setAnchorEl(null);
    setIsDetailsOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailsOpen(false);
  };

  return (
    <React.Fragment>
      <div
        className={[
          classes.root,
          isSelected ? classes.active : '',
          showAvatar ? '' : classes.rootNarrow,
        ].join(' ')}
        onClick={handleOnClick}
        onContextMenu={handleOnContextMenu}
      >
        <div className={classes.avatar}>
          {showAvatar ? (
            <div>
              {user.vCard && user.vCard.photo ? (
                <Avatar
                  className={classes.img}
                  src={`data:${user.vCard.photoType};base64,${
                    user.vCard.photo
                  }`}
                />
              ) : (
                <Avatar className={classes.img}>
                  <Typography>
                    {StringUtil.getAbbreviation(displayName)}
                  </Typography>
                </Avatar>
              )}
              <div className={classes.status}>
                <Status status={user.status} />
              </div>
            </div>
          ) : (
            <div className={classes.statusOnly}>
              <Status status={user.status} />
            </div>
          )}
        </div>
        <Typography className={classes.title}>{displayName}</Typography>
        {user.unreadMessages > 0 && (
          <Badge
            badgeContent={user.unreadMessages}
            classes={{ badge: classes.badge }}
            color="error"
          >
            <span />
          </Badge>
        )}
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
        <MenuItem onClick={handleOnClickDetail}>Details</MenuItem>
      </Menu>
      <Dialog
        open={isDetailsOpen}
        onClose={handleDetailClose}
        className={classes.dialog}
        BackdropProps={{ className: classes.dialog }}
        aria-labelledby="detail-dialog-title"
      >
        <UserDetail user={user} />
      </Dialog>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing.unit,
    borderRadius: '5px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(125,125,125,.2)',
    },
  },
  rootNarrow: {
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  title: {
    flexGrow: 1,
    width: '100px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    marginRight: '20px',
  },
  avatar: {
    position: 'relative',
  },
  img: {
    width: '30px',
    height: '30px',
    fontSize: '.8rem',
    marginRight: theme.spacing.unit,
  },
  status: {
    position: 'absolute',
    bottom: -5,
    right: 5,
    border: '2px solid ' + theme.palette.background.default,
    borderRadius: '50%',
  },
  statusOnly: {
    marginRight: theme.spacing.unit,
  },
  active: {
    background: 'rgba(125,125,125,.4)',
    '&:hover': {
      background: 'rgba(125,125,125,.4)',
    },
  },
  badge: {
    width: '20px',
    marginRight: '8px',
    borderRadius: '5px',
  },
  dialog: {
    top: '23px',
  },
}));

export default User;
