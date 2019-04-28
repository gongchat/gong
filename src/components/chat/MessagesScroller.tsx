import React from 'react';
import { useContext } from '../../context';

import { makeStyles } from '@material-ui/styles';

import IRoom from '../../interfaces/IRoom';
import { usePrevious } from '../../utils/usePrevious';

let wasAtBottom = true;
let scrollTimer: any;
let positionBeforeGettingLogs: any;
let prevWindowInnerWidth: any;

interface IProps {
  ref: any;
  children: any;
}

const MessagesScroller: React.FC<IProps> = React.forwardRef(
  (props: IProps, ref: any) => {
    const classes = useStyles();
    const [context, actions] = useContext();

    const { children } = props;
    const { profile, current } = context;
    const { getChannelLogs, setChannelScrollPosition } = actions;

    const prevChannel = usePrevious(current);

    const root = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      handleOnMediaLoad() {
        if (wasAtBottom && root.current) {
          root.current.scrollTop =
            root.current.scrollHeight + root.current.offsetHeight;
        }
      },
    }));

    React.useEffect(() => {
      const rootCurrent = root.current;

      const isUpdateForLoggedMessages = () => {
        return (
          prevChannel &&
          current &&
          prevChannel.jid === current.jid &&
          prevChannel.messages.length > 0 &&
          current.messages.length > 0 &&
          prevChannel.messages[0].timestamp.diff(
            current.messages[0].timestamp
          ) > 0
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
            current.messages[current.messages.length - 1].from ===
              profile.jid) ||
            (current.type === 'groupchat' &&
              current.messages[current.messages.length - 1].userNickname ===
                (current as IRoom).myNickname))
        );
      };

      const shouldUpdateToSavedPosition = () => {
        return (
          current &&
          current.scrollPosition !== -1 &&
          (!prevChannel || (prevChannel && current.jid !== prevChannel.jid))
        );
      };

      const canRequestLogsOnLoad = () => {
        return (
          current &&
          !current.hasNoMoreLogs &&
          !current.isRequestingLogs &&
          rootCurrent &&
          rootCurrent.scrollTop === 0 &&
          (!prevChannel || (prevChannel && current.jid !== prevChannel.jid))
        );
      };

      const canRequestLogsOnScroll = () => {
        return (
          current &&
          !current.hasNoMoreLogs &&
          !current.isRequestingLogs &&
          rootCurrent &&
          rootCurrent.scrollTop === 0
        );
      };

      // Handle initial scroll position
      if (rootCurrent) {
        if (isUpdateForLoggedMessages()) {
          rootCurrent.scrollTop =
            rootCurrent.scrollHeight - positionBeforeGettingLogs;
        } else if (shouldUpdateToSavedPosition() && current) {
          rootCurrent.scrollTop = current.scrollPosition;
        } else if (wasAtBottom || isLastMessageMe()) {
          rootCurrent.scrollTop =
            rootCurrent.scrollHeight + rootCurrent.offsetHeight;
        }
      }

      // Check for logged messages
      if (canRequestLogsOnLoad()) {
        getChannelLogs(current);
        if (rootCurrent) {
          positionBeforeGettingLogs = rootCurrent.scrollHeight;
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
          if (canRequestLogsOnScroll()) {
            positionBeforeGettingLogs = event.target.scrollHeight;
            getChannelLogs(current);
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
  }
);

const useStyles = makeStyles((theme: any) => ({
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
}));

export default MessagesScroller;
