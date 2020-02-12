import IChannel from './../interfaces/IChannel';

export interface IScrollData {
  numberOfMessages: number;
  numberOfLoadedMessages: number;
  isMessagesLoaded: boolean;
  scrollTo: 'bottom' | 'new-message-marker' | 'saved' | 'before-logs' | '';
  hasScrolledOnLoad: boolean;
  hasScrolledOnNewChannel: boolean;
  userHasScrolled: boolean;
  isProgrammaticallyScrolling: boolean;
  wasAtBottom: boolean;
  position: number;
  positionBeforeLogs: number;
  prevWindowInnerWidth: number;
}

export const scrollIt = (
  scrollData: IScrollData,
  element: HTMLDivElement | null,
  newMessageMarker: HTMLDivElement | null,
  channel: IChannel | undefined
) => {
  if (
    element &&
    channel &&
    scrollData.scrollTo
    // new-message-marker and saved should only be scrolled to once
    // (!scrollData.hasScrolledOnNewChannel ||
    //   scrollData.scrollTo === 'bottom' ||
    //   scrollData.scrollTo === 'before-logs'
    //   )
  ) {
    scrollData.isProgrammaticallyScrolling = true;
    switch (scrollData.scrollTo) {
      case 'before-logs':
        scrollToBeforeLogs(element, scrollData.positionBeforeLogs);
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
  if (positionBeforeGettingLogs === 0) {
    element.scrollTop = element.scrollHeight;
  } else {
    element.scrollTop = element.scrollHeight - positionBeforeGettingLogs + 1;
  }
};

const scrollToBottom = (element: HTMLDivElement) => {
  element.scrollTop = element.scrollHeight;
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
  newMessageMarker: HTMLDivElement | null,
  scrollData: IScrollData
): 'bottom' | 'new-message-marker' | 'before-logs' | 'saved' | '' => {
  if (current && element) {
    if (
      shouldScrollToNewMessageMarker(prevCurrent, current, newMessageMarker)
    ) {
      return 'new-message-marker';
    }
    if (shouldScrollToBeforeLogs(prevCurrent, current)) {
      return 'before-logs';
    }
    if (shouldScrollToSaved(prevCurrent, current)) {
      return 'saved';
    }
    if (
      shouldScrollToBottom(
        prevCurrent,
        current,
        element,
        scrollData.wasAtBottom
      )
    ) {
      return 'bottom';
    }
  }
  return '';
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
  element: HTMLDivElement,
  wasAtBottom: boolean
) => {
  if (!prevCurrent || wasAtBottom) {
    return true;
  }

  const isUpdateForCurrentChannel = updateIsForCurrentChannel(
    prevCurrent,
    current
  );
  const isUpdateForNewMessages = updateIsForNewMessages(prevCurrent, current);

  // if new channel and gotten this far (last check) then go to bottom
  if (!isUpdateForCurrentChannel) {
    return true;
  }

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
    (isAtBottom(element) || wasAtBottom)
  ) {
    return true;
  }

  return false;
};

// NEW MESSAGE MARKER
const shouldScrollToNewMessageMarker = (
  prevCurrent: IChannel,
  current: IChannel,
  newMessageMarker: HTMLDivElement | null
) => {
  if (!updateIsForCurrentChannel(prevCurrent, current) && newMessageMarker) {
    return true;
  }
  return false;
};

// SAVED
const shouldScrollToSaved = (prevCurrent: IChannel, current: IChannel) => {
  if (
    current &&
    current.scrollPosition !== -1 &&
    !updateIsForCurrentChannel(prevCurrent, current)
  ) {
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
  return prevCurrent && current && prevCurrent.jid === current.jid;
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
