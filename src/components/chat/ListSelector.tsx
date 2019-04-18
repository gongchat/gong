import * as React from 'react';
import { useState } from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const ListSelector = (props: any) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const classes = useStyles();

  const [term, setTerm] = useState(props.term);
  const [listIndex, setListIndex] = useState(0);

  let currListIndex = 0;

  React.useEffect(() => {
    // TODO: Figure out why handleKeyDown wont pick up new values from the state
    const handleKeyDown = (event: any) => {
      const maxIndex = props.list.length - 1;
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
            props.handleSelection(currListIndex);
            break;
          case 'Escape':
            props.setSelectorIndex(-1);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    setTerm(props.term);
    setListIndex(0);
  }, [props.term]);

  return (
    <div className={classes.root}>
      <Typography>
        <span>{props.title}</span>
        <span className={classes.term}>{term}</span>
      </Typography>
      <div className={classes.list} ref={listRef}>
        {props.list &&
          props.list.map((obj: any, index: number) => (
            <div
              key={obj[props.keyProp]}
              className={[
                classes.listItem,
                listIndex === index ? classes.current : '',
              ].join(' ')}
              onClick={() => props.handleSelection(index)}
            >
              <span className={classes.icon}>{obj[props.valueProp]}</span>
              <Typography>:{obj[props.keyProp]}:</Typography>
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
