import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IMessage from './../../interfaces/IMessage';

import Message from './Message';

const SEARCH_ORDER = [
  { index: 0, label: 'Newest', value: 'newest' },
  { index: 1, label: 'Oldest', value: 'oldest' },
];

const SearchResult: FC = () => {
  const classes = useStyles();
  const [{ current }, { setSearchOrder }] = useContext();

  const [searchOrderIndex, setSearchOrderIndex] = useState(
    SEARCH_ORDER.find(order => order.value === current?.searchOrder)?.index || 0
  );

  const handleOrderOnChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setSearchOrderIndex(newValue);
    if (current) {
      setSearchOrder(current.jid, SEARCH_ORDER[newValue].value);
    }
  };

  useEffect(() => {
    setSearchOrderIndex(
      SEARCH_ORDER.find(order => order.value === current?.searchOrder)?.index ||
        0
    );
  }, [current]);

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
                {current.searchResults.length} record
                {current.searchResults.length > 1 ? '' : 's'} found
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
      <div className={classes.messages}>
        {current &&
          !current.isSearching &&
          current.searchResults.map((message: IMessage, index: number) => (
            <Paper key={index} className={classes.message}>
              <Message
                key={index}
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
}));

export default SearchResult;
