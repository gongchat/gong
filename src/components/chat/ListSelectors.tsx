import React from 'react';

import ListSelectorEmojis from './ListSelectorEmojis';
import ListSelectorUsers from './ListSelectorUsers';

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  setSelectorIndex: any;
  focusInput: any;
}

const ListSelectors: React.FC<IProps> = (props: IProps) => {
  return (
    <React.Fragment>
      <ListSelectorEmojis {...props} />
      <ListSelectorUsers {...props} />
    </React.Fragment>
  );
};

export default ListSelectors;
