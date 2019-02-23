import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

// interfaces
import IChannelUser from 'src/interfaces/IChannelUser';
import IStates from 'src/interfaces/IStates';

// components
import ChannelUser from './ChannelUser';

class ChannelUsers extends React.Component<any, any> {
  public render() {
    const { classes, title, users, theme } = this.props;

    return (
      <div className={classes.root}>
        <Typography className={classes.title}>
          {title} - {users.length}
        </Typography>
        <div className={classes.users}>
          {users
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
  }
}

const mapStateToProps = (states: IStates) => ({
  theme: states.gong.theme,
});

const styles: any = (theme: any) => ({
  root: {},
  title: {
    textTransform: 'uppercase',
    opacity: 0.5,
    paddingBottom: theme.spacing.unit / 2,
  },
  users: {
    paddingBottom: theme.spacing.unit * 2,
  },
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ChannelUsers));
