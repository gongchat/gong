import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import ListSelectorBase from './ListSelectorBase';

export const commandListSelectorIndex = 30;

const COMMANDS = [
  { key: 'Grab a giphy', value: '/giphy', scope: 'all' },
  { key: 'Sends messages as me', value: '/me', scope: 'all' },
  {
    key: 'Changes your nickname for this room',
    value: '/nick',
    scope: 'groupchat',
  },
];

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  focusInput: any;
  setSelectorIndex: any;
}

const ListSelectorCommands: FC<IProps> = ({
  selectorIndex,
  text,
  setText,
  focusInput,
  setSelectorIndex,
}: IProps) => {
  const [{ current }] = useContext();
  const [term, setTerm] = useState('');
  const [commands, setCommands] = useState(COMMANDS);

  const handleSelection = (obj: any) => {
    if (obj) {
      focusInput();
      setSelectorIndex(0);
      setText(obj.value + ' ');
    }
  };

  useEffect(() => {
    if (current) {
      if (
        selectorIndex !== commandListSelectorIndex + 1 &&
        selectorIndex !== -1
      ) {
        if (text && text.startsWith('/') && text.indexOf(' ') === -1) {
          setSelectorIndex(commandListSelectorIndex);
          setTerm(text);
          setCommands(
            COMMANDS.filter(
              command =>
                command.value.startsWith(text) &&
                (command.scope === 'all' || command.scope === current.type)
            )
          );
        } else if (selectorIndex === commandListSelectorIndex) {
          setSelectorIndex(0);
        }
      }
      if (selectorIndex === commandListSelectorIndex + 1) {
        setTerm('');
      }
    }
  }, [current, selectorIndex, setSelectorIndex, text]);

  return (
    <>
      {(selectorIndex === commandListSelectorIndex ||
        selectorIndex === commandListSelectorIndex + 1) && (
        <ListSelectorBase
          title={'COMMANDS MATCHING'}
          term={term}
          list={commands}
          showKey={true}
          keyProp={'key'}
          showValue={true}
          valueProp={'value'}
          handleSelection={handleSelection}
          selectorIndex={selectorIndex}
          setSelectorIndex={setSelectorIndex}
          itemPrefix={''}
          itemSuffix={''}
          spaceBetween={true}
        />
      )}
    </>
  );
};

export default ListSelectorCommands;
