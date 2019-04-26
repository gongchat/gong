import React from 'react';
import { useContext } from '../../context';

import { makeStyles } from '@material-ui/styles';

import ChannelUsers from './ChannelUsers';
import IChannelUser from '../../interfaces/IChannelUser';

const SidebarRight: React.FC = () => {
  const classes = useStyles();
  const [context] = useContext();

  const { current } = context;

  return (
    <div className={classes.root}>
      <ChannelUsers
        title="Moderators"
        users={
          current &&
          current.users.filter(
            (user: IChannelUser) => user.role === 'moderator'
          )
        }
      />
      <ChannelUsers
        title="Participants"
        users={
          current &&
          current.users.filter(
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
