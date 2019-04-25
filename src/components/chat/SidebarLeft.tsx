import * as React from 'react';
import { useContext } from '../../context';

// material ui
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/styles';

// interfaces
import IChannel from '../../interfaces/IChannel';

// components
import Channels from './Channels';
import Me from './Me';
import Users from './Users';

const SidebarLeft = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const handleKeyDown = (event: any) => {
    if (
      context.channels &&
      event.ctrlKey &&
      (event.key === 'PageUp' || event.key === 'PageDown')
    ) {
      event.preventDefault();
      const sortedChannels = context.channels.sort(
        (a: IChannel, b: IChannel) => {
          if (a.type > b.type) return -1;
          if (a.type < b.type) return 1;
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        }
      );
      const maxIndex = context.channels.length - 1;
      const index = context.current
        ? sortedChannels.findIndex(
            (channel: IChannel) => channel.jid === context.current.jid
          )
        : -1;

      if (event.key === 'PageUp') {
        actions.selectChannel(
          sortedChannels[index > 0 ? index - 1 : maxIndex].jid
        );
      } else if (event.key === 'PageDown') {
        actions.selectChannel(
          sortedChannels[index < maxIndex ? index + 1 : 0].jid
        );
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.channels}>
          <Channels
            title="Open Channels"
            hideIfEmpty={true}
            canAdd={false}
            prefix="@"
            current={context.current}
            channels={context.channels.filter(
              (channel: IChannel) => channel.order === 10
            )}
          />
          <Channels
            title="Rooms"
            hideIfEmpty={false}
            canAdd={true}
            prefix="#"
            current={context.current}
            channels={context.channels.filter(
              (channel: IChannel) => channel.order === 20
            )}
          />
          <Users
            current={context.current}
            users={context.channels.filter(
              (channel: IChannel) => channel.order === 30
            )}
          />
        </div>
      </div>
      <div className={classes.profile}>
        <div className={classes.me}>
          <div className={classes.groupItem}>
            <Me profile={context.profile} showAvatar={true} isColored={false} />
          </div>
          <IconButton
            disableRipple={true}
            className={classes.iconButton}
            onClick={() => actions.toggleShowSettings()}
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
