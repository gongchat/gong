import * as React from 'react';
import { useState } from 'react';

import ListSelector from './ListSelector';

import Emojis, { emojis as emojisObj } from '../../utils/emojis';

const ListSelectorEmojis = (props: any) => {
  const [term, setTerm] = useState('');
  const [emojis, setEmojis] = useState();
  const { selectorIndex } = props;

  const handleSelection = (object: any) => {
    if (props.text === '') {
      props.setText(`:${object.key}: `);
    } else {
      props.setText(
        `${props.text.substring(
          0,
          props.text.length === 0
            ? 0
            : props.text.lastIndexOf(' ') === -1
            ? props.text.length - 1
            : props.text.lastIndexOf(' ') + 1
        )}:${object.key}: `
      );
    }
    props.focusInput();
    props.setSelectorIndex(-1);
  };

  React.useEffect(() => {
    if (selectorIndex === 0) {
      setTerm('');
      setEmojis(
        Emojis.map((x: any) => ({ x, r: Math.random() }))
          .sort((a: any, b: any) => a.r - b.r)
          .map((a: any) => a.x)
          .slice(0, 20)
      );
    }
  }, [selectorIndex]);

  React.useEffect(() => {
    let setVisibility = false;
    if (props.text) {
      const emojiCommandIndex = props.text.lastIndexOf(':');
      if (emojiCommandIndex !== -1) {
        const emojiCommandPrevIndex = props.text
          .substring(0, emojiCommandIndex)
          .lastIndexOf(':');
        if (
          emojiCommandIndex !== -1 &&
          !emojisObj[
            props.text.substring(emojiCommandPrevIndex + 1, emojiCommandIndex)
          ]
        ) {
          props.setSelectorIndex(0);
          const emojiWord = props.text.substring(emojiCommandIndex);
          const newTerm = emojiWord.substring(1);
          const matchingEmojis = Emojis.filter(
            (emoji: any) =>
              emoji.key.startsWith(newTerm) || emoji.key === newTerm
          );
          if (matchingEmojis.length > 0) {
            setVisibility = true;
            setTerm(newTerm);
            setEmojis(
              newTerm.length === 0
                ? Emojis.map((x: any) => ({ x, r: Math.random() }))
                    .sort((a: any, b: any) => a.r - b.r)
                    .map((a: any) => a.x)
                    .slice(0, 20)
                : matchingEmojis
            );
          }
        }
      }
    }

    if (!setVisibility && props.selectorIndex === 0) {
      props.setSelectorIndex(-1);
    }
  }, [props, props.text]);

  return (
    <React.Fragment>
      {props.selectorIndex === 0 && (
        <ListSelector
          title={'EMOJIS MATCHING'}
          prefix={':'}
          suffix={':'}
          term={term}
          list={emojis}
          showKey={true}
          keyProp={'key'}
          showValue={true}
          valueProp={'value'}
          handleSelection={handleSelection}
          setText={props.setText}
          setSelectorIndex={props.setSelectorIndex}
          itemPrefix={':'}
          itemSuffix={':'}
        />
      )}
    </React.Fragment>
  );
};

export default ListSelectorEmojis;
