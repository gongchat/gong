import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

// utils
import StringUtil from 'src/utils/stringUtils';

// components
import Status from './Status';
import StatusMenu from './StatusMenu';

class Me extends React.Component<any, any> {
  public state = {
    showStatusMenu: false,
  };

  private meRef = React.createRef<HTMLDivElement>();

  public render() {
    const { classes, profile } = this.props;
    const { showStatusMenu } = this.state;

    const displayName =
      profile.vCard && profile.vCard.fullName
        ? profile.vCard.fullName
        : profile.username;

    return (
      <div className={classes.root}>
        <div ref={this.meRef} className={classes.me}>
          <div className={classes.avatar} onClick={this.toggleStatusMenu}>
            {profile.vCard && profile.vCard.photoType ? (
              <Avatar
                className={classes.img}
                src={`data:${profile.vCard.photoType};base64,${
                  profile.vCard.photo
                }`}
              />
            ) : (
              <Avatar className={classes.img}>
                {StringUtil.getAbbreviation(displayName)}
              </Avatar>
            )}
            <div className={classes.status}>
              <Status status={profile.status} />
            </div>
          </div>
          <Typography className={classes.title}>{displayName}</Typography>
        </div>
        <StatusMenu
          anchorEl={this.meRef.current}
          open={showStatusMenu}
          onClose={this.handleCloseStatusMenu}
        />
      </div>
    );
  }

  private toggleStatusMenu = () => {
    this.setState({ showStatusMenu: !this.state.showStatusMenu });
  };

  private handleCloseStatusMenu = () => {
    this.setState({ showStatusMenu: false });
  };
}

const styles: any = (theme: any) => ({
  root: {
    position: 'relative',
  },
  me: {
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 1.5,
    borderRadius: '5px',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflowX: 'hidden',
  },
  title: {
    whiteSpace: 'nowrap',
  },
  avatar: {
    position: 'relative',
    cursor: 'pointer',
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
    border: '2px solid ' + theme.palette.backgroundAccent,
    borderRadius: '50%',
  },
});

export default withStyles(styles)(Me);
