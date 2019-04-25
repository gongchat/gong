import React from 'react';

// material ui
import { makeStyles } from '@material-ui/styles';

// interfaces
import IChannel from '../../interfaces/IChannel';

// components
import Channel from './Channel';
import Group from './Group';

const Channels = (props: any) => {
  const classes = useStyles();

  if (props.hideIfEmpty && (!props.channels || props.channels.length <= 0)) {
    return <div />;
  }

  const totalUnreadMessages = props.channels.reduce(
    (a: number, b: IChannel) => a + b.unreadMessages,
    0
  );

  const hasUnreadMentionMe = props.channels.some(
    (channel: IChannel) => channel.hasUnreadMentionMe
  );

  return (
    <div className={classes.root}>
      <Group
        title={props.title}
        canAdd={props.canAdd}
        totalUnreadMessages={totalUnreadMessages}
        hasUnreadMentionMe={hasUnreadMentionMe}
      >
        {props.channels
          .sort((a: IChannel, b: IChannel) => a.name.localeCompare(b.name))
          .map((channel: IChannel) => (
            <Channel
              key={channel.jid}
              prefix={props.prefix}
              channel={channel}
              isSelected={props.current && props.current.jid === channel.jid}
            />
          ))}
      </Group>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: theme.spacing.unit,
  },
}));

export default Channels;
