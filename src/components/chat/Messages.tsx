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

interface IScrollData {
  numberOfMessages: number;
  numberOfLoadedMessages: number;
  scrolledOnNewChannel: boolean;
  position: number;
  positionBeforeLogs: number;
  prevWindowInnerWidth: number;
}

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

  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

  const [scrollData, setScrollData] = useState<IScrollData>({
    numberOfMessages: 0,
    numberOfLoadedMessages: 0,
    scrolledOnNewChannel: false,
    position: -1,
    positionBeforeLogs: -1,
    prevWindowInnerWidth: -1,
  });
  const numberOfLoadedMessages = useRef(0);

  const newMessageMarkerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleOnMessageLoad = () => {
    const newCount = numberOfLoadedMessages.current + 1;
    if (newCount < numberOfLoadedMessages.current) {
    } else {
      console.log('we are loaded');
      setScrollData(_scrollData => {
        if (numberOfLoadedMessages.current === newCount && !isMessagesLoaded) {
          setIsMessagesLoaded(true);
          return {
            ..._scrollData,
            numberOfLoadedMessages: numberOfLoadedMessages.current,
          };
        }
        return _scrollData;
      });
    }
  };

  // Reset scrollData on new channel
  useLayoutEffect(() => {
    setScrollData(_scrollData => {
      let data = { ..._scrollData };
      if (!updateIsForCurrentChannel(prevCurrent, current)) {
        data.numberOfMessages = 0;
        data.numberOfLoadedMessages = 0;
        data.scrolledOnNewChannel = false;
        data.position = -1;
        data.positionBeforeLogs = -1;
        data.prevWindowInnerWidth = -1;

        // TODO: set the scroll position
        // scrollIt(shouldScrollTo()); 

        setIsMessagesLoaded(false);
        return data;
      } else if (rootRef.current) {
        console.log('update on same channel');
        // set the scroll position

        if (
          shouldGetLoggedMessagesOnLoad(prevCurrent, current, rootRef.current)
        ) {
          console.log('logged messages');
          rootRef.current.style.opacity = '0';
          data.positionBeforeLogs = rootRef.current.scrollHeight;
          getChannelLogs(current);
          setIsMessagesLoaded(false);
        }

        if (
          current &&
          shouldTrimMessagesOnLoad(
            prevCurrent,
            current,
            rootRef.current,
            _scrollData.scrolledOnNewChannel
          )
        ) {
          console.log('trim messages');
          trimOldMessages(current.jid);
          setIsMessagesLoaded(false);
        }

        return data;
      }
      return _scrollData;
    });
  }, [prevCurrent, current, getChannelLogs, trimOldMessages]);

  useLayoutEffect(() => {
    console.log('isLoaded use effect')
    if (isMessagesLoaded && rootRef.current) {
      console.log('isLoaded use effect - opacity')
      rootRef.current.style.opacity = '1';
    }
  }, [isMessagesLoaded]);

  // // RESETS VALUES ON NEW CHANNEL
  // useLayoutEffect(() => {
  //   if (current && !updateIsForCurrentChannel(prevCurrent, current)) {
  //     console.log(current.jid);
  //     _numberOfLoadedMessages.current = 0;
  //     setChannelScrollPosition(
  //       prevCurrent ? prevCurrent.jid : current.jid,
  //       position
  //     );
  //     setScrollTo('');
  //     setNumberOfMessages(current ? current.messages.length : 0);
  //     setNumberOfLoadedMessages(0);
  //     setPosition(current ? current.scrollPosition : -1);
  //     setPositionBeforeLogs(-1);
  //     setIsLoaded(false);
  //     setIsMessagesLoaded(false);
  //   }
  // }, [prevCurrent, current, position, setChannelScrollPosition]);

  // // SCROLL TO WHEN LOADED
  // useLayoutEffect(() => {
  //   if (isMessagesLoaded) {
  //     console.log('foo bar');
  //     setScrollTo(
  //       shouldScrollTo(
  //         prevCurrent,
  //         current,
  //         rootRef.current,
  //         newMessageMarkerRef.current
  //       )
  //     );
  //     setScrolledOnNewChannel(true);
  //   }
  // }, [prevCurrent, current, isMessagesLoaded]);

  // // ON LOAD - checks
  // useLayoutEffect(() => {
  //   if (rootRef.current && current && isMessagesLoaded && !isLoaded) {
  //     if (
  //       shouldGetLoggedMessagesOnLoad(
  //         scrolledOnNewChannel,
  //         prevCurrent,
  //         current,
  //         rootRef.current
  //       )
  //     ) {
  //       rootRef.current.style.opacity = '0';
  //       setIsLoaded(false);
  //       setIsMessagesLoaded(false);
  //       setPositionBeforeLogs(rootRef.current.scrollHeight);
  //       getChannelLogs(current);
  //     }

  //     if (
  //       shouldTrimMessagesOnLoad(
  //         prevCurrent,
  //         current,
  //         rootRef.current,
  //         scrolledOnNewChannel
  //       )
  //     ) {
  //       setIsLoaded(false);
  //       setIsMessagesLoaded(false);
  //       trimOldMessages(current.jid);
  //     }

  //     setIsLoaded(true);
  //   }
  // }, [
  //   isLoaded,
  //   isMessagesLoaded,
  //   scrolledOnNewChannel,
  //   current,
  //   getChannelLogs,
  //   prevCurrent,
  //   trimOldMessages,
  // ]);

  // ON SCROLL and RESIZE
  useLayoutEffect(() => {
    const rootCurrent = rootRef.current;

    const handleScroll = (event: any) => {
      if (!scrollData.scrolledOnNewChannel) {
        event.preventDefault();
      } else if (current) {
        setScrollData(_scrollData => {
          const data = { ..._scrollData };
          data.position = event.target.scrollTop;
          if (event.target.scrollTop === 0 && !current.hasNoMoreLogs) {
            // handle getting of logs
            event.target.style.opacity = '0';
            data.positionBeforeLogs = event.target.scrollHeight;
            setIsMessagesLoaded(false);
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
          return data;
        });
        // wasAtBottom.current =
        //   Math.ceil(event.target.scrollTop + event.target.offsetHeight) >=
        //   event.target.scrollHeight;
      }
    };

    const handleWindowResize = (event: any) => {
      setScrollData(_scrollData => {
        if (window.innerWidth !== _scrollData.prevWindowInnerWidth) {
          handleScroll(event);
        }
        return { ..._scrollData, prevWindowInnerWidth: window.innerWidth };
      });
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

  // // when scroll to changes
  // useEffect(() => {
  //   scrollIt(
  //     scrollTo,
  //     rootRef.current,
  //     newMessageMarkerRef.current,
  //     current,
  //     positionBeforeLogs
  //   );
  //   if (rootRef.current) {
  //     rootRef.current.style.opacity = '1';
  //   }
  //   setScrolledOnNewChannel(true);
  // }, [scrollTo, current, positionBeforeLogs]);

  // Variables used in return
  let prevMessage: IMessage;
  let hasNewMessageMarker = false;

  return (
    <>
      {/* <MessagesDebug
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
      /> */}
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
