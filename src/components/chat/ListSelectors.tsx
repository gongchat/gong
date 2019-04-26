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
      <ListSelectorEmojis
        {...props}
        // text={text}
        // setText={setText}
        // focusInput={focusInput}
        // selectorIndex={selectorIndex}
        // setSelectorIndex={setSelectorIndex}
      />
      <ListSelectorUsers
        {...props}
        // text={text}
        // setText={setText}
        // focusInput={focusInput}
        // selectorIndex={selectorIndex}
        // setSelectorIndex={setSelectorIndex}
      />
    </React.Fragment>
  );
};

export default ListSelectors;
