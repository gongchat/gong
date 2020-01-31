import React, { FC, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Message from './Message';
import MessagesDebug from './MessagesDebug';
import { usePrevious } from '../../hooks/usePrevious';
import IMessage from '../../interfaces/IMessage';
import {
  shouldGetLoggedMessagesOnLoad,
  shouldTrimMessagesOnLoad,
  updateIsForCurrentChannel,
  scrollIt,
  updateIsForNewMessages,
} from '../../utils/messagesUtils';
import { shouldScrollTo, isAtBottom } from './../../utils/messagesUtils';
import { TRIM_AT } from '../../actions/channel';

const Messages: FC = () => {
  const classes = useStyles();
  const [
    { current, settings, connection },
    {
      getChannelLogs,
      setChannelScrollPosition,
      trimOldMessages,
      markMessagesRead,
    },
  ] = useContext();

  const prevCurrent = usePrevious(current);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const [numberOfMessages, setNumberOfMessages] = useState(
    current ? current.messages.length : 0
  );
  const [numberOfLoadedMessages, setNumberOfLoadedMessages] = useState(0);
  const _numberOfLoadedMessages = useRef(0);

  const [scrollTo, setScrollTo] = useState();
  const [scrolledOnNewChannel, setScrolledOnNewChannel] = useState(false);

  const [position, setPosition] = useState(
    current ? current.scrollPosition : -1
  );
  const [positionBeforeLogs, setPositionBeforeLogs] = useState(-1);
  const [prevWindowInnerWidth, setPrevWindowInnerWidth] = useState(-1);

  const newMessageMarkerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleOnMessageLoad = () => {
    const newCount = _numberOfLoadedMessages.current + 1;
    if (newCount < numberOfMessages) {
      _numberOfLoadedMessages.current = newCount;
    } else {
      setIsMessagesLoaded(true);

      setNumberOfLoadedMessages(newCount);
      if (
        // TODO: have to do this or else error is thrown when trying to set
        // properties, this is not needed as the function below does all the
        // checking. This is done throughout this component.
        rootRef.current &&
        shouldGetLoggedMessagesOnLoad(
          scrolledOnNewChannel,
          prevCurrent,
          current,
          rootRef.current
        )
      ) {
        rootRef.current.style.opacity = '0';
        setIsLoaded(false);
        setIsMessagesLoaded(false);
        setPositionBeforeLogs(rootRef.current.scrollHeight);
        getChannelLogs(current);
      }
    }
  };

  // RESETS VALUES ON NEW CHANNEL
  useLayoutEffect(() => {
    if (current && !updateIsForCurrentChannel(prevCurrent, current)) {
      console.log(current.jid);
      _numberOfLoadedMessages.current = 0;
      setChannelScrollPosition(
        prevCurrent ? prevCurrent.jid : current.jid,
        position
      );
      setScrollTo('');
      setNumberOfMessages(current ? current.messages.length : 0);
      setNumberOfLoadedMessages(0);
      setPosition(current ? current.scrollPosition : -1);
      setPositionBeforeLogs(-1);
      setIsLoaded(false);
      setIsMessagesLoaded(false);
    }
  }, [prevCurrent, current, position, setChannelScrollPosition]);

  // SCROLL TO WHEN LOADED
  useLayoutEffect(() => {
    if (isMessagesLoaded) {
      console.log('foo bar');
      setScrollTo(
        shouldScrollTo(
          prevCurrent,
          current,
          rootRef.current,
          newMessageMarkerRef.current
        )
      );
      setScrolledOnNewChannel(true);
    }
  }, [prevCurrent, current, isMessagesLoaded]);

  // ON LOAD - checks
  useLayoutEffect(() => {
    if (rootRef.current && current && isMessagesLoaded && !isLoaded) {
      if (
        shouldGetLoggedMessagesOnLoad(
          scrolledOnNewChannel,
          prevCurrent,
          current,
          rootRef.current
        )
      ) {
        rootRef.current.style.opacity = '0';
        setIsLoaded(false);
        setIsMessagesLoaded(false);
        setPositionBeforeLogs(rootRef.current.scrollHeight);
        getChannelLogs(current);
      }

      if (
        shouldTrimMessagesOnLoad(
          prevCurrent,
          current,
          rootRef.current,
          scrolledOnNewChannel
        )
      ) {
        setIsLoaded(false);
        setIsMessagesLoaded(false);
        trimOldMessages(current.jid);
      }

      setIsLoaded(true);
    }
  }, [
    isLoaded,
    isMessagesLoaded,
    scrolledOnNewChannel,
    current,
    getChannelLogs,
    prevCurrent,
    trimOldMessages,
  ]);

  // ON SCROLL and RESIZE
  useLayoutEffect(() => {
    const rootCurrent = rootRef.current;

    const handleScroll = (event: any) => {
      if (!isLoaded) {
        event.preventDefault();
      } else if (current) {
        if (scrolledOnNewChannel) {
          setPosition(event.target.scrollTop);
          if (event.target.scrollTop === 0 && !current.hasNoMoreLogs) {
            // handle getting of logs
            event.target.style.opacity = '0';
            setIsLoaded(false);
            setIsMessagesLoaded(false);
            setPositionBeforeLogs(event.target.scrollHeight);
            getChannelLogs(current);
          } else if (isAtBottom(event.target)) {
            // handle trimming of messages
            if (current.messages.length >= TRIM_AT) {
              trimOldMessages(current.jid);
            }
            // if new message marker is present, mark messages read when scroll
            // is at the bottom
            if (newMessageMarkerRef.current) {
              markMessagesRead(current.jid);
            }
          }
        }
        // wasAtBottom.current =
        //   Math.ceil(event.target.scrollTop + event.target.offsetHeight) >=
        //   event.target.scrollHeight;
      }
    };

    const handleWindowResize = (event: any) => {
      if (window.innerWidth !== prevWindowInnerWidth) {
        handleScroll(event);
      }
      setPrevWindowInnerWidth(window.innerWidth);
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
  }, [
    current,
    isLoaded,
    scrolledOnNewChannel,
    prevWindowInnerWidth,
    markMessagesRead,
    getChannelLogs,
    trimOldMessages,
  ]);

  // when scroll to changes
  useEffect(() => {
    scrollIt(
      scrollTo,
      rootRef.current,
      newMessageMarkerRef.current,
      current,
      positionBeforeLogs
    );
    if (rootRef.current) {
      rootRef.current.style.opacity = '1';
    }
    setScrolledOnNewChannel(true);
  }, [scrollTo, current, positionBeforeLogs]);

  // Variables used in return
  let prevMessage: IMessage;
  let hasNewMessageMarker = false;

  return (
    <>
      <MessagesDebug
        isLoaded={isLoaded}
        isMessagesLoaded={isMessagesLoaded}
        numberOfMessages={numberOfMessages}
        numberOfLoadedMessages={numberOfLoadedMessages}
        scrollTo={scrollTo}
        scrolledOnNewChannel={scrolledOnNewChannel}
        position={position}
        positionBeforeLogs={positionBeforeLogs}
        prevWindowInnerWidth={prevWindowInnerWidth}
        current={current}
      />
      <div className={classes.root} ref={rootRef}>
        <div className={classes.filler} />
        {current &&
          current.messages &&
          current.messages.map((message: IMessage, index: number) => {
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
              <React.Fragment key={message.id + '-' + index}>
                {showDate && (
                  <div className={classes.marker}>
                    <Typography className={classes.markerValue}>
                      <span>{message.timestamp.format('LL')}</span>
                    </Typography>
                  </div>
                )}
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
                <div
                  className={[
                    !showDate && !showNewMessageMarker && isStartOfGroup
                      ? `${classes.startOfGroupPadding} ${classes.startOfGroupBorder}`
                      : '',
                    isEndOfGroup &&
                    !isNextShowDate &&
                    !isNextShowNewMessageMarker
                      ? classes.endOfGroupPadding
                      : '',
                  ].join(' ')}
                >
                  <Message
                    channel={current}
                    message={message}
                    showAvatar={false}
                    showTime={
                      isStartOfGroup || showDate || showNewMessageMarker
                    }
                    renderVideos={settings.renderVideos}
                    renderGetYarn={settings.renderGetYarn}
                    renderImages={settings.renderImages}
                    onMessageLoad={handleOnMessageLoad}
                  />
                </div>
              </React.Fragment>
            );

            prevMessage = message;

            return returnVal;
          })}
      </div>
    </>
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
    flexDirection: 'column',
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
