import React from 'react';
import { useContext } from '../../context';

import Group from './Group';
import User from './User';
import IUser from '../../interfaces/IUser';

interface IProps {
  users: IUser[];
}

const Users: React.FC<IProps> = (props: any) => {
  const [context] = useContext();

  const { users } = props;
  const { theme, current } = context;

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
              {theme.sortChannelsByMostRecentUnread &&
                group.users
                  .filter((user: IUser) => user.unreadMessages > 0)
                  .sort((a: IUser, b: IUser) => {
                    const aValue =
                      a.vCard && a.vCard.fullName && a.vCard.fullName !== ''
                        ? a.vCard.fullName
                        : a.username;
                    const bValue =
                      b.vCard && b.vCard.fullName && b.vCard.fullName !== ''
                        ? b.vCard.fullName
                        : b.username;
                    return aValue.localeCompare(bValue);
                  })
                  .map((user: IUser) => (
                    <User
                      key={user.jid}
                      user={user}
                      showAvatar={theme.sidebarLeftShowAvatar}
                      isSelected={current && current.jid === user.jid}
                    />
                  ))}
              {theme.sortChannelsByMostRecentUnread &&
                group.users
                  .filter((user: IUser) => user.unreadMessages === 0)
                  .sort((a: IUser, b: IUser) => {
                    const aValue =
                      a.vCard && a.vCard.fullName && a.vCard.fullName !== ''
                        ? a.vCard.fullName
                        : a.username;
                    const bValue =
                      b.vCard && b.vCard.fullName && b.vCard.fullName !== ''
                        ? b.vCard.fullName
                        : b.username;
                    return aValue.localeCompare(bValue);
                  })
                  .map((user: IUser) => (
                    <User
                      key={user.jid}
                      user={user}
                      showAvatar={theme.sidebarLeftShowAvatar}
                      isSelected={current && current.jid === user.jid}
                    />
                  ))}
              {!theme.sortChannelsByMostRecentUnread &&
                group.users
                  .sort((a: IUser, b: IUser) => {
                    const aValue =
                      a.vCard && a.vCard.fullName && a.vCard.fullName !== ''
                        ? a.vCard.fullName
                        : a.username;
                    const bValue =
                      b.vCard && b.vCard.fullName && b.vCard.fullName !== ''
                        ? b.vCard.fullName
                        : b.username;
                    return aValue.localeCompare(bValue);
                  })
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
