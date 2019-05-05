import React from 'react';
import { useContext } from '../../context';

import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/styles';

import Channels from './Channels';
import Me from './Me';
import Users from './Users';
import IChannel from '../../interfaces/IChannel';
import IUser from '../../interfaces/IUser';

const SidebarLeft: React.FC = () => {
  const classes = useStyles();
  const [
    { channels, current },
    { selectChannel, toggleShowSettings },
  ] = useContext();

  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (
        channels &&
        event.ctrlKey &&
        (event.key === 'PageUp' || event.key === 'PageDown')
      ) {
        event.preventDefault();
        const sortedChannels = channels.sort((a: IChannel, b: IChannel) => {
          if (a.type > b.type) return -1;
          if (a.type < b.type) return 1;
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        const maxIndex = channels.length - 1;
        const index = current
          ? sortedChannels.findIndex(
              (channel: IChannel) => channel.jid === current.jid
            )
          : -1;

        if (event.key === 'PageUp') {
          selectChannel(sortedChannels[index > 0 ? index - 1 : maxIndex].jid);
        } else if (event.key === 'PageDown') {
          selectChannel(sortedChannels[index < maxIndex ? index + 1 : 0].jid);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
    };
  }, [channels, current, selectChannel]);

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.channels}>
          <Channels
            title="Open Channels"
            hideIfEmpty={true}
            canAdd={false}
            prefix="@"
            channels={channels.filter(
              (channel: IChannel) => channel.order === 10
            )}
          />
          <Channels
            title="Rooms"
            hideIfEmpty={false}
            canAdd={true}
            prefix="#"
            channels={channels.filter(
              (channel: IChannel) => channel.order === 20
            )}
          />
          <Users
            users={
              channels.filter(
                (channel: IChannel) => channel.order === 30
              ) as IUser[]
            }
          />
        </div>
      </div>
      <div className={classes.profile}>
        <div className={classes.me}>
          <div className={classes.groupItem}>
            <Me />
          </div>
          <IconButton
            disableRipple={true}
            className={classes.iconButton}
            onClick={() => toggleShowSettings()}
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  upper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  channels: {
    overflowY: 'auto',
  },
  profile: {
    background: theme.palette.background.default,
  },
  me: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    background: theme.palette.backgroundAccent,
    width: theme.sidebarWidth,
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  groupItem: {
    flexGrow: 1,
  },
  iconButton: {
    padding: '0 !important',
  },
}));

export default SidebarLeft;
