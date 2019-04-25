import React from 'react';
import { useContext } from '../../context';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// interfaces
import IMessage from '../../interfaces/IMessage';

// components
import Message from './Message';
import MessagesScroller from './MessagesScroller';

const Messages = (props: any) => {
  const classes = useStyles();
  const [context] = useContext();

  let previousDate = '';
  let previousUserNickname = '';
  let previousMessageStatus = true;
  let hasNewMessageMarker = false;

  return (
    <MessagesScroller>
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
    </MessagesScroller>
  );
};

const useStyles = makeStyles((theme: any) => ({
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
