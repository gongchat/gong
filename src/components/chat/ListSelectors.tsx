import React, { FC } from 'react';

import ListSelectorEmojis from './ListSelectorEmojis';
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
      <ListSelectorEmojis {...props} />
      <ListSelectorUsers {...props} />
    </>
  );
};

export default ListSelectors;
