import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import {
  getLoggedMessages,
  setChannelScrollPosition,
} from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

// interfaces
import IMessage from 'src/interfaces/IMessage';
import IStates from 'src/interfaces/IStates';

// components
import Message from './Message';

// TODO: Check for logged messages on window resize

class Messages extends React.Component<any, any> {
  public state = {
    messages: [],
    stayAtBottom: false,
  };

  private root: React.RefObject<HTMLDivElement>;
  private scrollTimer: any;

  public constructor(props: any) {
    super(props);
    this.root = React.createRef<HTMLDivElement>();
  }

  public componentDidMount() {
    if (this.root.current) {
      this.root.current.addEventListener('scroll', this.handleScroll);
    }
  }

  public componentWillUnmount() {
    if (this.root.current) {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.root.current.removeEventListener('scroll', this.handleScroll);
      this.props.setChannelScrollPosition(
        this.props.current.jid,
        this.root.current.scrollTop
      );
    }
  }

  public componentDidUpdate(prevProps: any) {
    if (this.props.current !== prevProps.current) {
      if (!this.props.current) {
        this.setState({ messages: [] });
      } else if (
        !prevProps.current ||
        this.props.current !== prevProps.current ||
        (this.props.current.messages &&
          this.props.current.messages.length !==
            prevProps.current.messages.length)
      ) {
        this.setState({ messages: this.props.current.messages });
        this.handleScrollPositionOnLoad(prevProps);
      }
      this.handleLoggedMessages();
    }
  }

  public render() {
    const { classes, settings } = this.props;
    const { messages } = this.state;

    let previousDate = '';
    let previousUserNickname = '';
    let previousMessageStatus = true;
    let hasNewMessageMarker = false;

    return (
      <div className={classes.root} ref={this.root}>
        {/* this is here so the messages start below first */}
        <div className={classes.filler} />
        {messages &&
          messages.map((message: IMessage, index: number) => {
            const showDate = previousDate !== message.timestamp.format('L');
            const showNewMessageMarker =
              !hasNewMessageMarker && previousMessageStatus !== message.isRead;

            const nextMessage: any =
              index + 1 > messages.length ? undefined : messages[index + 1];
            const isNextShowDate = nextMessage
              ? nextMessage.timestamp.format('L') !==
                message.timestamp.format('L')
              : false;
            const isNextShowNewMessageMarker =
              !hasNewMessageMarker && nextMessage && !nextMessage.isRead
                ? nextMessage.isRead !== message.isRead
                : false;

            const isStartOfGroup =
              previousUserNickname !== message.userNickname;
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
                    classes.message,
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
                    onImageLoad={this.handleImageOnLoad}
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
  }

  private handleScrollPositionOnLoad = (prevProps: any) => {
    // handle scroll position
    if (
      !prevProps.current ||
      this.props.current.jid !== prevProps.current.jid
    ) {
      this.handleScrollOnChannelChange();
    } else {
      // if not a new channel and scroll is at bottom stay at bottom.
      if (
        this.root.current &&
        this.props.current.messages.length !== prevProps.current.messages.length
      ) {
        this.handleScrollOnNewMessages(prevProps);
      }
    }
  };

  private handleScrollOnChannelChange = () => {
    if (this.root.current) {
      this.setState({
        stayAtBottom:
          this.root.current.scrollTop + this.root.current.offsetHeight >=
          this.root.current.scrollHeight - 5,
      });
    }

    if (this.props.current.scrollPosition === -1) {
      // default option is to start at bottom
      setTimeout(() => {
        if (this.root.current) {
          this.root.current.scrollTop = this.root.current.scrollHeight;
        }
      });
    } else {
      // update scroll position if new current channel
      setTimeout(() => {
        if (this.root.current) {
          this.root.current.scrollTop = this.props.current.scrollPosition;
        }
      });
    }
  };

  private handleScrollOnNewMessages = (prevProps: any) => {
    if (
      this.root.current &&
      this.root.current.scrollTop + this.root.current.offsetHeight >=
        this.root.current.scrollHeight - 5
    ) {
      // if at bottom stay at bottom
      setTimeout(() => {
        if (this.root.current) {
          this.root.current.scrollTop =
            this.root.current.scrollHeight + this.root.current.offsetHeight;
        }
      });
    } else if (
      this.root.current &&
      prevProps.current.messages[0] &&
      this.props.current.messages[0] &&
      prevProps.current.messages[0].timestamp.diff(
        this.props.current.messages[0].timestamp
      ) > 0
    ) {
      // if the new messages are from logs
      const currentPositionFromBottom = this.root.current.scrollHeight;
      setTimeout(() => {
        if (this.root.current) {
          this.root.current.scrollTop =
            this.root.current.scrollHeight - currentPositionFromBottom;
        }
      });
    }
  };

  private handleLoggedMessages = () => {
    // determine if archived messages should be requested
    setTimeout(() => {
      if (
        this.props.current &&
        !this.props.current.hasNoMoreLogs &&
        !this.props.current.isRequestingLogs &&
        this.root.current &&
        this.root.current.scrollTop === 0 &&
        this.root.current.offsetHeight === this.root.current.scrollHeight
      ) {
        this.props.getLoggedMessages(this.props.current);
      }
    });
  };

  private handleScroll = (event: any) => {
    // load messages if scroll is at top
    if (
      this.props.current &&
      !this.props.current.hasNoMoreLogs &&
      !this.props.current.isRequestingLogs &&
      event.target.scrollTop === 0
    ) {
      this.props.getLoggedMessages(this.props.current);
    }

    // handle on scroll
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      // check if scroll is at bottom
      if (this.root.current) {
        this.setState({
          stayAtBottom:
            this.root.current.scrollTop + this.root.current.offsetHeight >=
            this.root.current.scrollHeight - 5,
        });
      }
      // Saves the scroll position for when the channel is selected again
      if (this.props.current) {
        this.props.setChannelScrollPosition(
          this.props.current.jid,
          event.target.scrollTop
        );
      }
    }, 100);
  };

  private handleImageOnLoad = () => {
    if (this.state.stayAtBottom) {
      if (this.root.current) {
        this.root.current.scrollTop =
          this.root.current.scrollHeight + this.root.current.offsetHeight;
      }
    }
  };
}

const mapStateToProps = (states: IStates) => ({
  settings: states.gong.settings,
  current: states.gong.current,
});

const mapDispatchToProps = {
  getLoggedMessages,
  setChannelScrollPosition,
};

const styles: any = (theme: any) => ({
  root: {
    flexGrow: 1,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    overflowAnchor: 'none',
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Messages));
