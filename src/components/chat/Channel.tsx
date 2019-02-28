import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { removeChannel, selectChannel } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

class Channel extends React.Component<any, any> {
  public render() {
    const { classes, channel, isSelected, prefix } = this.props;

    const name =
      channel.name.startsWith('#') && channel.name.length > 1
        ? channel.name.substring(1)
        : channel.name;

    return (
      <div
        className={[
          classes.root,
          channel.isConnected ? classes.connected : classes.notConnected,
          isSelected ? classes.active : '',
        ].join(' ')}
      >
        <div className={classes.content} onClick={this.handleOnClick}>
          <Typography
            className={classes.hashtag}
            color={channel.connectionError ? 'error' : 'default'}
          >
            {prefix}
          </Typography>
          <Typography className={classes.name}>{name}</Typography>
          {channel.unreadMessages > 0 && (
            <Badge
              badgeContent={channel.unreadMessages}
              classes={{
                badge: [
                  classes.badge,
                  channel.hasUnreadMentionMe ? classes.badgeFlash : '',
                ].join(' '),
              }}
              color="error"
            >
              <span />
            </Badge>
          )}
        </div>
        <Typography
          className={classes.close}
          onClick={() => this.props.removeChannel(channel.jid)}
        >
          <CloseIcon className={classes.closeIcon} />
        </Typography>
      </div>
    );
  }

  private handleOnClick = () => {
    this.props.selectChannel(this.props.channel.jid);
  };
}

const mapDispatchToProps = {
  selectChannel,
  removeChannel,
};

const styles: any = (theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    borderRadius: '5px',
    cursor: 'pointer',
    flexGrow: 1,
  },
  connected: {
    opacity: 1,
    '&:hover': {
      background: 'rgba(125,125,125,.2)',
    },
  },
  notConnected: {
    justifyContent: 'space-between',
    opacity: 0.4,
  },
  connectionError: {
    color: theme.palette.secondary.main,
  },
  content: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexGrow: 1,
  },
  name: {
    flexGrow: 1,
    // TODO: without the 1px width name doesn't overflow properly, not sure why
    width: '1px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    marginRight: '20px',
  },
  active: {
    background: 'rgba(125,125,125,.4)',
    '&:hover': {
      background: 'rgba(125,125,125,.4)',
    },
  },
  badge: {
    width: '20px',
    marginRight: '10px',
    borderRadius: '5px',
  },
  badgeFlash: {
    animation: 'flash 1s linear infinite',
  },
  hashtag: {
    opacity: 0.5,
    marginRight: theme.spacing.unit / 2,
    fontWeight: 'bold',
  },
  close: {
    cursor: 'pointer',
    opacity: 0.5,
    marginLeft: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      opacity: 1,
    },
  },
  closeIcon: {
    fontSize: '15px',
  },
  '@keyframes flash': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.1,
    },
    '100%': {
      opacity: 1,
    },
  },
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Channel));
