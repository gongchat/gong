import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IChannel from '../../interfaces/IChannel';
import IChannelUser from '../../interfaces/IChannelUser';
import IUser from '../../interfaces/IUser';
import { getAbbreviation } from '../../utils/stringUtils';

interface IProps {
  user: IChannelUser;
  showAvatar: boolean;
}

const ChannelUser: FC<IProps> = ({ user, showAvatar }: IProps) => {
  const classes = useStyles();
  const [{ channels }, { selectRoomUser }] = useContext();
  const [channel, setChannel] = useState<IUser | undefined>(undefined);

  const handleOnClick = () => {
    selectRoomUser(user);
  };

  useEffect(() => {
    setChannel(
      channels.find(
        (c: IChannel) =>
          c.type === 'chat' && c.jid === user.userJid.split('/')[0]
      ) as IUser
    );
  }, [channels, user.userJid]);

  return (
    <Tooltip
      title={user.nickname}
      interactive={true}
      arrow={true}
      enterDelay={1000}
    >
      <div
        className={[classes.root, showAvatar ? '' : classes.rootNarrow]
          .join(' ')
          .trim()}
        onClick={handleOnClick}
      >
        {showAvatar && (
          <div className={classes.avatar}>
            <Avatar
              className={classes.img}
              src={
                channel && channel.vCard
                  ? `data:${channel.vCard.photoType};base64,${channel.vCard.photo}`
                  : ''
              }
            >
              {getAbbreviation(user.nickname)}
            </Avatar>
          </div>
        )}
        <Typography className={classes.title} style={{ color: user.color }}>
          {user.nickname}
        </Typography>
      </div>
    </Tooltip>
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
