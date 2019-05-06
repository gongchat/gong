import React, { useState, useEffect } from 'react';

import ListSelector from './ListSelector';
import Emojis, { emojis as emojisObj } from '../../utils/emojis';

export const emojiListSelectorIndex = 10;

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
    if (object) {
      if (text === '') {
        setText(`:${object.key}: `);
      } else {
        setText(
          `${text.substring(
            0,
            text.length === 0
              ? 0
              : text.lastIndexOf(':') === -1
              ? text.length - 1
              : text.lastIndexOf(' ') > text.lastIndexOf(':')
              ? text.lastIndexOf(' ') + 1
              : text.lastIndexOf(':')
          )}:${object.key}: `
        );
      }
      focusInput();
      setSelectorIndex(0);
    }
  };

  useEffect(() => {
    if (selectorIndex !== -1 && selectorIndex !== emojiListSelectorIndex + 1) {
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
            const emojiWord = text.substring(emojiCommandIndex);
            const newTerm = emojiWord.substring(1);
            const matchingEmojis = Emojis.filter(
              (emoji: any) =>
                emoji.key.startsWith(newTerm) || emoji.key === newTerm
            );
            if (matchingEmojis.length > 0) {
              setVisibility = true;
              setSelectorIndex(emojiListSelectorIndex);
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
      if (selectorIndex === emojiListSelectorIndex && !setVisibility) {
        setSelectorIndex(0);
      }
    }
    if (selectorIndex === emojiListSelectorIndex + 1) {
      setTerm('');
      setEmojis(
        Emojis.map((x: any) => ({ x, r: Math.random() }))
          .sort((a: any, b: any) => a.r - b.r)
          .map((a: any) => a.x)
          .slice(0, 20)
      );
    }
  }, [selectorIndex, setSelectorIndex, text]);

  return (
    <>
      {(selectorIndex === emojiListSelectorIndex ||
        selectorIndex === emojiListSelectorIndex + 1) && (
        <ListSelector
          title={'EMOJIS MATCHING'}
          term={term}
          list={emojis}
          showKey={true}
          keyProp={'key'}
          showValue={true}
          valueProp={'value'}
          handleSelection={handleSelection}
          selectorIndex={selectorIndex}
          setSelectorIndex={setSelectorIndex}
          itemPrefix={':'}
          itemSuffix={':'}
        />
      )}
    </>
  );
};

export default ListSelectorEmojis;
