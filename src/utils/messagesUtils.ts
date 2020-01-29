import IChannel from './../interfaces/IChannel';
import { TRIM_AT } from './../actions/channel';

export const shouldGetLoggedMessagesOnLoad = (
  hasScrolledOnNewChannel: boolean,
  prevCurrent: IChannel | undefined,
  current: IChannel | undefined,
  element: HTMLDivElement | null
) => {
  console.log('foo', hasScrolledOnNewChannel, prevCurrent, current, element);
  if (
    hasScrolledOnNewChannel &&
    element &&
    element.scrollTop === 0 &&
    current &&
    !current.hasNoMoreLogs
  ) {
    console.log('bar');
    return true;
  }
  return false;
};

export const shouldTrimMessagesOnLoad = (
  prevCurrent: IChannel,
  current: IChannel,
  element: HTMLDivElement,
  hasScrolledOnNewChannel: boolean
) => {
  if (
    hasScrolledOnNewChannel &&
    element &&
    current.messages.length >= TRIM_AT &&
    isAtBottom(element)
  ) {
    return true;
  }
  return false;
};

export const scrollIt = (
  to: 'bottom' | 'new-message-marker' | 'before-logs' | 'saved',
  element: HTMLDivElement | null,
  newMessageMarker: HTMLDivElement | null,
  channel: IChannel | undefined,
  scrollPositionBeforeLogs: number
) => {
  if (element && channel) {
    switch (to) {
      case 'before-logs':
        scrollToBeforeLogs(element, scrollPositionBeforeLogs);
        break;
      case 'bottom':
        scrollToBottom(element);
        break;
      case 'new-message-marker':
        scrollToNewMessageMarker(element, newMessageMarker);
        break;
      case 'saved':
        scrollToSaved(element, channel);
        break;
      default:
        scrollToBottom(element);
        break;
    }
  }
};

const scrollToBeforeLogs = (
  element: HTMLDivElement,
  positionBeforeGettingLogs: number
) => {
  element.scrollTop = element.scrollHeight - positionBeforeGettingLogs;
};

const scrollToBottom = (element: HTMLDivElement) => {
  element.scrollTop = element.scrollHeight + element.offsetHeight;
};

const scrollToNewMessageMarker = (
  element: HTMLDivElement,
  newMessageMarker: HTMLDivElement | null
) => {
  if (newMessageMarker) {
    element.scrollTop = newMessageMarker.offsetTop;
  }
};

const scrollToSaved = (element: HTMLDivElement, current: IChannel) => {
  element.scrollTop = current.scrollPosition;
};

export const shouldScrollTo = (
  prevCurrent: IChannel,
  current: IChannel | undefined,
  element: HTMLDivElement | null,
  newMessageMarker: HTMLDivElement | null
): 'bottom' | 'new-message-marker' | 'before-logs' | 'saved' => {
  if (current && element) {
    if (shouldScrollToBottom(prevCurrent, current, element)) {
      return 'bottom';
    }
    if (shouldScrollToNewMessageMarker(newMessageMarker)) {
      return 'new-message-marker';
    }
    if (shouldScrollToBeforeLogs(prevCurrent, current)) {
      return 'before-logs';
    }
    if (shouldScrollToSaved(current)) {
      return 'saved';
    }
  }
  return 'bottom';
};

// BEFORE LOGS
const shouldScrollToBeforeLogs = (prevCurrent: IChannel, current: IChannel) => {
  // use messages from previous render to determine if messages from the current
  // render are from the logs
  return (
    updateIsForCurrentChannel(prevCurrent, current) &&
    updateIsForNewMessages(prevCurrent, current) &&
    // checks the oldest message timestamp to determine if the new messages
    // are from the logs
    prevCurrent &&
    current &&
    prevCurrent.messages[0] &&
    current.messages[0] &&
    prevCurrent.messages[0].timestamp.diff(current.messages[0].timestamp) > 0
  );
};

// BOTTOM
const shouldScrollToBottom = (
  prevCurrent: IChannel,
  current: IChannel,
  element: HTMLDivElement
) => {
  const isUpdateForCurrentChannel = updateIsForCurrentChannel(
    prevCurrent,
    current
  );
  const isUpdateForNewMessages = updateIsForNewMessages(prevCurrent, current);

  // checks if the latest message was from me
  if (
    isUpdateForCurrentChannel &&
    isUpdateForNewMessages &&
    current.messages.length > 0 &&
    current.messages[current.messages.length - 1].isMe
  ) {
    return true;
  }

  // checks if scroll was at bottom when a new message comes in
  if (
    isUpdateForCurrentChannel &&
    isUpdateForNewMessages &&
    isAtBottom(element)
  ) {
    return true;
  }

  return false;
};

// NEW MESSAGE MARKER
const shouldScrollToNewMessageMarker = (
  newMessageMarker: HTMLDivElement | null
) => {
  if (newMessageMarker) {
    return true;
  }
  return false;
};

// SAVED
const shouldScrollToSaved = (current: IChannel) => {
  if (current && current.scrollPosition !== -1) {
    return true;
  }
  return false;
};

/*
UTILS
*/

export const updateIsForCurrentChannel = (
  prevCurrent: IChannel | undefined,
  current: IChannel | undefined
) => {
  return !prevCurrent || (current && prevCurrent.jid === current.jid);
};

export const updateIsForNewMessages = (
  prevCurrent: IChannel | undefined,
  current: IChannel | undefined
) => {
  // check if update is from new messages. first checks if the lengths are
  // the same. since there is a max number of messages an additional check is
  // done to to see if the most recent message id matches.
  return (
    prevCurrent &&
    current &&
    (prevCurrent.messages.length !== current.messages.length ||
      (prevCurrent.messages.length > 0 &&
        current.messages.length > 0 &&
        prevCurrent.messages[prevCurrent.messages.length - 1].id !==
          current.messages[current.messages.length - 1].id))
  );
};

export const isAtBottom = (element: HTMLDivElement) => {
  return (
    element &&
    Math.ceil(element.scrollTop + element.offsetHeight) >=
      Math.floor(element.scrollHeight)
  );
};
