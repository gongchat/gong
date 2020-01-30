import React, { FC, useState, useRef, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

let currListIndex = 0;

interface IProps {
  variant?: 'vertical-text' | 'horizontal-images';
  handleSelection: any;
  selectorIndex: number;
  setSelectorIndex: any;
  list: any;
  term: string;
  title: string;
  titleRight?: any;
  showKey?: boolean;
  keyProp: string;
  showValue?: boolean;
  valueProp: string;
  itemPrefix?: string;
  itemSuffix?: string;
  spaceBetween?: boolean;
}

// selectorIndex:
// -1 = Closed via escape
//  0 = None
//  10 = Emojis
//  11 = Emojis via click
//  20 = Users
//  21 = Users via click
//  30 = Commands
//  40 = Giphy

const ListSelectorBase: FC<IProps> = ({
  variant = 'vertical-text',
  handleSelection,
  selectorIndex,
  setSelectorIndex,
  list,
  term,
  title,
  titleRight,
  showKey = true,
  keyProp,
  showValue = true,
  valueProp,
  itemPrefix = '',
  itemSuffix = '',
  spaceBetween = false,
}: IProps) => {
  const classes = useStyles();
  const [listIndex, setListIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currListIndex = 0;
    setListIndex(0);
  }, [selectorIndex, term]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (!event.shiftKey && list.length > 0 && listRef.current) {
        const maxIndex = list.length - 1;
        let itemHeight = 0;
        let scrollTop = 0; // position of the top of the viewable height
        let offsetHeight = 0; // viewable height
        let scrollHeight = 0; // full height of div
        let newIndex = 0;

        let scrollLeft = 0; // position of the left of the viewable width
        let offsetWidth = 0; // viewable width
        let scrollWidth = 0; // full width of div

        itemHeight = listRef.current.children[0]
          ? listRef.current.children[0].scrollHeight
          : 0;
        scrollTop = listRef.current.scrollTop;
        offsetHeight = listRef.current.offsetHeight;
        scrollHeight = listRef.current.scrollHeight;

        scrollLeft = listRef.current.scrollLeft;
        offsetWidth = listRef.current.offsetWidth;
        scrollWidth = listRef.current.scrollWidth;

        switch (event.key) {
          case 'ArrowUp':
            newIndex = currListIndex > 0 ? currListIndex - 1 : maxIndex;
            if (variant === 'vertical-text') {
              if (scrollTop > itemHeight * newIndex) {
                listRef.current.scrollTop = itemHeight * newIndex;
              } else if (newIndex === maxIndex) {
                listRef.current.scrollTop = scrollHeight;
              }
            }
            if (variant === 'horizontal-images') {
              const newItem = listRef.current.children[
                newIndex
              ] as HTMLDivElement;
              if (
                newItem &&
                scrollLeft > newItem.offsetLeft - newItem.offsetWidth
              ) {
                listRef.current.scrollLeft = newItem.offsetLeft;
              } else if (newIndex === maxIndex) {
                listRef.current.scrollLeft = scrollWidth;
              }
            }
            currListIndex = newIndex;
            setListIndex(newIndex);
            break;
          case 'ArrowDown':
            newIndex = currListIndex < maxIndex ? currListIndex + 1 : 0;
            if (variant === 'vertical-text') {
              if (scrollTop + offsetHeight < itemHeight * (newIndex + 1)) {
                listRef.current.scrollTop =
                  itemHeight * (newIndex + 1) - offsetHeight;
              } else if (newIndex === 0) {
                listRef.current.scrollTop = 0;
              }
            }
            if (variant === 'horizontal-images') {
              const newItem = listRef.current.children[
                newIndex
              ] as HTMLDivElement;
              if (
                newItem &&
                scrollLeft + offsetWidth <
                  newItem.offsetLeft + newItem.offsetWidth
              ) {
                listRef.current.scrollLeft =
                  newItem.offsetLeft +
                  newItem.offsetWidth -
                  listRef.current.offsetWidth;
              } else if (newIndex === 0) {
                listRef.current.scrollLeft = 0;
              }
            }
            currListIndex = newIndex;
            setListIndex(newIndex);
            break;
          case 'Tab':
          case 'Enter':
            if (!event.shiftKey) {
              event.preventDefault();
              handleSelection(list[currListIndex]);
            }
            break;
          case 'Escape':
            setSelectorIndex(-1);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSelection, setSelectorIndex, list, variant]);

  useEffect(() => {
    setListIndex(0);
  }, [term]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography>
          <span>{title}</span>
          <span className={classes.term}>{term}</span>
        </Typography>
        {titleRight}
      </div>
      <div className={[classes.list, variant].join(' ')} ref={listRef}>
        {list &&
          list.map((obj: any, index: number) => {
            if (!obj) {
              return <Divider key={obj} />;
            } else {
              return (
                <div
                  key={obj[keyProp]}
                  className={[
                    classes.listItem,
                    listIndex === index ? classes.current : '',
                    spaceBetween ? 'space-between' : '',
                    variant,
                  ].join(' ')}
                  onClick={() => handleSelection(obj)}
                >
                  {variant === 'vertical-text' && (
                    <>
                      {showValue && (
                        <span className={classes.value}>{obj[valueProp]}</span>
                      )}
                      {showKey && (
                        <Typography>
                          {itemPrefix}
                          {obj[keyProp]}
                          {itemSuffix}
                        </Typography>
                      )}
                    </>
                  )}
                  {variant === 'horizontal-images' && (
                    <img height={150} src={obj[keyProp]} alt="giphy" />
                  )}
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    background: theme.palette.background.default,
    padding: theme.spacing(1),
    position: 'absolute',
    bottom: `calc(100% - ${theme.spacing(2)}px)`,
    left: theme.spacing(2),
    right: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  term: {
    marginLeft: theme.spacing(),
  },
  current: {
    backgroundColor: theme.palette.action.hover,
  },
  list: {
    position: 'relative',
    marginTop: theme.spacing(),
    '&.vertical-text': {
      maxHeight: '200px',
      overflowY: 'auto',
    },
    '&.horizontal-images': {
      paddingBottom: theme.spacing(),
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
    },
  },
  listItem: {
    display: 'flex',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.vertical-text': {
      alignItems: 'center',
      flexWrap: 'nowrap',
      padding: theme.spacing(0.5),
      '&.space-between': {
        justifyContent: 'space-between',
      },
    },
    '&.horizontal-images': {
      padding: theme.spacing(),
    },
  },
  value: {
    marginRight: theme.spacing(1),
  },
}));

export default ListSelectorBase;
