import * as React from 'react';
import { useState } from 'react';

import ListSelector from './ListSelector';

import IChannelUser from 'src/interfaces/IChannelUser';

const ListSelectorUsers = (props: any) => {
  const [show, setShow] = useState(false);
  const [term, setTerm] = useState('');
  const [channelUsers, setChannelUsers] = useState([]);

  const handleSelection = (index: number) => {
    const user: any = channelUsers[index];
    props.setText(
      `${props.text.substring(
        0,
        props.text.length === 0
          ? 0
          : props.text.lastIndexOf(' ') === -1
          ? props.text.length
          : props.text.lastIndexOf(' ') + 1
      )}@${user.nickname} `
    );
    props.setSelectorIndex(-1);
    props.focusInput();
  };

  React.useEffect(() => {
    let setVisibility = false;
    if (props.text && props.current) {
      if (props.current.type === 'groupchat') {
        const channelCommandIndex = props.text.lastIndexOf('@');
        if (channelCommandIndex !== -1) {
          const channelUserWord = props.text.substring(channelCommandIndex);
          if (channelCommandIndex !== -1 && channelUserWord) {
            const newTerm = channelUserWord.substring(1);
            const matchingChannelUsers = props.current.users.filter(
              (user: IChannelUser) =>
                user.nickname.toLowerCase().startsWith(newTerm.toLowerCase()) ||
                user.nickname.toLowerCase() === newTerm.toLowerCase()
            );
            if (matchingChannelUsers.length > 0) {
              setVisibility = true;
              setShow(true);
              setTerm(newTerm);
              setChannelUsers(matchingChannelUsers);
            }
            props.setSelectorIndex(1);
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
      {props.selectorIndex === 1 && show && (
        <ListSelector
          title={'USERS MATCHING'}
          prefix={'@'}
          suffix={''}
          term={term}
          list={channelUsers}
          keyProp={'username'}
          valueProp={'nickname'}
          handleSelection={handleSelection}
          setText={props.setText}
          setSelectorIndex={props.setSelectorIndex}
        />
      )}
    </React.Fragment>
  );
};

export default ListSelectorUsers;
