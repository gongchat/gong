import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';

// interfaces
import IUser from 'src/interfaces/IUser';

// components
import Group from './Group';
import User from './User';

class Users extends React.Component<any, any> {
  public state = {
    groupedUsers: [],
  };

  constructor(props: any) {
    super(props);
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.users) {
      this.setState({
        groupedUsers: this.getGroupedUsers(nextProps.users),
      });
    }
  }

  public render() {
    const { classes } = this.props;
    const { groupedUsers } = this.state;

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
                showAvatars={true}
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

const styles: any = (theme: any) => ({
  root: {},
});

export default withStyles(styles)(Users);
