import React from 'react';

import { makeStyles } from '@material-ui/styles';

import Channel from './Channel';
import Group from './Group';
import IChannel from '../../interfaces/IChannel';
import IRoom from '../../interfaces/IRoom';

interface IProps {
  channels: IChannel[];
  current: IChannel;
  hideIfEmpty: boolean;
  title: string;
  canAdd: boolean;
  prefix: string;
}

const Channels: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  const { channels, current, hideIfEmpty, title, canAdd, prefix } = props;

  if (hideIfEmpty && (!channels || channels.length <= 0)) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Group
        title={title}
        canAdd={canAdd}
        totalUnreadMessages={channels.reduce(
          (a: number, b: IChannel) => a + b.unreadMessages,
          0
        )}
        hasUnreadMentionMe={channels.some(
          (channel: IChannel) => channel.hasUnreadMentionMe
        )}
      >
        {channels
          .sort((a: IChannel, b: IChannel) => a.name.localeCompare(b.name))
          .map((channel: IChannel) => (
            <Channel
              key={channel.jid}
              prefix={prefix}
              channel={channel as IRoom}
              isSelected={current && current.jid === channel.jid}
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
