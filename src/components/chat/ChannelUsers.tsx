import React from 'react';
import { useContext } from '../../context';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import ChannelUser from './ChannelUser';
import IChannelUser from '../../interfaces/IChannelUser';

interface IProps {
  users: IChannelUser[] | undefined;
  title: string;
}

const ChannelUsers: React.FC<IProps> = (props: IProps) => {
  const { users, title } = props;
  const classes = useStyles();
  const [{ theme }] = useContext();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>
        {title} - {users && users.length}
      </Typography>
      <div className={classes.users}>
        {users &&
          users
            .sort((a: IChannelUser, b: IChannelUser) =>
              b.nickname.localeCompare(a.nickname)
            )
            .reverse()
            .map((user: IChannelUser) => (
              <ChannelUser
                key={user.jid}
                user={user}
                showAvatar={theme.sidebarRightShowAvatar}
              />
            ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {},
  title: {
    textTransform: 'uppercase',
    opacity: 0.5,
    paddingBottom: theme.spacing.unit / 2,
  },
  users: {
    paddingBottom: theme.spacing.unit * 2,
  },
}));

export default ChannelUsers;
