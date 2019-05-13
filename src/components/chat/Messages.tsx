import React, { FC, useEffect, useRef, useState } from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Message from './Message';
import { TRIM_AT } from '../../actions/channel';
import IRoom from '../../interfaces/IRoom';
import IMessage from '../../interfaces/IMessage';
import { usePrevious } from '../../utils/usePrevious';

let scrollTimer: any;
let prevScrollHeight: any;
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
  const [status, setStatus] = useState('bottom');

  const newMessageMarkerRef = useRef<any>(null);
  const root = useRef<HTMLDivElement>(null);

  let prevMessage: IMessage;
  let hasNewMessageMarker = false;

  const handleOnMessageLoad = () => {
    handleScrollUpdate();
  };

  const handleOnMediaLoad = () => {
    handleScrollUpdate();
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
      const shouldScrollToBottom =
        prevCurrent &&
        prevCurrent.jid === current.jid &&
        current.messages.length > 0 &&
        prevCurrent.messages.length !== current.messages.length &&
        ((current.type === 'chat' &&
          current.messages[current.messages.length - 1].from ===
            settings.jid) ||
          (current.type === 'groupchat' &&
            current.messages[current.messages.length - 1].userNickname ===
              (current as IRoom).myNickname));
      const shouldUpdateToSavedPosition =
        current &&
        current.scrollPosition !== -1 &&
        (!prevCurrent || current.jid !== prevCurrent.jid);

      let newStatus = status;
      if (shouldUpdateForLoggedMessages) {
        newStatus = 'previous-position';
      } else if (shouldUpdateToNewMessageMarker) {
        newStatus = 'new-message-marker';
      } else if (shouldScrollToBottom) {
        newStatus = 'bottom';
      } else if (shouldUpdateToSavedPosition) {
        newStatus = 'saved-position';
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
      setStatus(newStatus);
      prevScrollHeight = root.current.scrollHeight;
    }
  };

  useEffect(() => {
    const shouldRequestLogsOnLoad =
      root.current &&
      root.current.scrollTop === 0 &&
      current &&
      !current.hasNoMoreLogs &&
      !current.isRequestingLogs;

    const shouldTrimMessagesOnLoad =
      current &&
      current.messages.length >= TRIM_AT &&
      root.current &&
      root.current.scrollTop + root.current.offsetHeight >=
        root.current.scrollHeight - 5;

    // Check for logged messages
    if (shouldRequestLogsOnLoad) {
      if (
        root.current &&
        root.current.offsetHeight !== root.current.scrollHeight
      ) {
        setStatus('previous-position');
      } else {
        setStatus('bottom');
      }
      getChannelLogs(current);
      if (root.current) {
        positionBeforeGettingLogs = root.current.scrollHeight;
      }
    } else if (shouldTrimMessagesOnLoad && current) {
      // Check for trimmed messages
      setStatus('bottom');
      trimOldMessages(current.jid);
    }

    if (root.current) {
      prevScrollHeight = root.current.scrollHeight;
    }
  }, [current, getChannelLogs, trimOldMessages, setChannelScrollPosition]);

  useEffect(() => {
    const rootCurrent = root.current;

    // Event listener functions
    const handleScroll = (event: any) => {
      if (event.target.scrollHeight === prevScrollHeight) {
        if (
          event.target.scrollTop + event.target.offsetHeight >=
            event.target.scrollHeight - 5 &&
          (!prevCurrent || (current && current.jid === prevCurrent.jid))
        ) {
          setStatus('bottom');
          if (current && current.messages.length >= TRIM_AT) {
            trimOldMessages(current.jid);
          }
        } else {
          setStatus('scrolled');
        }
      }

      // update channels saved scroll position
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        const shouldRequestLogsOnScroll =
          current &&
          !current.hasNoMoreLogs &&
          !current.isRequestingLogs &&
          rootCurrent &&
          rootCurrent.scrollTop === 0;

        // get logged message if at top
        if (shouldRequestLogsOnScroll) {
          positionBeforeGettingLogs = event.target.scrollHeight;
          getChannelLogs(current);
          if (
            root.current &&
            root.current.offsetHeight !== root.current.scrollHeight
          ) {
            setStatus('previous-position');
          } else {
            setStatus('bottom');
          }
        }

        // Saves the scroll position for when the channel is selected again
        if (current) {
          setChannelScrollPosition(current.jid, event.target.scrollTop);
        }
      }, 100);
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
      clearTimeout(scrollTimer);
      if (rootCurrent) {
        rootCurrent.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [
    current,
    newMessageMarkerRef,
    getChannelLogs,
    trimOldMessages,
    setChannelScrollPosition,
    prevCurrent,
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

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  filler: {
    flexGrow: 1,
  },
  marker: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
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
      padding: `0 ${theme.spacing.unit}px`,
    },
  },
  newMessageMarkerValue: {
    borderBottom: '1px solid ' + theme.palette.error.main,
  },
  startOfGroupBorder: {
    borderTop: '1px solid ' + theme.palette.divider,
  },
  startOfGroupPadding: {
    paddingTop: theme.spacing.unit,
  },
  endOfGroupPadding: {
    paddingBottom: theme.spacing.unit,
  },
}));

export default Messages;
