import React, { FC, useState, useEffect, useRef } from 'react';

import { useTheme } from '@material-ui/core/styles';

import ListSelectorBase from './ListSelectorBase';
import { getGiphySearchUrl } from '../../utils/giphyUtils';

export const giphyListSelectorIndex = 40;

interface IProps {
  selectorIndex: number;
  text: string;
  setText: any;
  setSelectorIndex: any;
  focusInput: any;
}

const ListSelectorGiphy: FC<IProps> = ({
  selectorIndex,
  text,
  setText,
  setSelectorIndex,
  focusInput,
}: IProps) => {
  const theme = useTheme();

  const [term, setTerm] = useState('');
  const [giphies, setGiphies] = useState([]);

  const searchTimer = useRef<any>();

  const handleSelection = (object: any) => {
    if (object) {
      if (text.startsWith('/giphy ')) {
        setText(object.url);
      }
      focusInput();
      setSelectorIndex(0);
    }
  };

  useEffect(() => {
    const fetchIt = (searchTerm: string) => {
      fetch(getGiphySearchUrl(searchTerm))
        .then(res => {
          return res.json();
        })
        .then(json => {
          setGiphies(
            json.data.map(item => ({
              url: `https://media.giphy.com/media/${item.id}/giphy.gif`,
              thumbnailUrl: item.images.fixed_height_downsampled.url,
            }))
          );
        })
        .catch(() => {})
        .finally(() => {});
    };

    if (selectorIndex !== -1) {
      let setVisibility = false;
      if (text.startsWith('/giphy ') && text.length > '/giphy '.length) {
        const newText = text.replace('/giphy ', '');
        setVisibility = true;
        setSelectorIndex(giphyListSelectorIndex);
        setTerm(newText);

        // debounce fetches by 1 second
        if (searchTimer.current) {
          clearTimeout(searchTimer.current);
        }
        searchTimer.current = setTimeout(() => {
          fetchIt(newText);
        }, 1000);
      }
      if (selectorIndex === giphyListSelectorIndex && !setVisibility) {
        setSelectorIndex(0);
      }
    }
  }, [selectorIndex, setSelectorIndex, text]);

  return (
    <>
      {(selectorIndex === giphyListSelectorIndex ||
        selectorIndex === giphyListSelectorIndex + 1) && (
        <ListSelectorBase
          variant="horizontal-images"
          title={'GIPHY MATCHING'}
          titleRight={
            theme.palette.type === 'dark' ? (
              <img
                src="/images/PoweredBy_200px-Black_HorizLogo.png"
                alt="Giphy attribution"
                height="20"
              />
            ) : (
              <img
                src="/images/PoweredBy_200px-White_HorizLogo.png"
                alt="Giphy attribution"
                height="20"
              />
            )
          }
          term={term}
          list={giphies}
          showKey={false}
          keyProp="thumbnailUrl"
          showValue={false}
          valueProp="url"
          handleSelection={handleSelection}
          selectorIndex={selectorIndex}
          setSelectorIndex={setSelectorIndex}
        />
      )}
    </>
  );
};

export default ListSelectorGiphy;
