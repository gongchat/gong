import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import ListSelector from './ListSelector';

export const commandListSelectorIndex = 30;

const COMMANDS = [
  { key: 'Sends messages as me', value: '/me' },
  { key: 'Changes your nickname for this room', value: '/nick' },
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
    if (current && current.type === 'groupchat') {
      if (
        selectorIndex !== commandListSelectorIndex + 1 &&
        selectorIndex !== -1
      ) {
        if (text && text.startsWith('/') && text.indexOf(' ') === -1) {
          setSelectorIndex(commandListSelectorIndex);
          setTerm(text);
          setCommands(
            COMMANDS.filter(command => command.value.startsWith(text))
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
        <ListSelector
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
        />
      )}
    </>
  );
};

export default ListSelectorCommands;