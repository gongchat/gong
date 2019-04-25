import * as React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import ListSelector from './ListSelector';

import IChannelUser from '../../interfaces/IChannelUser';

const ListSelectorUsers = (props: any) => {
  const [term, setTerm] = useState('');
  const [channelUsers, setChannelUsers] = useState([]);

  const [context] = useContext();
  const { current } = context;
  const { selectorIndex, text, setSelectorIndex } = props;

  const handleSelection = (obj: any) => {
    const user: any = channelUsers.find((u: IChannelUser) => u.jid === obj.jid);
    if (user) {
      if (props.text === '') {
        props.setText(`@${user.nickname} `);
      } else {
        const length = props.text.length;
        if (length === 0) {
          props.setText(`@${user.nickname} `);
        } else {
          const indexOfLastAt = props.text.lastIndexOf('@');
          if (indexOfLastAt === -1) {
            props.setText(`${props.text}@${user.nickname} `);
          } else {
            const charsBeforeLastAt = props.text.substring(
              indexOfLastAt,
              length
            );
            if (
              charsBeforeLastAt.length - 1 > obj.nickname.length ||
              `@${obj.nickname.substring(0, charsBeforeLastAt.length - 1)}` !==
                charsBeforeLastAt
            ) {
              props.setText(`${props.text}@${user.nickname} `);
            } else {
              props.setText(
                `${props.text.substring(0, indexOfLastAt)}@${user.nickname} `
              );
            }
          }
        }
      }
      props.focusInput();
      props.setSelectorIndex(-1);
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
      {props.selectorIndex === 1 && (
        <ListSelector
          title={'USERS MATCHING'}
          prefix={'@'}
          suffix={''}
          term={term}
          list={channelUsers}
          showKey={true}
          keyProp={'nickname'}
          showValue={false}
          valueProp={'nickname'}
          handleSelection={handleSelection}
          setText={props.setText}
          setSelectorIndex={props.setSelectorIndex}
          itemPrefix={'@'}
        />
      )}
    </React.Fragment>
  );
};

export default ListSelectorUsers;
