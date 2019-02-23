import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { channelSelectUser } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

// utils
import StringUtil from 'src/utils/stringUtils';

class ChannelUser extends React.Component<any, any> {
  public render() {
    const { classes, user, showAvatar } = this.props;

    return (
      <div className={classes.root} onClick={this.handleOnClick}>
        {showAvatar && (
          <div className={classes.avatar}>
            <Avatar className={classes.img}>
              {StringUtil.getAbbreviation(user.nickname)}
            </Avatar>
          </div>
        )}
        <Typography className={classes.title} style={{ color: user.color }}>
          {user.nickname}
        </Typography>
      </div>
    );
  }

  private handleOnClick = () => {
    this.props.channelSelectUser(this.props.user);
  };
}

const mapDispatchToProps = {
  channelSelectUser,
};

const styles: any = (theme: any) => ({
  root: {
    padding: theme.spacing.unit,
    borderRadius: '5px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflowX: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(125,125,125,.2)',
    },
  },
  title: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
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
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ChannelUser));
