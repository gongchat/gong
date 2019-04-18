import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// interfaces
import IMessage from 'src/interfaces/IMessage';

// components
import Message from './Message';

// TODO: Check for logged messages on window resize
// let scrollTimer: any;

const Messages = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  // let stayAtBottom = false;

  const root = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (root.current) {
      root.current.scrollTop =
        root.current.scrollHeight + root.current.offsetHeight;
    }
  };

  const handleScroll = () => {
    handleLoggedMessages();
  };

  const handleLoggedMessages = () => {
    // determine if archived messages should be requested
    // setTimeout(() => {
    if (
      root.current &&
      context.current &&
      !context.current.hasNoMoreLogs &&
      !context.current.isRequestingLogs &&
      root.current.scrollTop === 0 &&
      root.current.offsetHeight === root.current.scrollHeight
    ) {
      actions.getChannelLogs(context.current);
    }
    // });
  };

  React.useEffect(() => {
    if (root.current) {
      root.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (root.current) {
        root.current.removeEventListener('scroll', handleScroll);
        // if (scrollTimer) {
        //   clearTimeout(scrollTimer);
        // }
        if (context.current) {
          actions.setChannelScrollPosition(
            context.current.jid,
            root.current.scrollTop
          );
        }
      }
    };
  }, []);

  React.useEffect(() => {
    if (context.current) {
      // scroll to bottom
      scrollToBottom();
      // get logs
      handleLoggedMessages();
    }
  }, [context.current]);

  // const handleScrollPositionOnLoad = () => {
  //   // handle scroll position
  //   if (!context.current) {
  //     handleScrollOnChannelChange();
  //   } else {
  //     // if not a new channel and scroll is at bottom stay at bottom.
  //     if (root.current) {
  //       handleScrollOnNewMessages();
  //     }
  //   }
  // };

  // const handleScrollOnChannelChange = () => {
  //   if (root.current) {
  //     // setStayAtBottom(
  //     //   root.current.scrollTop + root.current.offsetHeight >=
  //     //     root.current.scrollHeight - 5
  //     // );
  //   }

  //   if (context.current.scrollPosition === -1) {
  //     // default option is to start at bottom
  //     setTimeout(() => {
  //       if (root.current) {
  //         root.current.scrollTop = root.current.scrollHeight;
  //       }
  //     });
  //   } else {
  //     // update scroll position if new current channel
  //     setTimeout(() => {
  //       if (root.current) {
  //         root.current.scrollTop = context.current.scrollPosition;
  //       }
  //     });
  //   }
  // };

  // const handleScrollOnNewMessages = () => {
  //   if (
  //     root.current &&
  //     root.current.scrollTop + root.current.offsetHeight >=
  //       root.current.scrollHeight - 5
  //   ) {
  //     // if at bottom stay at bottom
  //     setTimeout(() => {
  //       if (root.current) {
  //         root.current.scrollTop =
  //           root.current.scrollHeight + root.current.offsetHeight;
  //       }
  //     });
  //   } else if (
  //     root.current &&
  //     context.current.messages[0]
  //     // TODO: need to check if messages are from logs
  //   ) {
  //     // if the new messages are from logs
  //     const currentPositionFromBottom = root.current.scrollHeight;
  //     setTimeout(() => {
  //       if (root.current) {
  //         root.current.scrollTop =
  //           root.current.scrollHeight - currentPositionFromBottom;
  //       }
  //     });
  //   }
  // };

  // const handleLoggedMessages = () => {
  //   // determine if archived messages should be requested
  //   setTimeout(() => {
  //     if (
  //       context.current &&
  //       !context.current.hasNoMoreLogs &&
  //       !context.current.isRequestingLogs &&
  //       root.current &&
  //       root.current.scrollTop === 0 &&
  //       root.current.offsetHeight === root.current.scrollHeight
  //     ) {
  //       actions.getChannelLogs(context.current);
  //     }
  //   });
  // };

  // const handleScroll = (event: any) => {
  //   // load messages if scroll is at top
  //   if (
  //     context.current &&
  //     !context.current.hasNoMoreLogs &&
  //     !context.current.isRequestingLogs &&
  //     event.target.scrollTop === 0
  //   ) {
  //     actions.getChannelLogs(context.current);
  //   }

  //   // handle on scroll
  //   if (scrollTimer) {
  //     clearTimeout(scrollTimer);
  //   }
  //   scrollTimer = setTimeout(() => {
  //     // check if scroll is at bottom
  //     if (root.current) {
  //       // setStayAtBottom(
  //       //   root.current.scrollTop + root.current.offsetHeight >=
  //       //     root.current.scrollHeight - 5
  //       // );
  //     }
  //     // Saves the scroll position for when the channel is selected again
  //     if (context.current) {
  //       actions.setChannelScrollPosition(
  //         context.current.jid,
  //         event.target.scrollTop
  //       );
  //     }
  //   }, 100);
  // };

  // const handleImageOnLoad = () => {
  //   // if (stayAtBottom) {
  //   //   if (root.current) {
  //   //     root.current.scrollTop =
  //   //       root.current.scrollHeight + root.current.offsetHeight;
  //   //   }
  //   // }
  // };

  // React.useEffect(() => {
  //   if (root.current) {
  //     root.current.addEventListener('scroll', handleScroll);
  //   }
  //   return () => {
  //     if (root.current) {
  //       if (scrollTimer) {
  //         clearTimeout(scrollTimer);
  //       }
  //       root.current.removeEventListener('scroll', handleScroll);
  //       if (context.current) {
  //         actions.setChannelScrollPosition(
  //           context.current.jid,
  //           root.current.scrollTop
  //         );
  //       }
  //     }
  //   };
  // }, []);

  // React.useEffect(() => {
  //   if (!context.current) {
  //     // setMessages([]);
  //   } else {
  //     // setMessages(context.current.messages);
  //     handleScrollPositionOnLoad();
  //   }
  //   handleLoggedMessages();
  // }, [context.current]);

  let previousDate = '';
  let previousUserNickname = '';
  let previousMessageStatus = true;
  let hasNewMessageMarker = false;

  return (
    <div className={classes.root} ref={root}>
      {/* this is here so the messages start below first */}
      <div className={classes.filler} />
      {context.current &&
        context.current.messages &&
        context.current.messages.map((message: IMessage, index: number) => {
          const showDate = previousDate !== message.timestamp.format('L');
          const showNewMessageMarker =
            !hasNewMessageMarker && previousMessageStatus !== message.isRead;

          const nextMessage: any =
            index + 1 > context.current.messages.length
              ? undefined
              : context.current.messages[index + 1];
          const isNextShowDate = nextMessage
            ? nextMessage.timestamp.format('L') !==
              message.timestamp.format('L')
            : false;
          const isNextShowNewMessageMarker =
            !hasNewMessageMarker && nextMessage && !nextMessage.isRead
              ? nextMessage.isRead !== message.isRead
              : false;

          const isStartOfGroup = previousUserNickname !== message.userNickname;
          const isEndOfGroup = nextMessage
            ? nextMessage.userNickname !== message.userNickname
            : true;

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
                <div className={classes.marker}>
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
                  renderVideos={context.settings.renderVideos}
                  renderGetYarn={context.settings.renderGetYarn}
                  renderImages={context.settings.renderImages}
                  // onImageLoad={handleImageOnLoad}
                />
              </div>
            </React.Fragment>
          );

          previousDate = message.timestamp.format('L');
          previousUserNickname = message.userNickname;
          previousMessageStatus = message.isRead;

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
    overflowAnchor: 'auto',
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
