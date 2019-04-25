import * as React from 'react';
import { useContext } from '../../context';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// interfaces
import IChannelUser from '../../interfaces/IChannelUser';

// components
import ChannelUser from './ChannelUser';

const ChannelUsers = (props: any) => {
  const classes = useStyles();
  const [context] = useContext();

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>
        {props.title} - {props.users && props.users.length}
      </Typography>
      <div className={classes.users}>
        {props.users
          .sort((a: IChannelUser, b: IChannelUser) =>
            b.nickname.localeCompare(a.nickname)
          )
          .reverse()
          .map((user: IChannelUser) => (
            <ChannelUser
              key={user.jid}
              user={user}
              showAvatar={context.theme.sidebarRightShowAvatar}
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
