import * as React from 'react';

// utils
import ListSelectorEmojis from './ListSelectorEmojis';
import ListSelectorUsers from './ListSelectorUsers';

const ListSelectors = (props: any) => {
  return (
    <React.Fragment>
      <ListSelectorEmojis
        text={props.text}
        setText={props.setText}
        focusInput={props.focusInput}
        selectorIndex={props.selectorIndex}
        setSelectorIndex={props.setSelectorIndex}
      />
      <ListSelectorUsers
        text={props.text}
        setText={props.setText}
        focusInput={props.focusInput}
        selectorIndex={props.selectorIndex}
        setSelectorIndex={props.setSelectorIndex}
      />
    </React.Fragment>
  );
};

export default ListSelectors;
