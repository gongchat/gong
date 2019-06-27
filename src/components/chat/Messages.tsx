import React, { FC, useLayoutEffect, useRef } from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Message from './Message';
import { TRIM_AT } from '../../actions/channel';
import { usePrevious } from '../../hooks/usePrevious';
import IMessage from '../../interfaces/IMessage';
import IMessageUrl from '../../interfaces/IMessageUrl';

const Messages: FC = () => {
  const classes = useStyles();
  const [
    { current, settings },
    { getChannelLogs, setChannelScrollPosition, trimOldMessages },
  ] = useContext();

  const prevCurrent = usePrevious(current);

  // this is done to prevent react-hooks/exhaustive-deps, would like to use a regular variable without having to disable linting
  const isLoading = useRef(true);
  isLoading.current = true;

  const scrollPosition = useRef(current ? current.scrollPosition : -1);
  const scrollPositionBeforeGettingLogs = useRef(scrollPosition.current);
  const prevWindowInnerWidth = useRef(-1);
  const hasUpdatedScrollOnNewChannel = useRef(false);

  const newMessageMarkerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // normal variables
  const numberOfMessages = current ? current.messages.length : 0;
  const numberOfImages = current
    ? current.messages.reduce(
        (total: number, message: IMessage) =>
          total +
          message.urls.filter((url: IMessageUrl) => url.type === 'image')
            .length,
        0
      )
    : 0;

  let numberOfLoadedMessages = 0;
  let numberOfLoadedImages = 0;

  // when new channel before render
  if (
    (!prevCurrent && current) ||
    (current && current.jid !== prevCurrent.jid)
  ) {
    // save scroll position of pervious channel
    if (scrollPosition.current !== undefined) {
      setChannelScrollPosition(
        prevCurrent ? prevCurrent.jid : current.jid,
        scrollPosition.current
      );
    }

    // set refs to new values
    hasUpdatedScrollOnNewChannel.current = false;
    scrollPosition.current = current.scrollPosition;
    scrollPositionBeforeGettingLogs.current = scrollPosition.current;

    if (current && current.messages.length === 0) {
      isLoading.current = false;
    } else if (rootRef.current) {
      rootRef.current.style.opacity = '0';
    }
  }

  const updateScrollPosition = () => {
    if (rootRef.current && current) {
      if (hasUpdatedScrollOnNewChannel.current) {
        // handle new messages
        if (
          prevCurrent &&
          prevCurrent.jid === current.jid &&
          prevCurrent.messages[0] &&
          current.messages[0] &&
          prevCurrent.messages[0].timestamp.diff(
            current.messages[0].timestamp
          ) > 0 &&
          rootRef.current.offsetHeight !== rootRef.current.scrollHeight
        ) {
          // if update is from logged messages
          rootRef.current.scrollTop =
            rootRef.current.scrollHeight -
            scrollPositionBeforeGettingLogs.current;
        } else if (
          prevCurrent.messages.length !== current.messages.length &&
          current.messages[current.messages.length - 1] &&
          current.messages[current.messages.length - 1].isMe
        ) {
          // if update is from me
          rootRef.current.scrollTop =
            rootRef.current.scrollHeight + rootRef.current.offsetHeight;
        }
      } else {
        // handle initial scroll positions on new channel
        if (newMessageMarkerRef.current) {
          // if the new message marker is present
          rootRef.current.scrollTop =
            rootRef.current.scrollHeight +
            newMessageMarkerRef.current.offsetTop -
            rootRef.current.clientHeight;
        } else if (current && current.scrollPosition !== -1) {
          // if there is a saved scroll position
          rootRef.current.scrollTop = current.scrollPosition;
        }
        hasUpdatedScrollOnNewChannel.current = true;
      }
    }
  };

  const handleGetLoggedMessages = () => {
    if (
      !isLoading.current &&
      rootRef.current &&
      rootRef.current.scrollTop === 0 &&
      current &&
      !current.hasNoMoreLogs
    ) {
      rootRef.current.style.opacity = '0';
      isLoading.current = true;
      scrollPositionBeforeGettingLogs.current = rootRef.current.scrollHeight;
      getChannelLogs(current);
    }
  };

  const handleOnMessageLoad = () => {
    numberOfLoadedMessages++;
    if (numberOfLoadedMessages >= numberOfMessages) {
      setTimeout(() => {
        updateScrollPosition();
        if (rootRef.current) {
          rootRef.current.style.opacity = '1';
        }
        if (numberOfLoadedImages >= numberOfImages) {
          isLoading.current = false;
          handleGetLoggedMessages();
        }
      }, 0);
    }
  };

  const handleOnMediaLoad = () => {
    numberOfLoadedImages++;
    if (numberOfLoadedImages >= numberOfImages) {
      setTimeout(() => {
        updateScrollPosition();
        if (rootRef.current) {
          rootRef.current.style.opacity = '1';
        }
        if (numberOfLoadedMessages >= numberOfMessages) {
          isLoading.current = false;
          handleGetLoggedMessages();
        }
      }, 0);
    }
  };

  // useEffect for handling new channel after render
  useLayoutEffect(() => {
    if (
      !isLoading.current &&
      rootRef.current &&
      ((!prevCurrent && current) ||
        (current && current.jid !== prevCurrent.jid))
    ) {
      // check if should get logged messages
      if (rootRef.current.scrollTop === 0 && !current.hasNoMoreLogs) {
        rootRef.current.style.opacity = '0';
        isLoading.current = true;
        scrollPositionBeforeGettingLogs.current = rootRef.current.scrollHeight;
        getChannelLogs(current);
      }

      // check if should trim messages
      if (
        current.messages.length >= TRIM_AT &&
        rootRef.current.scrollTop + rootRef.current.offsetHeight >=
          rootRef.current.scrollHeight - 5
      ) {
        trimOldMessages(current.jid);
      }
    }
  }, [current, getChannelLogs, prevCurrent, trimOldMessages]);

  // useEffect for handling scrolling and resizing
  useLayoutEffect(() => {
    const rootCurrent = rootRef.current;

    const handleScroll = (event: any) => {
      if (isLoading.current) {
        event.preventDefault();
      } else if (current) {
        scrollPosition.current = event.target.scrollTop;
        if (event.target.scrollTop === 0 && !current.hasNoMoreLogs) {
          // handle getting of logs
          event.target.style.opacity = '0';
          isLoading.current = true;
          scrollPositionBeforeGettingLogs.current = event.target.scrollHeight;
          getChannelLogs(current);
        } else if (
          current.messages.length >= TRIM_AT &&
          event.target.scrollTop + event.target.offsetHeight >=
            event.target.scrollHeight - 5
        ) {
          // handle trimming of messages
          trimOldMessages(current.jid);
        }
      }
    };

    const handleWindowResize = (event: any) => {
      if (window.innerWidth !== prevWindowInnerWidth.current) {
        handleScroll(event);
      }
      prevWindowInnerWidth.current = window.innerWidth;
    };

    if (rootCurrent) {
      rootCurrent.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleWindowResize);
    }

    return () => {
      if (rootCurrent) {
        rootCurrent.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [current, getChannelLogs, trimOldMessages]);

  // Variables used in return
  let prevMessage: IMessage;
  let hasNewMessageMarker = false;

  return (
    <div className={classes.root} ref={rootRef}>
      {current &&
        current.messages &&
        current.messages
          .map((message: IMessage, index: number) => {
            const showDate =
              !prevMessage ||
              prevMessage.timestamp.format('L') !==
                message.timestamp.format('L');
            const showNewMessageMarker =
              !hasNewMessageMarker &&
              ((!prevMessage && !message.isRead) ||
                (prevMessage && prevMessage.isRead !== message.isRead));

            const nextMessage: any =
              index + 1 > current.messages.length
                ? undefined
                : current.messages[index + 1];
            const isNextShowDate = nextMessage
              ? nextMessage.timestamp.format('L') !==
                message.timestamp.format('L')
              : false;
            const isNextShowNewMessageMarker =
              !hasNewMessageMarker &&
              nextMessage &&
              !nextMessage.isRead &&
              nextMessage.isRead !== message.isRead;

            const isStartOfGroup =
              !prevMessage ||
              prevMessage.userNickname !== message.userNickname ||
              moment
                .duration(message.timestamp.diff(prevMessage.timestamp))
                .asMinutes() > 2;
            const isEndOfGroup =
              !nextMessage ||
              nextMessage.userNickname !== message.userNickname ||
              moment
                .duration(nextMessage.timestamp.diff(message.timestamp))
                .asMinutes() > 2;

            if (showNewMessageMarker) {
              hasNewMessageMarker = true;
            }

            const returnVal = (
              <React.Fragment key={index}>
                <div
                  className={[
                    !showDate && !showNewMessageMarker && isStartOfGroup
                      ? `${classes.startOfGroupPadding} ${
                          classes.startOfGroupBorder
                        }`
                      : '',
                    isEndOfGroup &&
                    !isNextShowDate &&
                    !isNextShowNewMessageMarker
                      ? classes.endOfGroupPadding
                      : '',
                  ].join(' ')}
                >
                  <Message
                    key={index}
                    message={message}
                    showTime={
                      isStartOfGroup || showDate || showNewMessageMarker
                    }
                    renderVideos={settings.renderVideos}
                    renderGetYarn={settings.renderGetYarn}
                    renderImages={settings.renderImages}
                    onMessageLoad={handleOnMessageLoad}
                    onMediaLoad={handleOnMediaLoad}
                    onMediaError={handleOnMediaLoad} // currently no need for its own function
                  />
                </div>
                {showNewMessageMarker && (
                  <div ref={newMessageMarkerRef} className={classes.marker}>
                    <Typography
                      color="error"
                      className={[
                        classes.markerValue,
                        classes.newMessageMarkerValue,
                      ].join(' ')}
                    >
                      <span>New Messages</span>
                    </Typography>
                  </div>
                )}
                {showDate && (
                  <div className={classes.marker}>
                    <Typography className={classes.markerValue}>
                      <span>{message.timestamp.format('LL')}</span>
                    </Typography>
                  </div>
                )}
              </React.Fragment>
            );

            prevMessage = message;

            return returnVal;
          })
          .reverse() // using reverse so messages stay at the bottom
      }
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column-reverse', // using reverse so messages stay at the bottom
    position: 'relative',
  },
  filler: {
    flexGrow: 1,
  },
  marker: {
    padding: theme.spacing(1.5, 0),
  },
  markerValue: {
    position: 'relative',
    textAlign: 'center',
    opacity: 0.5,
    fontSize: '0.9rem',
    borderBottom: '2px solid ' + theme.palette.divider,
    '& span': {
      position: 'absolute',
      transform: 'translateY(-50%) translateX(-50%)',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(0, 1),
    },
  },
  newMessageMarkerValue: {
    borderBottom: '1px solid ' + theme.palette.error.main,
  },
  startOfGroupBorder: {
    borderTop: '1px solid ' + theme.palette.divider,
  },
  startOfGroupPadding: {
    paddingTop: theme.spacing(1),
  },
  endOfGroupPadding: {
    paddingBottom: theme.spacing(1),
  },
}));

export default Messages;
