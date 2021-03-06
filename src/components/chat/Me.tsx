import React, { FC, useState, useRef } from 'react';
import { useContext } from '../../context';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Status from './Status';
import StatusMenu from './StatusMenu';
import { getAbbreviation } from '../../utils/stringUtils';

const Me: FC = () => {
  const classes = useStyles();
  const [{ profile }] = useContext();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const displayName =
    profile.vCard && profile.vCard.fullName
      ? profile.vCard.fullName
      : profile.username;
  const meRef = useRef<HTMLDivElement>(null);

  const toggleStatusMenu = () => {
    setShowStatusMenu(!showStatusMenu);
  };

  const handleCloseStatusMenu = () => {
    setShowStatusMenu(false);
  };

  return (
    <div className={classes.root}>
      <div ref={meRef} className={classes.me}>
        <div className={classes.avatar} onClick={toggleStatusMenu}>
          {profile.vCard && profile.vCard.photoType ? (
            <Avatar
              className={classes.img}
              src={`data:${profile.vCard.photoType};base64,${profile.vCard.photo}`}
            />
          ) : (
            <Avatar className={classes.img}>
              {getAbbreviation(displayName)}
            </Avatar>
          )}
          <div className={classes.status}>
            <Status status={profile.status} />
          </div>
        </div>
        <div className={classes.text}>
          <div className={classes.text}>
            <Typography className={classes.title}>{displayName}</Typography>
          </div>
          {profile.statusText && (
            <div className={classes.text}>
              <Typography className={classes.statusText} variant="caption">
                {profile.statusText}
              </Typography>
            </div>
          )}
        </div>
      </div>
      <StatusMenu
        anchorEl={meRef.current}
        open={showStatusMenu}
        onClose={handleCloseStatusMenu}
      />
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    position: 'relative',
  },
  me: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
    borderRadius: '5px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    whiteSpace: 'nowrap',
  },
  avatar: {
    position: 'relative',
    cursor: 'pointer',
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
    border: '2px solid ' + theme.palette.backgroundAccent,
    borderRadius: '50%',
  },
}));

export default Me;
