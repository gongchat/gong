import * as React from 'react';
import { useState } from 'react';

import ListSelector from './ListSelector';

import Emojis, { emojis as emojisObj } from 'src/utils/emojis';

const ListSelectorEmojis = (props: any) => {
  const [term, setTerm] = useState('');
  const [emojis, setEmojis] = useState();

  const handleSelection = (index: number) => {
    const emoji: any = emojis[index];
    props.setText(
      `${props.text.substring(
        0,
        props.text.length === 0
          ? 0
          : props.text.lastIndexOf(' ') === -1
          ? props.text.length - 1
          : props.text.lastIndexOf(' ') + 1
      )}:${emoji.key}: `
    );
    props.setSelectorIndex(-1);
    props.focusInput();
  };

  React.useEffect(() => {
    if (props.selectorIndex === 0) {
      setTerm('');
      setEmojis(
        Emojis.map((x: any) => ({ x, r: Math.random() }))
          .sort((a: any, b: any) => a.r - b.r)
          .map((a: any) => a.x)
          .slice(0, 20)
      );
    }
  }, [props.selectorIndex]);

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
            props.setSelectorIndex(0);
          }
        }
      }
    }

    if (!setVisibility && props.selectorIndex === 0) {
      props.setSelectorIndex(-1);
    }
  }, [props.text]);

  return (
    <React.Fragment>
      {props.selectorIndex === 0 && (
        <ListSelector
          title={'EMOJIS MATCHING'}
          prefix={':'}
          suffix={':'}
          term={term}
          list={emojis}
          keyProp={'key'}
          valueProp={'value'}
          handleSelection={handleSelection}
          setText={props.setText}
          setSelectorIndex={props.setSelectorIndex}
        />
      )}
    </React.Fragment>
  );
};

export default ListSelectorEmojis;
