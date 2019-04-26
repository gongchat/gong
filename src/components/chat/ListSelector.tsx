import React from 'react';
import { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

let currListIndex = 0;

interface IProps {
  handleSelection: any;
  setSelectorIndex: any;
  list: any;
  term: string;
  title: string;
  showKey: boolean;
  keyProp: string;
  showValue: boolean;
  valueProp: string;
  itemPrefix: string;
  itemSuffix: string;
}

const ListSelector: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  const {
    handleSelection,
    setSelectorIndex,
    list,
    term,
    title,
    showKey,
    keyProp,
    showValue,
    valueProp,
    itemPrefix,
    itemSuffix,
  } = props;

  const [listIndex, setListIndex] = useState(0);

  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      const maxIndex = list.length - 1;
      let itemHeight = 0;
      let scrollTop = 0; // position of the top of the viewable height
      let offsetHeight = 0; // viewable height
      let scrollHeight = 0; // full height of div
      let newIndex = 0;

      if (listRef.current) {
        itemHeight = listRef.current.children[0]
          ? listRef.current.children[0].scrollHeight
          : 0;
        scrollTop = listRef.current.scrollTop;
        offsetHeight = listRef.current.offsetHeight;
        scrollHeight = listRef.current.scrollHeight;

        switch (event.key) {
          case 'ArrowUp':
            newIndex = currListIndex > 0 ? currListIndex - 1 : maxIndex;
            if (listRef.current && scrollTop > itemHeight * newIndex) {
              listRef.current.scrollTop = itemHeight * newIndex;
            } else if (newIndex === maxIndex) {
              listRef.current.scrollTop = scrollHeight;
            }
            currListIndex = newIndex;
            setListIndex(newIndex);
            break;
          case 'ArrowDown':
            newIndex = currListIndex < maxIndex ? currListIndex + 1 : 0;
            if (
              listRef.current &&
              scrollTop + offsetHeight < itemHeight * (newIndex + 1)
            ) {
              listRef.current.scrollTop =
                itemHeight * (newIndex + 1) - offsetHeight;
            } else if (newIndex === 0) {
              listRef.current.scrollTop = 0;
            }
            currListIndex = newIndex;
            setListIndex(newIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            handleSelection(list[currListIndex]);
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
  }, [handleSelection, setSelectorIndex, list]);

  React.useEffect(() => {
    setListIndex(0);
  }, [term]);

  return (
    <div className={classes.root}>
      <Typography>
        <span>{title}</span>
        <span className={classes.term}>{term}</span>
      </Typography>
      <div className={classes.list} ref={listRef}>
        {list &&
          list.map((obj: any, index: number) => (
            <div
              key={obj[keyProp]}
              className={[
                classes.listItem,
                listIndex === index ? classes.current : '',
              ].join(' ')}
              onClick={() => handleSelection(obj)}
            >
              {showValue && (
                <span className={classes.icon}>{obj[valueProp]}</span>
              )}
              {showKey && (
                <Typography>
                  {itemPrefix}
                  {obj[keyProp]}
                  {itemSuffix}
                </Typography>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    background: theme.palette.background.default,
    padding: theme.spacing.unit,
    position: 'absolute',
    bottom: `calc(100% - ${theme.spacing.unit * 2}px)`,
    left: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  term: {
    marginLeft: theme.spacing.unit,
  },
  current: {
    backgroundColor: theme.palette.action.hover,
  },
  list: {
    marginTop: theme.spacing.unit,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  listItem: {
    cursor: 'pointer',
    display: 'flex',
    flexWrap: 'nowrap',
    padding: theme.spacing.unit / 2,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  icon: {
    marginRight: theme.spacing.unit,
    width: theme.spacing.unit * 2,
  },
}));

export default ListSelector;
