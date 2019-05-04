import React from 'react';
import { useContext } from '../../context';
import moment from 'moment';

import { makeStyles } from '@material-ui/styles';

import Channel from './Channel';
import Group from './Group';
import IChannel from '../../interfaces/IChannel';
import IRoom from '../../interfaces/IRoom';

interface IProps {
  channels: IChannel[];
  hideIfEmpty: boolean;
  title: string;
  canAdd: boolean;
  prefix: string;
}

const Channels: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const [context] = useContext();

  const { channels, hideIfEmpty, title, canAdd, prefix } = props;
  const { current, theme } = context;

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
        {theme.sortChannelsByMostRecentUnread &&
          channels
            .filter((channel: IChannel) => channel.unreadMessages > 0)
            .sort((a: IChannel, b: IChannel) =>
              moment
                .duration(
                  b.messages[b.messages.length - 1].timestamp.diff(
                    a.messages[a.messages.length - 1].timestamp
                  )
                )
                .asSeconds()
            )
            .map((channel: IChannel, index: number) => (
              <Channel
                key={index}
                prefix={prefix}
                channel={channel as IRoom}
                isSelected={current && current.jid === channel.jid}
              />
            ))}
        {theme.sortChannelsByMostRecentUnread &&
          channels
            .filter((channel: IChannel) => channel.unreadMessages === 0)
            .sort((a: IChannel, b: IChannel) => a.name.localeCompare(b.name))
            .map((channel: IChannel, index: number) => (
              <Channel
                key={index}
                prefix={prefix}
                channel={channel as IRoom}
                isSelected={current && current.jid === channel.jid}
              />
            ))}
        {!theme.sortChannelsByMostRecentUnread &&
          channels
            .sort((a: IChannel, b: IChannel) => a.name.localeCompare(b.name))
            .map((channel: IChannel, index: number) => (
              <Channel
                key={index}
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
