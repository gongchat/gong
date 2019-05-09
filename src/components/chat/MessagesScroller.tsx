import React, {
  FC,
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { useContext } from '../../context';

import { makeStyles } from '@material-ui/styles';

import IRoom from '../../interfaces/IRoom';
import { TRIM_AT } from '../../actions/channel';
import { usePrevious } from '../../utils/usePrevious';

let wasAtBottom = true;
let wasAtNewMessageMarker = false;
let scrollTimer: any;
let positionBeforeGettingLogs: any;
let prevWindowInnerWidth: any;

interface IProps {
  ref: any;
  newMessageMarkerRef: any;
  children: any;
}

const MessagesScroller: FC<IProps> = forwardRef(
  ({ children, newMessageMarkerRef }: IProps, ref: any) => {
    const classes = useStyles();
    const [
      { profile, current },
      { getChannelLogs, setChannelScrollPosition, trimOldMessages },
    ] = useContext();
    const prevChannel = usePrevious(current);
    const root = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      handleOnMessageLoad() {
        if (
          root.current &&
          (!prevChannel || (current && current.jid !== prevChannel.jid))
        ) {
          if (wasAtBottom) {
            root.current.scrollTop =
              root.current.scrollHeight + root.current.offsetHeight;
          } else if (wasAtNewMessageMarker && newMessageMarkerRef.current) {
            root.current.scrollTop = newMessageMarkerRef.current.offsetTop;
          }
        }
      },
    }));

    useEffect(() => {
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

      const shouldUpdateToNewMessageMarker = () => {
        return (
          current &&
          newMessageMarkerRef.current &&
          (!prevChannel || (prevChannel && current.jid !== prevChannel.jid))
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

      const canTrimMessagesOnLoad = () => {
        return (
          current &&
          current.messages.length >= TRIM_AT &&
          rootCurrent &&
          rootCurrent.scrollTop + rootCurrent.offsetHeight >=
            rootCurrent.scrollHeight - 5
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

      // Reset stuff if new channel
      if (!prevChannel || (current && current.jid !== prevChannel)) {
        wasAtBottom = true;
        wasAtNewMessageMarker = false;
      }

      // Handle initial scroll position
      if (rootCurrent) {
        if (isUpdateForLoggedMessages()) {
          wasAtNewMessageMarker = false;
          wasAtBottom = false;
          rootCurrent.scrollTop =
            rootCurrent.scrollHeight - positionBeforeGettingLogs;
        } else if (shouldUpdateToNewMessageMarker()) {
          wasAtNewMessageMarker = true;
          wasAtBottom = false;
          rootCurrent.scrollTop = newMessageMarkerRef.current.offsetTop;
        } else if (shouldUpdateToSavedPosition() && current) {
          wasAtNewMessageMarker = false;
          wasAtBottom = false;
          rootCurrent.scrollTop = current.scrollPosition;
        } else if (wasAtBottom || isLastMessageMe()) {
          wasAtNewMessageMarker = false;
          wasAtBottom = true;
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

      // Check for timmed messages
      if (current && canTrimMessagesOnLoad()) {
        trimOldMessages(current.jid);
      }

      // Event listener functions
      const handleScroll = (event: any) => {
        // record if at bottom
        if (
          !prevChannel ||
          (current && current.hasNoMoreLogs === prevChannel.hasNoMoreLogs)
        ) {
          if (
            event.target.scrollTop + event.target.offsetHeight >=
            event.target.scrollHeight - 5
          ) {
            wasAtBottom = true;
            if (current && current.messages.length >= TRIM_AT) {
              trimOldMessages(current.jid);
            }
          } else {
            wasAtBottom = false;
          }
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
      newMessageMarkerRef,
      prevChannel,
      profile.jid,
      setChannelScrollPosition,
      trimOldMessages,
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
    position: 'relative',
  },
  filler: {
    flexGrow: 1,
  },
}));

export default MessagesScroller;
