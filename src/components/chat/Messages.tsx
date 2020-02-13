import React, { FC, useLayoutEffect, useRef } from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Message from './Message';
import MessagesDebug from './MessagesDebug';
import { usePrevious } from '../../hooks/usePrevious';
import IMessage from '../../interfaces/IMessage';
import {
  updateIsForCurrentChannel,
  scrollIt,
  updateIsForNewMessages,
  IScrollData,
} from '../../utils/messagesUtils';
import { shouldScrollTo, isAtBottom } from './../../utils/messagesUtils';
import { TRIM_AT } from '../../actions/channel';

const Messages: FC = () => {
  const classes = useStyles();
  const [
    { current, settings },
    {
      getChannelLogs,
      setChannelScrollPosition,
      trimOldMessages,
      markMessagesRead,
    },
  ] = useContext();

  const prevCurrent = usePrevious(current);

  const scrollData = useRef<IScrollData>({
    numberOfMessages: current ? current.messages.length : 0,
    numberOfLoadedMessages: 0,
    isMessagesLoaded: false,
    hasScrolledOnLoad: false,
    hasScrolledOnNewChannel: false,
    userHasScrolled: false,
    isProgrammaticallyScrolling: false,
    wasAtBottom: true,
    scrollTo: '',
    position: -1,
    positionBeforeLogs: -1,
    prevWindowInnerWidth: -1,
  });

  const newMessageMarkerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // responsible for:
  // - keeping track of when all the messages have been mounted
  // - setting the scroll position
  const handleOnMessageLoad = () => {
    scrollData.current.numberOfLoadedMessages =
      scrollData.current.numberOfLoadedMessages + 1;
    if (
      rootRef.current &&
      !scrollData.current.isMessagesLoaded &&
      scrollData.current.numberOfLoadedMessages >=
        scrollData.current.numberOfMessages
    ) {
      scrollData.current.isMessagesLoaded = true;
      // scroll it
      if (scrollData.current.scrollTo) {
        scrollIt(
          scrollData.current,
          rootRef.current,
          newMessageMarkerRef.current,
          current
        );
        scrollData.current.hasScrolledOnLoad = true;
        scrollData.current.hasScrolledOnNewChannel = true;

        // check for logged messages
        if (
          rootRef.current &&
          rootRef.current.scrollTop === 0 &&
          current &&
          !current.hasNoMoreLogs
        ) {
          scrollData.current.hasScrolledOnLoad = false;
          scrollData.current.positionBeforeLogs = rootRef.current.scrollTop;
          getChannelLogs(current);
        }
      }
      rootRef.current.style.opacity = '1';
    }
  };

  const handleOnMessageUnload = () => {
    scrollData.current.numberOfLoadedMessages =
      scrollData.current.numberOfLoadedMessages - 1;
  };

  const handleOnMediaLoad = () => {
    if (!scrollData.current.userHasScrolled) {
      scrollIt(
        scrollData.current,
        rootRef.current,
        newMessageMarkerRef.current,
        current
      );
    }
  };

  // ON SCROLL and RESIZE
  useLayoutEffect(() => {
    const rootCurrent = rootRef.current;

    const handleScroll = (event: any) => {
      scrollData.current.position = event.target.scrollTop;
      scrollData.current.wasAtBottom = isAtBottom(event.target);

      if (!scrollData.current.isMessagesLoaded) {
        event.preventDefault();
        return;
      }

      if (scrollData.current.isProgrammaticallyScrolling) {
        scrollData.current.isProgrammaticallyScrolling = false;
      } else {
        scrollData.current.userHasScrolled = true;

        if (event.target.scrollTop === 0 && current && !current.hasNoMoreLogs) {
          // handle getting of logs
          scrollData.current.positionBeforeLogs = event.target.scrollHeight;
          getChannelLogs(current);
          return;
        }

        if (isAtBottom(event.target) && current) {
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
    };

    const handleWindowResize = (event: any) => {
      if (window.innerWidth !== scrollData.current.prevWindowInnerWidth) {
        handleScroll(event);
      }
      scrollData.current.prevWindowInnerWidth = window.innerWidth;
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
  }, [current, markMessagesRead, getChannelLogs, trimOldMessages]);

  // handle updates, only cares about new channel or new messages
  // messages can be new or old (from logs)
  //
  // On new channel
  // - save old position
  // - determine if logs should be requested
  // - resetting scrollData
  // - determining where to scroll when all messages are loaded
  //
  // On new messages
  // - resetting scrollData
  // - determining where to scroll when all messages are loaded
  //
  useLayoutEffect(() => {
    if (current && rootRef.current) {
      const isNewChannel = !updateIsForCurrentChannel(prevCurrent, current);
      const isNewMessages = updateIsForNewMessages(prevCurrent, current);
      const isUpdate = isNewChannel || isNewMessages;

      if (isUpdate && rootRef.current) {
        // save scroll position for previous channel
        if (isNewChannel && prevCurrent) {
          setChannelScrollPosition(
            prevCurrent.jid,
            scrollData.current.position
          );
          scrollData.current.numberOfLoadedMessages = 0;
          rootRef.current.style.opacity = '0';
          scrollData.current.position = -1;
          scrollData.current.positionBeforeLogs = -1;
          scrollData.current.userHasScrolled = false;
        }

        // reset values
        scrollData.current.numberOfMessages = current.messages.length;
        scrollData.current.isMessagesLoaded = false;
        scrollData.current.hasScrolledOnNewChannel = isNewChannel
          ? false
          : scrollData.current.hasScrolledOnNewChannel;

        // determine where scroll to scroll once all the messages load
        scrollData.current.scrollTo = shouldScrollTo(
          prevCurrent,
          current,
          rootRef.current,
          newMessageMarkerRef.current,
          scrollData.current
        );

        // check for logs
        if (current.messages.length === 0 && !current.hasNoMoreLogs) {
          scrollData.current.positionBeforeLogs = rootRef.current.scrollHeight;
          getChannelLogs(current);
        }

        // TODO: check if messages should be trimmed

        // if there are no more logs and the channel has no messages, mark everything as loaded
        if (current.messages.length === 0 && current.hasNoMoreLogs) {
          scrollData.current.isMessagesLoaded = true;
          scrollData.current.hasScrolledOnLoad = true;
        }
      }
    }
  }, [prevCurrent, current, getChannelLogs, setChannelScrollPosition]);

  // Variables used in return
  let prevMessage: IMessage;
  let hasNewMessageMarker = false;

  return (
    <>
      {/* TODO: Use the apps settings to manage this value instead. */}
      {false && (
        <MessagesDebug scrollData={scrollData.current} channel={current} />
      )}
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
              <React.Fragment
                key={message.id + '-' + message.timestamp.valueOf()}
              >
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
                    index + 1 === current.messages.length
                      ? classes.overflowAnchorAuto
                      : '',
                    !showDate && !showNewMessageMarker && isStartOfGroup
                      ? `${classes.startOfGroupPadding} ${classes.startOfGroupBorder}`
                      : '',
                    isEndOfGroup &&
                    !isNextShowDate &&
                    !isNextShowNewMessageMarker
                      ? classes.endOfGroupPadding
                      : '',
                  ]
                    .join(' ')
                    .trim()}
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
                    onMessageUnload={handleOnMessageUnload}
                    onMediaLoad={handleOnMediaLoad}
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
    paddingRight: theme.spacing(2) - 8,
    paddingTop: theme.spacing(1),
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '> div': {
      overflowAnchor: 'none',
    },
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
  overflowAnchorAuto: {
    overflowAnchor: 'auto',
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
