import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';

// interfaces
import IChannel from 'src/interfaces/IChannel';

// components
import Channel from './Channel';
import Group from './Group';

class Channels extends React.Component<any, any> {
  public render() {
    const {
      classes,
      title,
      channels,
      canAdd,
      hideIfEmpty,
      prefix,
    } = this.props;

    if (hideIfEmpty && (!channels || channels.length <= 0)) {
      return '';
    }

    const totalUnreadMessages = channels.reduce(
      (a: number, b: IChannel) => a + b.unreadMessages,
      0
    );

    const hasUnreadMentionMe = channels.some(
      (channel: IChannel) => channel.hasUnreadMentionMe
    );

    return (
      <div className={classes.root}>
        <Group
          title={title}
          canAdd={canAdd}
          totalUnreadMessages={totalUnreadMessages}
          hasUnreadMentionMe={hasUnreadMentionMe}
        >
          {channels
            .sort((a: IChannel, b: IChannel) => a.name.localeCompare(b.name))
            .map((channel: IChannel) => (
              <Channel
                key={channel.jid}
                prefix={prefix}
                channel={channel}
                isSelected={
                  this.props.current && this.props.current.jid === channel.jid
                }
              />
            ))}
        </Group>
      </div>
    );
  }
}

const styles: any = (theme: any) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)(Channels);
