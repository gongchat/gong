import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { selectChannel, settingsToggle } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

// interfaces
import IChannel from 'src/interfaces/IChannel';
import IStates from 'src/interfaces/IStates';

// components
import Channels from './Channels';
import Me from './Me';
import Users from './Users';

class SidebarLeft extends React.Component<any, any> {
  public componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  public render() {
    const { classes, profile, channels, current } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.upper}>
          <div className={classes.channels}>
            <Channels
              title="Open Channels"
              hideIfEmpty={true}
              canAdd={false}
              prefix="@"
              current={current}
              channels={channels.filter(
                (channel: IChannel) => channel.order === 10
              )}
            />
            <Channels
              title="Rooms"
              hideIfEmpty={false}
              canAdd={true}
              prefix="#"
              current={current}
              channels={channels.filter(
                (channel: IChannel) => channel.order === 20
              )}
            />
            <Users
              current={current}
              users={channels.filter(
                (channel: IChannel) => channel.order === 30
              )}
            />
          </div>
        </div>
        <div className={classes.profile}>
          <div className={classes.me}>
            <div className={classes.groupItem}>
              <Me profile={profile} showAvatar={true} isColored={false} />
            </div>
            <IconButton
              disableRipple={true}
              className={classes.iconButton}
              onClick={this.props.settingsToggle}
            >
              <SettingsIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }

  private handleKeyDown = (event: any) => {
    if (
      this.props.channels &&
      event.ctrlKey &&
      (event.key === 'PageUp' || event.key === 'PageDown')
    ) {
      event.preventDefault();
      const sortedChannels = this.props.channels.sort(
        (a: IChannel, b: IChannel) => {
          if (a.type > b.type) return -1;
          if (a.type < b.type) return 1;
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        }
      );
      const maxIndex = this.props.channels.length - 1;
      const index = this.props.current
        ? sortedChannels.findIndex(
            (channel: IChannel) => channel.jid === this.props.current.jid
          )
        : -1;

      if (event.key === 'PageUp') {
        this.props.selectChannel(
          sortedChannels[index > 0 ? index - 1 : maxIndex].jid
        );
      } else if (event.key === 'PageDown') {
        this.props.selectChannel(
          sortedChannels[index < maxIndex ? index + 1 : 0].jid
        );
      }
    }
  };
}

const mapStateToProps = (states: IStates) => ({
  profile: states.gong.profile,
  channels: states.gong.channels,
  current: states.gong.current,
});

const mapDispatchToProps = {
  settingsToggle,
  selectChannel,
};

const styles: any = (theme: any) => ({
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SidebarLeft));
