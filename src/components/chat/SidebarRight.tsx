import React, { FC } from 'react';
import { useContext } from '../../context';

import { makeStyles } from '@material-ui/styles';

import ChannelUsers from './ChannelUsers';
import IChannelUser from '../../interfaces/IChannelUser';
import IRoom from '../../interfaces/IRoom';

import SearchResult from './SearchResults';

const SidebarRight: FC = () => {
  const classes = useStyles();
  const [{ current }] = useContext();

  return (
    <>
      {current && current.type === 'groupchat' && current.searchText === '' && (
        <div className={classes.userListing}>
          <ChannelUsers
            title="Moderators"
            users={
              current &&
              (current as IRoom).users.filter(
                (user: IChannelUser) => user.role === 'moderator'
              )
            }
          />
          <ChannelUsers
            title="Participants"
            users={
              current &&
              (current as IRoom).users.filter(
                (user: IChannelUser) => user.role === 'participant'
              )
            }
          />
        </div>
      )}
      {current && current.searchText !== '' && <SearchResult />}
    </>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  userListing: {
    flex: `0 0 ${theme.sidebarWidth * 0.9}px`,
    backgroundColor: theme.palette.background.default,
    overflowX: 'hidden',
    padding: theme.spacing(2),
    overflowY: 'auto',
    height: '100%',
  },
}));

export default SidebarRight;
