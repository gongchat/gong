import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';

// material ui
import { withStyles } from '@material-ui/core';

// interfaces
import IStates from 'src/interfaces/IStates';
import IUser from 'src/interfaces/IUser';

// components
import Group from './Group';
import User from './User';

class Users extends React.Component<any, any> {
  public render() {
    const { classes, theme } = this.props;
    const groupedUsers = this.getGroupedUsers(this.props.users);

    const totalUnreadMessages = this.props.users.reduce(
      (a: number, b: IUser) => a + b.unreadMessages,
      0
    );

    const hasUnreadMentionMe = this.props.users.some(
      (user: IUser) => user.hasUnreadMentionMe
    );

    return (
      <div className={classes.root}>
        {groupedUsers.map((group: any) => {
          if (group.users) {
            return (
              <Group
                key={group.name}
                title={group.name}
                canAdd={false}
                totalUnreadMessages={totalUnreadMessages}
                hasUnreadMentionMe={hasUnreadMentionMe}
              >
                {group.users
                  .sort((a: IUser, b: IUser) => a.name.localeCompare(b.name))
                  .map((user: IUser) => (
                    <User
                      key={user.jid}
                      user={user}
                      showAvatar={theme.sidebarLeftShowAvatar}
                      isSelected={
                        this.props.current &&
                        this.props.current.jid === user.jid
                      }
                    />
                  ))}
              </Group>
            );
          } else {
            return; // TODO: make sure this is okay
          }
        })}
      </div>
    );
  }

  private getGroupedUsers(users: any) {
    return users.reduce((a: any, c: any) => {
      const group = a.find((g: any) => g.name === c.group);
      if (!group) {
        a.push({ name: c.group, users: [c] });
      } else {
        group.users.push(c);
      }
      return a;
    }, []);
  }
}

const mapStateToProps = (states: IStates) => ({
  theme: states.gong.theme,
});

const styles: any = (theme: any) => ({
  root: {},
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Users));
