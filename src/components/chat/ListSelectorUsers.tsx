import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import ListSelector from './ListSelector';
import IChannelUser from '../../interfaces/IChannelUser';
import IRoom from '../../interfaces/IRoom';

export const userListSelectorIndex = 20;

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  focusInput: any;
  setSelectorIndex: any;
}

const ListSelectorUsers: FC<IProps> = ({
  selectorIndex,
  text,
  setText,
  focusInput,
  setSelectorIndex,
}: IProps) => {
  const [{ current }] = useContext();
  const [term, setTerm] = useState('');
  const [channelUsers, setChannelUsers] = useState([] as any);

  const handleSelection = (obj: any) => {
    if (obj) {
      const user: any = channelUsers.find(
        (u: IChannelUser) => u.jid === obj.jid
      );
      if (user) {
        const length = text.length;
        if (text === '' || length === 0) {
          setText(`@${user.nickname} `);
        } else {
          const indexOfLastAt = text.lastIndexOf('@');
          if (indexOfLastAt === -1) {
            setText(`${text}@${user.nickname} `);
          } else {
            const charsBeforeLastAt = text
              .substring(indexOfLastAt, length)
              .toLowerCase();
            if (
              charsBeforeLastAt.length - 1 > obj.nickname.length ||
              `@${obj.nickname
                .toLowerCase()
                .substring(0, charsBeforeLastAt.length - 1)}` !==
                charsBeforeLastAt
            ) {
              setText(`${text}@${user.nickname} `);
            } else {
              setText(`${text.substring(0, indexOfLastAt)}@${user.nickname} `);
            }
          }
        }
        focusInput();
        setSelectorIndex(0);
      }
    }
  };

  const sortUsers = (users: IChannelUser[]): IChannelUser[] => {
    let sortedUsers: IChannelUser[] = [];
    const today = moment();
    const sortedRecentMentions = users
      .filter(
        (user: IChannelUser) =>
          user.lastTimeMentionedMe && user.lastTimeMentionedMe.diff(today)
      )
      .sort((a: IChannelUser, b: IChannelUser) =>
        // Need to do ternary operator this to shut up Typescript, it is not
        // smart enough to know that I checked for null in the filter
        b.lastTimeMentionedMe
          ? b.lastTimeMentionedMe.diff(a.lastTimeMentionedMe)
          : 0
      );
    const sortedNonRecentMentions = users
      .filter(
        (user: IChannelUser) =>
          !user.lastTimeMentionedMe || !user.lastTimeMentionedMe.diff(today)
      )
      .sort((a: IChannelUser, b: IChannelUser) =>
        a.nickname.localeCompare(b.nickname)
      );
    if (sortedRecentMentions.length > 0) {
      sortedUsers = sortedRecentMentions;
    }
    if (sortedNonRecentMentions.length > 0) {
      sortedUsers = sortedUsers.concat(sortedNonRecentMentions);
    }
    return sortedUsers;
  };

  useEffect(() => {
    if (current && current.type === 'groupchat') {
      if (selectorIndex !== userListSelectorIndex + 1 && selectorIndex !== -1) {
        let setVisibility = false;
        if (text && current) {
          if (current.type === 'groupchat') {
            const channelCommandIndex = text.lastIndexOf('@');
            if (channelCommandIndex !== -1) {
              const channelUserWord = text.substring(channelCommandIndex);
              if (channelCommandIndex !== -1 && channelUserWord) {
                const newTerm = channelUserWord.substring(1);
                const matchingChannelUsers = (current as IRoom).users.filter(
                  (user: IChannelUser) =>
                    user.nickname
                      .toLowerCase()
                      .startsWith(newTerm.toLowerCase()) ||
                    user.nickname.toLowerCase() === newTerm.toLowerCase()
                );
                if (matchingChannelUsers.length > 0) {
                  setSelectorIndex(userListSelectorIndex);
                  setVisibility = true;
                  setTerm(newTerm);
                  setChannelUsers(sortUsers(matchingChannelUsers));
                }
              }
            }
          }
        }

        if (!setVisibility && selectorIndex === userListSelectorIndex) {
          setSelectorIndex(0);
        }
      }
      if (selectorIndex === userListSelectorIndex + 1) {
        setTerm('');
        setChannelUsers(sortUsers((current as IRoom).users));
      }
    }
  }, [current, selectorIndex, setSelectorIndex, text]);

  return (
    <>
      {(selectorIndex === userListSelectorIndex ||
        selectorIndex === userListSelectorIndex + 1) && (
        <ListSelector
          title={'USERS MATCHING'}
          term={term}
          list={channelUsers}
          showKey={true}
          keyProp={'nickname'}
          showValue={false}
          valueProp={'nickname'}
          handleSelection={handleSelection}
          selectorIndex={selectorIndex}
          setSelectorIndex={setSelectorIndex}
          itemPrefix={'@'}
          itemSuffix={''}
        />
      )}
    </>
  );
};

export default ListSelectorUsers;
