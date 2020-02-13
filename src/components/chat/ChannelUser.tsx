import React, { FC } from 'react';
import { useContext } from '../../context';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IChannelUser from '../../interfaces/IChannelUser';
import { getAbbreviation } from '../../utils/stringUtils';

interface IProps {
  user: IChannelUser;
  showAvatar: boolean;
}

const ChannelUser: FC<IProps> = ({ user, showAvatar }: IProps) => {
  const classes = useStyles();
  const { selectRoomUser } = useContext()[1];

  const handleOnClick = () => {
    selectRoomUser(user);
  };

  return (
    <div
      className={[classes.root, showAvatar ? '' : classes.rootNarrow]
        .join(' ')
        .trim()}
      onClick={handleOnClick}
    >
      {showAvatar && (
        <div className={classes.avatar}>
          <Avatar className={classes.img}>
            {getAbbreviation(user.nickname)}
          </Avatar>
        </div>
      )}
      <Typography className={classes.title} style={{ color: user.color }}>
        {user.nickname}
      </Typography>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(1),
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
    padding: theme.spacing(0.5, 1),
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
    marginRight: theme.spacing(1),
  },
}));

export default ChannelUser;
