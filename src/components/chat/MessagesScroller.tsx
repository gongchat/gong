import React from 'react';
import { useContext } from '../../context';

import { makeStyles } from '@material-ui/styles';

import { usePrevious } from '../../utils/usePrevious';

let wasAtBottom = true;
let scrollTimer: any;
let positionBeforeGettingLogs: any;
let prevWindowInnerWidth: any;

interface IProps {
  children: any;
}

const MessagesScroller: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const { children } = props;
  const { profile, current } = context;
  const { getChannelLogs, setChannelScrollPosition } = actions;

  const prevChannel = usePrevious(current);

  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const rootCurrent = root.current;

    const isUpdateForLoggedMessages = () => {
      return (
        prevChannel &&
        current &&
        prevChannel.jid === current.jid &&
        prevChannel.messages.length > 0 &&
        current.messages.length > 0 &&
        prevChannel.messages[0].timestamp.diff(current.messages[0].timestamp) >
          0
      );
    };

    const isLastMessageMe = () => {
      return (
        prevChannel &&
        current &&
        prevChannel.jid === current.jid &&
        current.messages.length > 0 &&
        prevChannel.messages.length !== current.messages.length &&
        ((current.type === 'chat' &&
          current.messages[current.messages.length - 1].from === profile.jid) ||
          (current.type === 'groupchat' &&
            current.messages[current.messages.length - 1].nickname ===
              current.nickname))
      );
    };

    const shouldUpdateToSavedPosition = () => {
      return (
        (current && !prevChannel) ||
        (current &&
          prevChannel &&
          current.scrollPosition !== -1 &&
          current.jid !== prevChannel.jid)
      );
    };

    const canRequestLoggedMessage = () => {
      return (
        current &&
        !current.hasNoMoreLogs &&
        !current.isRequestingLogs &&
        root.current &&
        root.current.scrollTop === 0
      );
    };

    // Handle initial scroll position
    if (root.current) {
      if (isUpdateForLoggedMessages()) {
        root.current.scrollTop =
          root.current.scrollHeight - positionBeforeGettingLogs;
      } else if (shouldUpdateToSavedPosition()) {
        root.current.scrollTop = current.scrollPosition;
      } else if (wasAtBottom || isLastMessageMe()) {
        root.current.scrollTop =
          root.current.scrollHeight + root.current.offsetHeight;
      }
    }

    // Check for logged messages
    if (canRequestLoggedMessage()) {
      getChannelLogs(current);
      if (root.current) {
        positionBeforeGettingLogs = root.current.scrollHeight;
      }
    }

    // Event listener functions
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
          positionBeforeGettingLogs = event.target.scrollHeight;
          getChannelLogs(current);
        }

        // Saves the scroll position for when the channel is selected again
        if (current) {
          setChannelScrollPosition(current.jid, event.target.scrollTop);
        }
      }, 100);
    };

    const handleResizeWidth = (event: any) => {
      if (window.innerWidth !== prevWindowInnerWidth) {
        handleScroll(event);
      }
      prevWindowInnerWidth = window.innerWidth;
    };

    if (root.current) {
      root.current.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResizeWidth);
    }
    return () => {
      clearTimeout(scrollTimer);
      if (rootCurrent) {
        rootCurrent.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResizeWidth);
    };
  }, [
    current,
    getChannelLogs,
    prevChannel,
    profile.jid,
    setChannelScrollPosition,
  ]);

  return (
    <div className={classes.root} ref={root}>
      {/* this is here so the messages start below first */}
      <div className={classes.filler} />
      {children}
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
