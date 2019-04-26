import React from 'react';
import { useState } from 'react';

import ListSelector from './ListSelector';
import Emojis, { emojis as emojisObj } from '../../utils/emojis';

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  setSelectorIndex: any;
  focusInput: any;
}

const ListSelectorEmojis: React.FC<IProps> = (props: IProps) => {
  const { selectorIndex, text, setText, setSelectorIndex, focusInput } = props;

  const [term, setTerm] = useState('');
  const [emojis, setEmojis] = useState();

  const handleSelection = (object: any) => {
    if (text === '') {
      setText(`:${object.key}: `);
    } else {
      setText(
        `${text.substring(
          0,
          text.length === 0
            ? 0
            : text.lastIndexOf(' ') === -1
            ? text.length - 1
            : text.lastIndexOf(' ') + 1
        )}:${object.key}: `
      );
    }
    focusInput();
    setSelectorIndex(-1);
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
    if (text) {
      const emojiCommandIndex = text.lastIndexOf(':');
      if (emojiCommandIndex !== -1) {
        const emojiCommandPrevIndex = text
          .substring(0, emojiCommandIndex)
          .lastIndexOf(':');
        if (
          emojiCommandIndex !== -1 &&
          !emojisObj[
            text.substring(emojiCommandPrevIndex + 1, emojiCommandIndex)
          ]
        ) {
          setSelectorIndex(0);
          const emojiWord = text.substring(emojiCommandIndex);
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

    if (!setVisibility && selectorIndex === 0) {
      setSelectorIndex(-1);
    }
  }, [selectorIndex, setSelectorIndex, text]);

  return (
    <React.Fragment>
      {selectorIndex === 0 && (
        <ListSelector
          title={'EMOJIS MATCHING'}
          term={term}
          list={emojis}
          showKey={true}
          keyProp={'key'}
          showValue={true}
          valueProp={'value'}
          handleSelection={handleSelection}
          setSelectorIndex={setSelectorIndex}
          itemPrefix={':'}
          itemSuffix={':'}
        />
      )}
    </React.Fragment>
  );
};

export default ListSelectorEmojis;
