import React, { FC } from 'react';

import ListSelectorCommands from './ListSelectorCommands';
import ListSelectorEmojis from './ListSelectorEmojis';
import ListSelectorGiphy from './ListSelectorGiphy';
import ListSelectorUsers from './ListSelectorUsers';

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  setSelectorIndex: any;
  focusInput: any;
}

const ListSelectors: FC<IProps> = (props: IProps) => {
  return (
    <>
      <ListSelectorCommands {...props} />
      <ListSelectorEmojis {...props} />
      <ListSelectorGiphy {...props} />
      <ListSelectorUsers {...props} />
    </>
  );
};

export default ListSelectors;
