import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import { useContext } from '../../context';

import { makeStyles } from '@material-ui/styles';

import IRoom from '../../interfaces/IRoom';
import { TRIM_AT } from '../../actions/channel';
import { usePrevious } from '../../utils/usePrevious';

let scrollTimer: any;
let prevWindowInnerWidth: any;
let positionBeforeGettingLogs: any;

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

    // Scroll position is updated when messages are loaded from Message.tsx
    // component. This component uses the status variable to determine what
    // value the scroll position should be updated to.
    //
    // Possible values for status:
    // - initial (do nothing)
    // - scrolled (do nothing)
    // - bottom (scroll to bottom)
    // - new-message-marker (scroll to the new message marker)
    // - saved-position (scroll to the saved position for the channel)
    // - previous-position (scroll to the position before receiving logs)
    const [status, setStatus] = useState('initial');

    const prevCurrent = usePrevious(current);
    const root = useRef<HTMLDivElement>(null);

    const handleScrollUpdate = () => {
      if (root.current && current) {
        const shouldUpdateForLoggedMessages =
          prevCurrent &&
          prevCurrent.jid === current.jid &&
          prevCurrent.messages.length > 0 &&
          current.messages.length > 0 &&
          prevCurrent.messages[0].timestamp.diff(
            current.messages[0].timestamp
          ) > 0;
        const shouldUpdateToNewMessageMarker = newMessageMarkerRef.current;
        const shouldScrollToBottom =
          prevCurrent &&
          prevCurrent.jid === current.jid &&
          current.messages.length > 0 &&
          prevCurrent.messages.length !== current.messages.length &&
          ((current.type === 'chat' &&
            current.messages[current.messages.length - 1].from ===
              profile.jid) ||
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
      }
    };

    useImperativeHandle(ref, () => ({
      handleOnMessageLoad() {
        handleScrollUpdate();
      },
      handleOnMediaLoad() {
        handleScrollUpdate();
      },
    }));

    useEffect(() => {
      const shouldRequestLogsOnLoad =
        root.current &&
        root.current.scrollTop === 0 &&
        current &&
        !current.hasNoMoreLogs &&
        !current.isRequestingLogs &&
        (!prevCurrent || (current && current.jid !== prevCurrent.jid));

      const shouldTrimMessagesOnLoad =
        current &&
        current.messages.length >= TRIM_AT &&
        root.current &&
        root.current.scrollTop + root.current.offsetHeight >=
          root.current.scrollHeight - 5;

      // Check for logged messages
      if (shouldRequestLogsOnLoad) {
        setStatus('previous-position');
        getChannelLogs(current);
        if (root.current) {
          positionBeforeGettingLogs = root.current.scrollHeight;
        }
      } else if (shouldTrimMessagesOnLoad && current) {
        // Check for trimmed messages
        setStatus('bottom');
        trimOldMessages(current.jid);
      }
    }, [
      current,
      prevCurrent,
      getChannelLogs,
      trimOldMessages,
      setChannelScrollPosition,
    ]);

    useEffect(() => {
      const rootCurrent = root.current;

      // Event listener functions
      const handleScroll = (event: any) => {
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
            setStatus('previous-position');
          }

          // Saves the scroll position for when the channel is selected again
          if (current) {
            // TODO: this is being triggered when channel is changed and picking up the new channels values but saving to the old channel
            console.log('saving ', current.jid, ' to ', event.target.scrollTop);
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
      prevCurrent,
      newMessageMarkerRef,
      getChannelLogs,
      trimOldMessages,
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
    position: 'relative',
  },
  filler: {
    flexGrow: 1,
  },
}));

export default MessagesScroller;
