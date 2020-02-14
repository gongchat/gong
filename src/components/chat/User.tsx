import React, { FC, useState } from 'react';
import { useContext } from '../../context';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Status from './Status';
import UserDetail from './UserDetail';
import IUser from '../../interfaces/IUser';
import { getAbbreviation } from '../../utils/stringUtils';

interface IProps {
  user: IUser;
  isSelected: boolean | undefined;
  showAvatar: boolean;
}

const User: FC<IProps> = ({ user, isSelected, showAvatar }: IProps) => {
  const classes = useStyles();
  const { selectChannel } = useContext()[1];
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
    <>
      <Tooltip
        title={
          <>
            <Typography className={classes.title}>{displayName}</Typography>
            {user.statusText && (
              <>
                <br />
                <Typography className={classes.statusText} variant="caption">
                  {user.statusText}
                </Typography>
              </>
            )}
          </>
        }
        interactive={true}
        arrow={true}
        enterDelay={1000}
      >
        <div
          className={[
            isSelected ? classes.active : '',
            classes.root,
            showAvatar ? '' : classes.rootNarrow,
          ]
            .join(' ')
            .trim()}
          onClick={handleOnClick}
          onContextMenu={handleOnContextMenu}
        >
          <div className={classes.avatar}>
            {showAvatar ? (
              <div>
                {user.vCard && user.vCard.photo ? (
                  <Avatar
                    className={classes.img}
                    src={`data:${user.vCard.photoType};base64,${user.vCard.photo}`}
                  />
                ) : (
                  <Avatar className={classes.img}>
                    <Typography>{getAbbreviation(displayName)}</Typography>
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
          <div className={classes.content}>
            <div className={classes.text}>
              <Typography className={classes.title}>{displayName}</Typography>
            </div>
            {user.statusText && showAvatar && (
              <div className={classes.text}>
                <Typography className={classes.statusText} variant="caption">
                  {user.statusText}
                </Typography>
              </div>
            )}
          </div>
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
      </Tooltip>
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
    </>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(1),
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
    padding: theme.spacing(0.5, 1),
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  text: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    marginRight: '20px',
  },
  title: {
    display: 'inline',
  },
  avatar: {
    position: 'relative',
  },
  img: {
    width: '30px',
    height: '30px',
    fontSize: '.8rem',
    marginRight: theme.spacing(1),
  },
  status: {
    position: 'absolute',
    bottom: -5,
    right: 5,
    border: '2px solid ' + theme.palette.background.default,
    borderRadius: '50%',
  },
  statusOnly: {
    marginRight: theme.spacing(1),
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
