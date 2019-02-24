import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setChannelScrollPosition } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

// interfaces
import IMessage from 'src/interfaces/IMessage';
import IStates from 'src/interfaces/IStates';

// components
import Message from './Message';

class Messages extends React.Component<any, any> {
  public state = {
    messages: [],
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
      this.root.current.removeEventListener('scroll', this.handleScroll);
    }
  }

  public componentWillReceiveProps(nextProps: any) {
    const messagesCountBeforeUpdate: number = this.state.messages.length;
    // check if at bottom before adding messages
    let isAtBottom: boolean = false;
    if (this.root.current) {
      isAtBottom =
        this.root.current.scrollTop + this.root.current.offsetHeight >=
        this.root.current.scrollHeight - 5; // -5 is a buffer
    }

    if (nextProps.current) {
      // check for new messages
      if (
        nextProps.current.messages &&
        (nextProps.current.messages.length !== messagesCountBeforeUpdate ||
          (this.props.current &&
            this.props.current.jid !== nextProps.current.jid))
      ) {
        this.setState({ messages: nextProps.current.messages });
      }

      // check if new channel is selected
      if (
        this.props.current &&
        this.props.current.jid !== nextProps.current.jid
      ) {
        // update scroll position if new current channel
        setTimeout(() => {
          if (this.root.current) {
            this.root.current.scrollTop = nextProps.current.scrollPosition;
          }
        });
      } else {
        // if not a new channel and scroll is at bottom stay at bottom.
        setTimeout(() => {
          if (
            isAtBottom &&
            this.root.current &&
            messagesCountBeforeUpdate !== nextProps.current.messages.length
          ) {
            this.root.current.scrollTop =
              this.root.current.scrollHeight + this.root.current.offsetHeight;
          }
        });
      }
    } else {
      this.setState({ messages: [] });
    }
  }

  public render() {
    const { classes, settings } = this.props;
    const { messages } = this.state;

    let previousDate = '';
    let previousUserNickname = '';

    return (
      <div className={classes.root} ref={this.root}>
        {/* this is here so the messages start below first */}
        <div className={classes.filler} />
        {messages &&
          messages.map((message: IMessage, index: number) => {
            const nextMessage: any =
              index + 1 > messages.length ? undefined : messages[index + 1];
            const showDate = previousDate !== message.timestamp.format('L');
            const isNextShowDate = nextMessage
              ? nextMessage.timestamp.format('L') !==
                message.timestamp.format('L')
              : false;
            const isStartOfGroup =
              previousUserNickname !== message.userNickname;
            const isEndOfGroup = nextMessage
              ? nextMessage.userNickname !== message.userNickname
              : true;

            const returnVal = (
              <React.Fragment key={index}>
                {showDate && (
                  <div className={classes.date}>
                    <Typography className={classes.dateValue}>
                      <span>{message.timestamp.format('LL')}</span>
                    </Typography>
                  </div>
                )}
                <div
                  className={[
                    classes.message,
                    showDate && isStartOfGroup
                      ? 'classes.startOfGroupPadding'
                      : '',
                    !showDate && isStartOfGroup
                      ? `${classes.startOfGroupPadding} ${
                          classes.startOfGroupBorder
                        }`
                      : '',
                    isEndOfGroup && !isNextShowDate
                      ? classes.endOfGroupPadding
                      : '',
                  ].join(' ')}
                >
                  <Message
                    key={index}
                    message={message}
                    showTime={previousUserNickname !== message.userNickname}
                    renderVideos={settings.renderVideos}
                    renderGetYarn={settings.renderGetYarn}
                    renderImages={settings.renderImages}
                  />
                </div>
              </React.Fragment>
            );

            previousDate = message.timestamp.format('L');
            previousUserNickname = message.userNickname;

            return returnVal;
          })}
      </div>
    );
  }

  private handleScroll = (event: any) => {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      if (this.props.current) {
        this.props.setChannelScrollPosition(
          this.props.current.jid,
          event.target.scrollTop
        );
      }
    }, 100);
  };
}

const mapStateToProps = (states: IStates) => ({
  settings: states.gong.settings,
  current: states.gong.current,
});

const mapDispatchToProps = {
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
  },
  filler: {
    flexGrow: 1,
  },
  date: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  dateValue: {
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
