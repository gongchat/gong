import React from 'react';
import { useContext } from '../../context';

import Group from './Group';
import User from './User';
import IChannel from '../../interfaces/IChannel';
import IUser from '../../interfaces/IUser';

interface IProps {
  users: IUser[];
  current: IChannel;
}

const Users: React.FC<IProps> = (props: any) => {
  const [context] = useContext();

  const { users, current } = props;
  const { theme } = context;

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

  return (
    <div>
      {getGroupedUsers(users).map((group: any) => {
        if (group.users) {
          return (
            <Group
              key={group.name}
              title={group.name}
              canAdd={false}
              totalUnreadMessages={users.reduce(
                (a: number, b: IUser) => a + b.unreadMessages,
                0
              )}
              hasUnreadMentionMe={users.some(
                (user: IUser) => user.hasUnreadMentionMe
              )}
            >
              {group.users
                .sort((a: IUser, b: IUser) => a.name.localeCompare(b.name))
                .map((user: IUser) => (
                  <User
                    key={user.jid}
                    user={user}
                    showAvatar={theme.sidebarLeftShowAvatar}
                    isSelected={current && current.jid === user.jid}
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
