import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';

// material ui
import { withStyles } from '@material-ui/core';

// interfaces
import IChannelUser from 'src/interfaces/IChannelUser';

// components
import ChannelUsers from './ChannelUsers';

class SidebarRight extends React.Component<any, any> {
  public state = {
    chatUsers: [],
  };

  public componentWillMount() {
    if (this.props.current) {
      this.setState({ chatUsers: this.props.current.users });
    }
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.current) {
      this.setState({ chatUsers: nextProps.current.users });
    }
  }

  public render() {
    const { classes } = this.props;
    const { chatUsers } = this.state;

    return (
      <div className={classes.root}>
        <ChannelUsers
          title="Moderators"
          users={chatUsers.filter(
            (user: IChannelUser) => user.role === 'moderator'
          )}
        />
        <ChannelUsers
          title="Participants"
          users={chatUsers.filter(
            (user: IChannelUser) => user.role === 'participant'
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  current: state.gong.current,
});

const styles: any = (theme: any) => ({
  root: {
    padding: theme.spacing.unit * 2,
    overflowY: 'auto',
    height: '100%',
  },
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(SidebarRight));
