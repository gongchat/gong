import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { settingsToggle } from 'src/actions/dispatcher';

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
}

const mapStateToProps = (states: IStates) => ({
  profile: states.gong.profile,
  channels: states.gong.channels,
  current: states.gong.current,
});

const mapDispatchToProps = {
  settingsToggle,
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
