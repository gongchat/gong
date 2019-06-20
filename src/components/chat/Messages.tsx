import React, { FC, useLayoutEffect, useRef } from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Message from './Message';
import { TRIM_AT } from '../../actions/channel';
import IMessage from '../../interfaces/IMessage';
import { usePrevious } from '../../hooks/usePrevious';
import IMessageUrl from '../../interfaces/IMessageUrl';

let prevWindowInnerWidth: any;
let positionBeforeGettingLogs: any;

const Messages: FC = () => {
  const classes = useStyles();
  const [
    { current, settings },
    { getChannelLogs, setChannelScrollPosition, trimOldMessages },
  ] = useContext();

  const prevCurrent = usePrevious(current);

  // Scroll position is updated when messages are loaded from Message.tsx
  // component. This component uses the status variable to determine what
  // value the scroll position should be updated to.
  //
  // Possible values for status:
  // - scrolled (do nothing)
  // - bottom (scroll to bottom)
  // - new-message-marker (scroll to the new message marker)
  // - saved-position (scroll to the saved position for the channel)
  // - previous-position (scroll to the position before receiving logs)
  const status = useRef('bottom');
  const scrollPosition = useRef(current ? current.scrollPosition : -1);
  const newMessageMarkerRef = useRef<any>(null);
  const root = useRef<HTMLDivElement>(null);

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

  let isLoading = true;
  let numberOfLoadedMessages = 0;
  let numberOfLoadedImages = 0;

  let prevMessage: IMessage;
  let hasNewMessageMarker = false;

  // when new channel
  if (!prevCurrent || (current && current.jid !== prevCurrent.jid)) {
    status.current =
      !current || current.scrollPosition === -1 ? 'bottom' : 'saved-position';
    if (current && current.messages.length === 0) {
      isLoading = false;
    } else if (root.current) {
      root.current.style.opacity = '0';
    }
  }

  const handleOnMessageLoad = () => {
    numberOfLoadedMessages++;
    if (numberOfLoadedMessages >= numberOfMessages) {
      setTimeout(() => {
        handleScrollUpdate();
        if (root.current) {
          root.current.style.opacity = '1';
        }
        if (numberOfLoadedImages >= numberOfImages) {
          isLoading = false;
          handleGetLoggedMessages(root.current);
        }
      }, 0);
    }
  };

  const handleOnMediaLoad = () => {
    numberOfLoadedImages++;
    if (numberOfLoadedImages >= numberOfImages) {
      setTimeout(() => {
        handleScrollUpdate();
        if (root.current) {
          root.current.style.opacity = '1';
        }
        if (numberOfLoadedMessages >= numberOfMessages) {
          isLoading = false;
          handleGetLoggedMessages(root.current);
        }
      }, 0);
    }
  };

  const handleScrollUpdate = () => {
    if (root.current && current) {
      const shouldUpdateForLoggedMessages =
        prevCurrent &&
        prevCurrent.jid === current.jid &&
        prevCurrent.messages.length > 0 &&
        current.messages.length > 0 &&
        prevCurrent.messages[0].timestamp.diff(current.messages[0].timestamp) >
          0 &&
        root.current &&
        root.current.offsetHeight !== root.current.scrollHeight;
      const shouldUpdateToNewMessageMarker = newMessageMarkerRef.current;
      const shouldUpdateToSavedPosition =
        current &&
        current.scrollPosition !== -1 &&
        prevCurrent.jid !== current.jid;
      const shouldUpdateToBottom =
        !prevCurrent ||
        prevCurrent.jid !== current.jid ||
        (current &&
          prevCurrent.messages.length !== current.messages.length &&
          current.messages.length >= 0 &&
          current.messages[current.messages.length - 1].isMe);

      let newStatus = status.current;
      if (shouldUpdateForLoggedMessages) {
        newStatus = 'previous-position';
      } else if (shouldUpdateToSavedPosition) {
        newStatus = 'saved-position';
      } else if (shouldUpdateToBottom) {
        newStatus = 'bottom';
      } else if (shouldUpdateToNewMessageMarker) {
        newStatus = 'new-message-marker';
      }

      switch (newStatus) {
        case 'previous-position':
          root.current.scrollTop =
            root.current.scrollHeight - positionBeforeGettingLogs;
          break;
        case 'new-message-marker':
          if (newMessageMarkerRef.current) {
            root.current.scrollTop = newMessageMarkerRef.current.offsetTop;
          }
          break;
        case 'saved-position':
          if (current) {
            root.current.scrollTop = current.scrollPosition;
          }
          break;
        case 'bottom':
          root.current.scrollTop =
            root.current.scrollHeight + root.current.offsetHeight;
          break;
        default:
          break;
      }

      if (
        root.current.scrollTop + root.current.offsetHeight >=
        root.current.scrollHeight - 5
      ) {
        newStatus = 'bottom';
      }

      status.current = newStatus;
    }
  };

  const handleGetLoggedMessages = (element: any) => {
    if (element) {
      const shouldRequestLoggedMessages =
        !isLoading &&
        element &&
        element.scrollTop === 0 &&
        current &&
        !current.hasNoMoreLogs;

      if (shouldRequestLoggedMessages) {
        if (element.offsetHeight !== element.scrollHeight) {
          status.current = 'previous-position';
        } else {
          status.current = 'bottom';
        }
        if (root.current) {
          root.current.style.opacity = '0';
        }
        isLoading = true;
        positionBeforeGettingLogs = element.scrollHeight;
        getChannelLogs(current);
      }
    }
  };

  // useEffect for handling new channel
  useLayoutEffect(() => {
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
      scrollPosition.current = current.scrollPosition;

      const shouldTrimMessagesOnLoad =
        current &&
        current.messages.length >= TRIM_AT &&
        root.current &&
        root.current.scrollTop + root.current.offsetHeight >=
          root.current.scrollHeight - 5;

      // Check for logged messages
      handleGetLoggedMessages(root.current);

      if (shouldTrimMessagesOnLoad) {
        // Check for trimmed messages
        status.current = 'bottom';
        trimOldMessages(current.jid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    current,
    prevCurrent,
    getChannelLogs,
    trimOldMessages,
    setChannelScrollPosition,
  ]);

  // useEffect for handling scrolling
  useLayoutEffect(() => {
    const rootCurrent = root.current;
    // Event listener functions
    const handleScroll = (event: any) => {
      if (isLoading) {
        event.preventDefault();
      } else {
        scrollPosition.current = event.target.scrollTop;
        if (
          event.target.scrollTop + event.target.offsetHeight >=
          event.target.scrollHeight - 5
        ) {
          status.current = 'bottom';
          if (current && current.messages.length >= TRIM_AT) {
            trimOldMessages(current.jid);
          }
        } else {
          status.current = 'scrolled';
        }
        handleGetLoggedMessages(event.target);
      }
    };
    const handleWindowResize = (event: any) => {
      if (window.innerWidth !== prevWindowInnerWidth) {
        handleScroll(event);
      }
      prevWindowInnerWidth = window.innerWidth;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    prevCurrent,
    current,
    newMessageMarkerRef,
    getChannelLogs,
    trimOldMessages,
    setChannelScrollPosition,
  ]);

  return (
    <div className={classes.root} ref={root}>
      <div className={classes.filler} />
      {current &&
        current.messages &&
        current.messages.map((message: IMessage, index: number) => {
          const showDate =
            !prevMessage ||
            prevMessage.timestamp.format('L') !== message.timestamp.format('L');
          const showNewMessageMarker =
            !hasNewMessageMarker &&
            (prevMessage && prevMessage.isRead !== message.isRead);

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
                    ? `${classes.startOfGroupPadding} ${
                        classes.startOfGroupBorder
                      }`
                    : '',
                  isEndOfGroup && !isNextShowDate && !isNextShowNewMessageMarker
                    ? classes.endOfGroupPadding
                    : '',
                ].join(' ')}
              >
                <Message
                  key={index}
                  message={message}
                  showTime={isStartOfGroup || showDate || showNewMessageMarker}
                  renderVideos={settings.renderVideos}
                  renderGetYarn={settings.renderGetYarn}
                  renderImages={settings.renderImages}
                  onMessageLoad={handleOnMessageLoad}
                  onMediaLoad={handleOnMediaLoad}
                  onMediaError={handleOnMediaLoad} // currently no need for its own function
                />
              </div>
            </React.Fragment>
          );

          prevMessage = message;

          return returnVal;
        })}
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
    flexDirection: 'column',
    position: 'relative',
  },
  filler: {
    flexGrow: 1,
  },
  marker: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
