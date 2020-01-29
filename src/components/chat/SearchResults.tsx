import React, { FC, useState, useEffect, useRef } from 'react';
import { useContext } from '../../context';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/styles';

import { usePrevious } from '../../hooks/usePrevious';
import IMessage from './../../interfaces/IMessage';
import Message from './Message';

const PAGE_SIZE = 25;
const SEARCH_ORDER = [
  { index: 0, label: 'Newest', value: 'newest' },
  { index: 1, label: 'Oldest', value: 'oldest' },
];

const SearchResult: FC = () => {
  const classes = useStyles();
  const [{ current }, { setSearchOrder }] = useContext();

  const prevCurrent = usePrevious(current);

  const [searchOrderIndex, setSearchOrderIndex] = useState(
    SEARCH_ORDER.find(order => order.value === current?.searchOrder)?.index || 0
  );
  const [numberOfPages, setNumberOfPages] = useState(
    !current ? 0 : Math.ceil(current.searchResults.length / PAGE_SIZE)
  );
  const [currentPage, setCurrentPage] = useState(1);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleOrderOnChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setSearchOrderIndex(newValue);
    if (current) {
      setSearchOrder(current.jid, SEARCH_ORDER[newValue].value);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (current) {
      if (current.searchOrder !== prevCurrent?.searchOrder) {
        setSearchOrderIndex(
          SEARCH_ORDER.find(order => order.value === current.searchOrder)
            ?.index || 0
        );
      }
      if (current.searchResults.length !== prevCurrent?.searchResults.length) {
        setNumberOfPages(Math.ceil(current.searchResults.length / PAGE_SIZE));
      }
      if (
        current.jid !== prevCurrent?.jid ||
        current.searchText !== prevCurrent?.searchText ||
        current.searchOrder !== prevCurrent?.searchOrder
      ) {
        setCurrentPage(1);
      }
    }
  }, [current, prevCurrent]);

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className={classes.root}>
      {current && (
        <Toolbar
          variant="dense"
          disableGutters={true}
          className={classes.toolbar}
        >
          <div className={classes.header}>
            {current.isSearching ? (
              <>
                <Typography>Searching</Typography>{' '}
                <CircularProgress
                  className={classes.spinner}
                  size={12}
                  thickness={4}
                />
              </>
            ) : (
              <Typography>
                {current.searchResults.length.toLocaleString()} record
                {current.searchResults.length === 1 ? '' : 's'} found
              </Typography>
            )}
          </div>
          <Tabs
            value={searchOrderIndex}
            onChange={handleOrderOnChange}
            className={classes.tabs}
            aria-label="Search order"
          >
            {SEARCH_ORDER.map(order => (
              <Tab
                key={order.index}
                label={order.label}
                className={classes.tab}
              />
            ))}
          </Tabs>
        </Toolbar>
      )}
      <div ref={resultsRef} className={classes.messages}>
        {current &&
          !current.isSearching &&
          current.searchResults
            .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
            .map((message: IMessage, index: number) => (
              <Paper key={message.id + '-' + index} className={classes.message}>
                <Message
                  variant="cozy"
                  showAvatar={true}
                  highlightWord={current.searchText}
                  message={message}
                  showTime={true}
                  renderVideos={false}
                  renderGetYarn={false}
                  renderImages={false}
                  onMessageLoad={null}
                />
              </Paper>
            ))}
      </div>
      {numberOfPages > 1 && (
        <div className={classes.paging}>
          <IconButton size="small" onClick={prevPage}>
            <ChevronLeftIcon fontSize="inherit" />
          </IconButton>
          <div className={classes.pagingText}>
            Page {currentPage} of {numberOfPages}
          </div>
          <IconButton size="small" onClick={nextPage}>
            <ChevronRightIcon fontSize="inherit" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    flex: `0 0 ${theme.sidebarWidth * 1.7}px`,
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    justifyContent: 'space-between',
    minHeight: 10,
    border: `1px solid ${theme.palette.background.paper}`,
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
  },
  spinner: {
    marginLeft: theme.spacing(),
  },
  tabs: {
    minHeight: 10,
  },
  tab: {
    minHeight: 10,
    minWidth: 10,
  },
  messages: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  message: {
    margin: theme.spacing(),
    padding: theme.spacing(0.5, 1),
  },
  paging: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.25),
  },
  pagingText: {
    padding: theme.spacing(0, 1),
  },
}));

export default SearchResult;
