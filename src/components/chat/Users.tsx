import * as React from 'react';
import { useContext } from '../../context';

// interfaces
import IUser from '../../interfaces/IUser';

// components
import Group from './Group';
import User from './User';

const Users = (props: any) => {
  const [context] = useContext();

  const getGroupedUsers = (users: any) => {
    return users.reduce((a: any, c: any) => {
      const group = a.find((g: any) => g.name === c.group);
      if (!group) {
        a.push({ name: c.group, users: [c] });
      } else {
        group.users.push(c);
      }
      return a;
    }, []);
  };

  const groupedUsers = getGroupedUsers(props.users);

  const totalUnreadMessages = props.users.reduce(
    (a: number, b: IUser) => a + b.unreadMessages,
    0
  );

  const hasUnreadMentionMe = props.users.some(
    (user: IUser) => user.hasUnreadMentionMe
  );

  return (
    <div>
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
                    showAvatar={context.theme.sidebarLeftShowAvatar}
                    isSelected={props.current && props.current.jid === user.jid}
                  />
                ))}
            </Group>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Users;
