import React, { FC, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';

import IChannel from '../../interfaces/IChannel';

interface IProps {
  isLoaded: boolean;
  isMessagesLoaded: boolean;
  numberOfMessages: number;
  numberOfLoadedMessages: number;
  scrollTo: string;
  scrolledOnNewChannel: boolean;
  position: number;
  positionBeforeLogs: number;
  prevWindowInnerWidth: number;
  current: IChannel | undefined;
}

const MessageDebug: FC<IProps> = ({
  isLoaded,
  isMessagesLoaded,
  numberOfMessages,
  numberOfLoadedMessages,
  scrollTo,
  scrolledOnNewChannel,
  position,
  positionBeforeLogs,
  prevWindowInnerWidth,
  current,
}) => {
  const classes = useStyles();

  useEffect(() => {
    console.info('isLoaded', isLoaded);
    console.info('isMessagesLoaded', isMessagesLoaded);
    console.info('numberOfMessages', numberOfMessages);
    console.info('numberOfLoadedMessages', numberOfLoadedMessages);
    console.info('scrollTo', scrollTo);
    console.info('scrolledOnNewChannel', scrolledOnNewChannel);
    console.info('position', position);
    console.info('positionBeforeLogs', positionBeforeLogs);
    console.info('prevWindowInnerWidth', prevWindowInnerWidth);
    console.info('current', current);
  }, [
    isLoaded,
    isMessagesLoaded,
    numberOfMessages,
    numberOfLoadedMessages,
    scrollTo,
    scrolledOnNewChannel,
    position,
    positionBeforeLogs,
    prevWindowInnerWidth,
    current,
  ]);

  return (
    <div className={classes.root}>
      <table>
        <tbody>
          <tr>
            <td>isLoaded</td>
            <td>{isLoaded.toString()}</td>
          </tr>
          <tr>
            <td>isMessagesLoaded</td>
            <td>{isMessagesLoaded.toString()}</td>
          </tr>
          <tr>
            <td>numberOfMessages</td>
            <td>{numberOfMessages.toLocaleString()}</td>
          </tr>
          <tr>
            <td>numberOfLoadedMessages</td>
            <td>{numberOfLoadedMessages.toLocaleString()}</td>
          </tr>
          <tr>
            <td>scrollTo</td>
            <td>{scrollTo}</td>
          </tr>
          <tr>
            <td>scrolledOnNewChannel</td>
            <td>{scrolledOnNewChannel.toString()}</td>
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
            <td>prevWindowInnerWidth</td>
            <td>{prevWindowInnerWidth.toLocaleString()}</td>
          </tr>
          <tr>
            <td>current.scrollPosition</td>
            <td>{current?.scrollPosition.toLocaleString()}</td>
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
