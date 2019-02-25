import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { selectChannel } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

// utils
import StringUtil from 'src/utils/stringUtils';

// components
import Status from './Status';
import UserDetail from './UserDetail';

class UserCard extends React.Component<any, any> {
  public state = {
    anchorEl: null,
    isDetailsOpen: false,
  };

  public render() {
    const { classes, user, isSelected, showAvatar } = this.props;
    const { anchorEl, isDetailsOpen } = this.state;

    const displayName =
      user.vCard && user.vCard.fullName ? user.vCard.fullName : user.username;

    return (
      <React.Fragment>
        <div
          className={[classes.root, isSelected ? classes.active : ''].join(' ')}
          onClick={this.handleOnClick}
          onContextMenu={this.handleOnContextMenu}
        >
          <div className={classes.avatar}>
            {showAvatar ? (
              <div>
                {user.vCard && user.vCard.photo ? (
                  <Avatar
                    className={classes.img}
                    src={`data:${user.vCard.photoType};base64,${
                      user.vCard.photo
                    }`}
                  />
                ) : (
                  <Avatar className={classes.img}>
                    <Typography>
                      {StringUtil.getAbbreviation(displayName)}
                    </Typography>
                  </Avatar>
                )}
                <div className={classes.status}>
                  <Status status={user.status} />
                </div>
              </div>
            ) : (
              <div className={classes.statusOnly}>
                <Status status={user.status} />
              </div>
            )}
          </div>
          <Typography className={classes.title}>{displayName}</Typography>
          {user.unreadMessages > 0 && (
            <Badge
              badgeContent={user.unreadMessages}
              classes={{ badge: classes.badge }}
              color="error"
            >
              <span />
            </Badge>
          )}
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
          <MenuItem onClick={this.handleOnClickDetail}>Details</MenuItem>
        </Menu>
        <Dialog
          open={isDetailsOpen}
          onClose={this.handleDetailClose}
          aria-labelledby="detail-dialog-title"
        >
          <UserDetail user={user} />
        </Dialog>
      </React.Fragment>
    );
  }

  private handleOnClick = () => {
    this.props.selectChannel(this.props.user.jid);
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

  private handleOnClickDetail = (event: any) => {
    event.preventDefault();
    this.setState({ anchorEl: null, isDetailsOpen: true });
  };

  private handleDetailClose = () => {
    this.setState({ isDetailsOpen: false });
  };
}

const mapDispatchToProps = {
  selectChannel,
};

const styles: any = (theme: any) => ({
  root: {
    padding: theme.spacing.unit,
    borderRadius: '5px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(125,125,125,.2)',
    },
  },
  title: {
    flexGrow: 1,
    width: '100px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    marginRight: '20px',
  },
  avatar: {
    position: 'relative',
  },
  img: {
    width: '30px',
    height: '30px',
    fontSize: '.8rem',
    marginRight: theme.spacing.unit,
  },
  status: {
    position: 'absolute',
    bottom: -5,
    right: 5,
    border: '2px solid ' + theme.palette.background.default,
    borderRadius: '50%',
  },
  statusOnly: {
    marginRight: theme.spacing.unit,
  },
  active: {
    background: 'rgba(125,125,125,.4)',
    '&:hover': {
      background: 'rgba(125,125,125,.4)',
    },
  },
  badge: {
    width: '20px',
    marginRight: '8px',
    borderRadius: '5px',
  },
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(UserCard));
