import React, { FC } from 'react';

import { makeStyles } from '@material-ui/styles';

import IChannel from '../../interfaces/IChannel';
import { IScrollData } from './../../utils/messagesUtils';

// TODO: This does not update on each change
// This is because scrollData is a useRef. Need to figure out how to force
// updates for just this component in Messages.tsx without updating the state.
// Certain values such as the position value will be a bit more tricky to handle
// as the Message.tsx component relies on a prev state value. This value will be
// lost when trying to set the position value that to update this component.
//

interface IProps {
  scrollData: IScrollData;
  channel: IChannel | undefined;
}

const MessageDebug: FC<IProps> = ({ scrollData, channel }) => {
  const classes = useStyles();
  const {
    numberOfMessages,
    numberOfLoadedMessages,
    isMessagesLoaded,
    scrollTo,
    hasScrolledOnLoad,
    hasScrolledOnNewChannel,
    userHasScrolled,
    isProgrammaticallyScrolling,
    wasAtBottom,
    position,
    positionBeforeLogs,
    prevWindowInnerWidth,
  } = scrollData;

  return (
    <div className={classes.root}>
      <table>
        <tbody>
          <tr>
            <td>
              {numberOfLoadedMessages.toLocaleString()}/
              {numberOfMessages.toLocaleString()} messages loaded
            </td>
            <td></td>
          </tr>
          <tr>
            <td>isMessagesLoaded</td>
            <td>{isMessagesLoaded.toString()}</td>
          </tr>
          <tr>
            <td>scrollTo</td>
            <td>{scrollTo}</td>
          </tr>
          <tr>
            <td>isProgrammaticallyScrolling</td>
            <td>{isProgrammaticallyScrolling.toString()}</td>
          </tr>
          <tr>
            <td>position</td>
            <td>{position && position.toLocaleString()}</td>
          </tr>
          <tr>
            <td>positionBeforeLogs</td>
            <td>{positionBeforeLogs.toLocaleString()}</td>
          </tr>
          <tr>
            <td>wasAtBottom</td>
            <td>{wasAtBottom.toString()}</td>
          </tr>
          <tr>
            <td>userHasScrolled</td>
            <td>{userHasScrolled.toString()}</td>
          </tr>
          <tr>
            <td>hasScrolledOnLoad</td>
            <td>{hasScrolledOnLoad.toString()}</td>
          </tr>
          <tr>
            <td>hasScrolledOnNewChannel</td>
            <td>{hasScrolledOnNewChannel.toString()}</td>
          </tr>
          <tr>
            <td>prevWindowInnerWidth</td>
            <td>{prevWindowInnerWidth.toLocaleString()}</td>
          </tr>
          <tr>
            <td>channel.scrollPosition</td>
            <td>{channel?.scrollPosition.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: theme.spacing(),
    color: 'white',
    top: 0,
    right: 0,
    zIndex: 1,
    '& td': {
      padding: theme.spacing(0, 1),
    },
    '& tr td:last-child': {
      textAlign: 'right',
    },
  },
}));

export default MessageDebug;
