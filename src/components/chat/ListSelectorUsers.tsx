import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import ListSelector from './ListSelector';
import IChannelUser from '../../interfaces/IChannelUser';

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  focusInput: any;
  setSelectorIndex: any;
}

const ListSelectorUsers: React.FC<IProps> = (props: IProps) => {
  const [context] = useContext();

  const { selectorIndex, text, setText, focusInput, setSelectorIndex } = props;
  const { current } = context;

  const [term, setTerm] = useState('');
  const [channelUsers, setChannelUsers] = useState([] as any);

  const handleSelection = (obj: any) => {
    const user: any = channelUsers.find((u: IChannelUser) => u.jid === obj.jid);
    if (user) {
      if (text === '') {
        setText(`@${user.nickname} `);
      } else {
        const length = text.length;
        if (length === 0) {
          setText(`@${user.nickname} `);
        } else {
          const indexOfLastAt = text.lastIndexOf('@');
          if (indexOfLastAt === -1) {
            setText(`${text}@${user.nickname} `);
          } else {
            const charsBeforeLastAt = text.substring(indexOfLastAt, length);
            if (
              charsBeforeLastAt.length - 1 > obj.nickname.length ||
              `@${obj.nickname.substring(0, charsBeforeLastAt.length - 1)}` !==
                charsBeforeLastAt
            ) {
              setText(`${text}@${user.nickname} `);
            } else {
              setText(`${text.substring(0, indexOfLastAt)}@${user.nickname} `);
            }
          }
        }
      }
      focusInput();
      setSelectorIndex(-1);
    }
  };

  React.useEffect(() => {
    if (selectorIndex === 1 && current && current.type === 'groupchat') {
      setTerm('');
      setChannelUsers(current.users);
    }
  }, [current, selectorIndex]);

  React.useEffect(() => {
    let setVisibility = false;
    if (text && current) {
      if (current.type === 'groupchat') {
        const channelCommandIndex = text.lastIndexOf('@');
        if (channelCommandIndex !== -1) {
          const channelUserWord = text.substring(channelCommandIndex);
          if (channelCommandIndex !== -1 && channelUserWord) {
            const newTerm = channelUserWord.substring(1);
            const matchingChannelUsers = current.users.filter(
              (user: IChannelUser) =>
                user.nickname.toLowerCase().startsWith(newTerm.toLowerCase()) ||
                user.nickname.toLowerCase() === newTerm.toLowerCase()
            );
            if (matchingChannelUsers.length > 0) {
              setSelectorIndex(1);
              setVisibility = true;
              setTerm(newTerm);
              setChannelUsers(matchingChannelUsers);
            }
          }
        }
      }
    }

    if (!setVisibility && selectorIndex === 1) {
      setSelectorIndex(-1);
    }
  }, [current, selectorIndex, setSelectorIndex, text]);

  return (
    <React.Fragment>
      {selectorIndex === 1 && (
        <ListSelector
          title={'USERS MATCHING'}
          term={term}
          list={channelUsers}
          showKey={true}
          keyProp={'nickname'}
          showValue={false}
          valueProp={'nickname'}
          handleSelection={handleSelection}
          setSelectorIndex={setSelectorIndex}
          itemPrefix={'@'}
          itemSuffix={''}
        />
      )}
    </React.Fragment>
  );
};

export default ListSelectorUsers;
