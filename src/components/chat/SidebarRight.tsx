import * as React from 'react';
import { useContext } from 'src/context';

// material ui
import { makeStyles } from '@material-ui/styles';

// interfaces
import IChannelUser from 'src/interfaces/IChannelUser';

// components
import ChannelUsers from './ChannelUsers';

const SidebarRight = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  return (
    <div className={classes.root}>
      <ChannelUsers
        title="Moderators"
        users={
          context.current &&
          context.current.users.filter(
            (user: IChannelUser) => user.role === 'moderator'
          )
        }
      />
      <ChannelUsers
        title="Participants"
        users={
          context.current &&
          context.current.users.filter(
            (user: IChannelUser) => user.role === 'participant'
          )
        }
      />
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing.unit * 2,
    overflowY: 'auto',
    height: '100%',
  },
}));

export default SidebarRight;
