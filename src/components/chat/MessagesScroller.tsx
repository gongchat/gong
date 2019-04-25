import * as React from 'react';
import { useContext } from 'src/context';

import { usePrevious } from 'src/utils/usePrevious';

// material ui
import { makeStyles } from '@material-ui/styles';

// TODO: Check for logged messages on window resize

/*
  Scroll Specs:
  1. If scroll is at bottom, stay at the bottom.
  2. If scroll is not at the bottom, keep it where it is.
      - When a new channel is selected.
      - When new messages are received.
  3. If scroll reaches the top, get archived messages
  4. When selecting a channel scroll so the first new message is at the top
*/

let wasAtBottom = true;
let scrollTimer: any;
let positionBeforeGettingLogs: any;

const MessagesScroller = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();
  console.log('RE-RENDERING ', context);

  const prevChannel = usePrevious(context.current);

  const root = React.useRef<HTMLDivElement>(null);

  const isUpdateForLoggedMessages = () => {
    return (
      prevChannel &&
      context.current &&
      prevChannel.jid === context.current.jid &&
      prevChannel.messages.length > 0 &&
      context.current.messages.length > 0 &&
      prevChannel.messages[0].timestamp.diff(
        context.current.messages[0].timestamp
      ) > 0
    );
  };

  const isLastMessageMe = () => {
    return (
      prevChannel &&
      context.current &&
      prevChannel.jid === context.current.jid &&
      context.current.messages.length > 0 &&
      prevChannel.messages.length !== context.current.messages.length &&
      ((context.current.type === 'chat' &&
        context.current.messages[context.current.messages.length - 1].from ===
          context.profile.jid) ||
        (context.current.type === 'groupchat' &&
          context.current.messages[context.current.messages.length - 1]
            .nickname === context.current.nickname))
    );
  };

  const shouldUpdateToSavedPosition = () => {
    return (
      (context.current && !prevChannel) ||
      (context.current &&
        prevChannel &&
        context.current.scrollPosition !== -1 &&
        context.current.jid !== prevChannel.jid)
    );
  };

  const handleInitialPosition = () => {
    if (root.current) {
      if (isUpdateForLoggedMessages()) {
        root.current.scrollTop =
          root.current.scrollHeight - positionBeforeGettingLogs;
        console.log('update for logged messages ', root.current.scrollTop);
      } else if (shouldUpdateToSavedPosition()) {
        root.current.scrollTop = context.current.scrollPosition;
        console.log(
          'update for previous scroll position ',
          root.current.scrollTop
        );
      } else if (wasAtBottom) {
        root.current.scrollTop =
          root.current.scrollHeight + root.current.offsetHeight;
        console.log(
          'update was at bottom, staying at bottom ',
          root.current.scrollTop
        );
      } else if (isLastMessageMe()) {
        root.current.scrollTop =
          root.current.scrollHeight + root.current.offsetHeight;
        console.log('update for last message as me ', root.current.scrollTop);
      }
    }
  };

  const canRequestLoggedMessage = () => {
    return (
      context.current &&
      !context.current.hasNoMoreLogs &&
      !context.current.isRequestingLogs &&
      root.current &&
      root.current.scrollTop === 0
    );
  };

  const getLoggedMessages = () => {
    if (canRequestLoggedMessage()) {
      console.log('getting logged messages from component load');
      actions.getChannelLogs(context.current);
      if (root.current) {
        positionBeforeGettingLogs = root.current.scrollHeight;
      }
    }
  };

  React.useEffect(() => {
    handleInitialPosition();
    getLoggedMessages();

    const handleScroll = (event: any) => {
      // record if at bottom
      if (
        event.target.scrollTop + event.target.offsetHeight >=
        event.target.scrollHeight - 5
      ) {
        wasAtBottom = true;
      } else {
        wasAtBottom = false;
      }

      // update channels saved scroll position
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        // get logged message if at top
        if (canRequestLoggedMessage()) {
          console.log(
            'getting logged messages from scroll ',
            context.current,
            prevChannel
          );
          positionBeforeGettingLogs = event.target.scrollHeight;
          actions.getChannelLogs(context.current);
        }

        // Saves the scroll position for when the channel is selected again
        if (context.current) {
          console.log('saving scroll position to ', event.target.scrollTop);
          actions.setChannelScrollPosition(
            context.current.jid,
            event.target.scrollTop
          );
        }
      }, 100);
    };

    if (root.current) {
      root.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (root.current) {
        clearTimeout(scrollTimer);
        console.log('removing scroll listener');
        root.current.removeEventListener('scroll', handleScroll);
        console.log('listener removed');
      }
    };
  }, [context.current]);

  return (
    <div className={classes.root} ref={root}>
      {/* this is here so the messages start below first */}
      <div className={classes.filler} />
      {props.children}
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
}));

export default MessagesScroller;
