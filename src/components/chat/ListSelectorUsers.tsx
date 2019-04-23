import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

import ListSelector from './ListSelector';

import IChannelUser from 'src/interfaces/IChannelUser';

const ListSelectorUsers = (props: any) => {
  const [term, setTerm] = useState('');
  const [channelUsers, setChannelUsers] = useState([]);

  const [context] = useContext();

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
          if (indexOfLastAt !== -1) {
            const charsBeforeLastAt = props.text.substring(
              indexOfLastAt,
              length
            );
            console.log(
              charsBeforeLastAt,
              obj.nickname.substring(0, charsBeforeLastAt.length)
            );
            if (
              charsBeforeLastAt.length - 1 > obj.nickname.length ||
              `@${obj.nickname.substring(0, charsBeforeLastAt.length - 1)}` !==
                charsBeforeLastAt
            ) {
              props.setText(`${props.text} @${user.nickname} `);
            } else {
              props.setText(
                `${props.text.substring(0, indexOfLastAt)}@${user.nickname} `
              );
            }
          }
        }
      }
      props.setSelectorIndex(-1);
      props.focusInput();
    }
  };

  React.useEffect(() => {
    if (
      props.selectorIndex === 1 &&
      context.current &&
      context.current.type === 'groupchat'
    ) {
      setTerm('');
      setChannelUsers(context.current.users);
    }
  }, [props.selectorIndex]);

  React.useEffect(() => {
    let setVisibility = false;
    if (props.text && context.current) {
      if (context.current.type === 'groupchat') {
        const channelCommandIndex = props.text.lastIndexOf('@');
        if (channelCommandIndex !== -1) {
          const channelUserWord = props.text.substring(channelCommandIndex);
          if (channelCommandIndex !== -1 && channelUserWord) {
            const newTerm = channelUserWord.substring(1);
            const matchingChannelUsers = context.current.users.filter(
              (user: IChannelUser) =>
                user.nickname.toLowerCase().startsWith(newTerm.toLowerCase()) ||
                user.nickname.toLowerCase() === newTerm.toLowerCase()
            );
            if (matchingChannelUsers.length > 0) {
              props.setSelectorIndex(1);
              setVisibility = true;
              setTerm(newTerm);
              setChannelUsers(matchingChannelUsers);
            }
          }
        }
      }
    }

    if (!setVisibility && props.selectorIndex === 1) {
      props.setSelectorIndex(-1);
    }
  }, [props.text]);

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
