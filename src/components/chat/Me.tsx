import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

// material ui
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// utils
import StringUtil from 'src/utils/stringUtils';

// components
import Status from './Status';
import StatusMenu from './StatusMenu';

const Me = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const displayName =
    context.profile.vCard && context.profile.vCard.fullName
      ? context.profile.vCard.fullName
      : context.profile.username;

  const meRef = React.useRef<HTMLDivElement>(null);

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
          {context.profile.vCard && context.profile.vCard.photoType ? (
            <Avatar
              className={classes.img}
              src={`data:${context.profile.vCard.photoType};base64,${
                context.profile.vCard.photo
              }`}
            />
          ) : (
            <Avatar className={classes.img}>
              {StringUtil.getAbbreviation(displayName)}
            </Avatar>
          )}
          <div className={classes.status}>
            <Status status={context.profile.status} />
          </div>
        </div>
        <Typography className={classes.title}>{displayName}</Typography>
      </div>
      <StatusMenu
        anchorEl={meRef.current}
        open={showStatusMenu}
        onClose={handleCloseStatusMenu}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    position: 'relative',
  },
  me: {
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 1.5,
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
    marginRight: theme.spacing.unit,
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
