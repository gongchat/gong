import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { removeChannel, selectChannel } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import EditRoom from './EditRoom';

class Channel extends React.Component<any, any> {
  public state = {
    anchorEl: null,
    isEditOpen: false,
  };

  public render() {
    const { classes, channel, isSelected, prefix } = this.props;
    const { anchorEl, isEditOpen } = this.state;

    const name =
      channel.name.startsWith('#') && channel.name.length > 1
        ? channel.name.substring(1)
        : channel.name;

    return (
      <React.Fragment>
        <div
          className={[
            classes.root,
            channel.isConnected || channel.type === 'chat'
              ? classes.connected
              : classes.notConnected,
            isSelected ? classes.active : '',
          ].join(' ')}
          onClick={this.handleOnClick}
        >
          <div
            className={classes.content}
            onContextMenu={this.handleOnContextMenu}
          >
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
        <Menu
          id="context-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleContextMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={this.handleOnClickEdit}>Edit</MenuItem>
        </Menu>
        <Dialog
          open={isEditOpen}
          onClose={this.handleEditClose}
          className={classes.dialog}
          BackdropProps={{ className: classes.dialog }}
          aria-labelledby="room-edit-dialog-title"
        >
          <EditRoom onClose={this.handleEditClose} channel={channel} />
        </Dialog>
      </React.Fragment>
    );
  }

  private handleOnClick = () => {
    this.props.selectChannel(this.props.channel.jid);
  };

  private handleOnContextMenu = (event: any) => {
    event.preventDefault();
    this.setState({
      anchorEl: this.state.anchorEl ? null : event.currentTarget,
    });
  };

  private handleContextMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  private handleOnClickEdit = (event: any) => {
    event.preventDefault();
    this.setState({ anchorEl: null, isEditOpen: true });
  };

  private handleEditClose = () => {
    this.setState({ isEditOpen: false });
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
  dialog: {
    top: '23px',
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
