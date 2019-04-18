import * as React from 'react';
import { useContext } from 'src/context';

// material ui
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// utils
import StringUtil from 'src/utils/stringUtils';

const ChannelUser = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const handleOnClick = () => {
    actions.selectRoomUser(props.user);
  };

  return (
    <div
      className={[
        classes.root,
        props.showAvatar ? '' : classes.rootNarrow,
      ].join(' ')}
      onClick={handleOnClick}
    >
      {props.showAvatar && (
        <div className={classes.avatar}>
          <Avatar className={classes.img}>
            {StringUtil.getAbbreviation(props.user.nickname)}
          </Avatar>
        </div>
      )}
      <Typography className={classes.title} style={{ color: props.user.color }}>
        {props.user.nickname}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing.unit,
    borderRadius: '5px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflowX: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(125,125,125,.2)',
    },
  },
  rootNarrow: {
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  title: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
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
}));

export default ChannelUser;
