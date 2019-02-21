import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setMyStatus } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

// components
import Status from './Status';

const STATUSES = [
  { value: 'online', title: 'Online' },
  { value: 'chat', title: 'Chatty' },
  { value: 'away', title: 'Away' },
  { value: 'xa', title: 'Extended Away' },
  {
    value: 'dnd',
    title: 'Do not Disturb',
    description: 'Will mute sounds',
  },
];

class StatusMenu extends React.Component<any, any> {
  public render() {
    const { classes, open } = this.props;

    return (
      <Popover
        open={open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.root}>
          {STATUSES.map((status: any, index: number) => (
            <div
              key={index}
              onClick={() => this.handleStatusClick(status.value)}
              className={classes.item}
            >
              <div className={classes.rowOne}>
                <div className={classes.status}>
                  <Status status={status.value} />
                </div>
                <Typography className={classes.title}>
                  {status.title}
                </Typography>
              </div>
              {status.description && (
                <Typography className={classes.description} variant="caption">
                  <small>{status.description}</small>
                </Typography>
              )}
            </div>
          ))}
        </div>
      </Popover>
    );
  }

  private handleStatusClick = (status: string) => {
    this.props.setMyStatus(status);
    this.props.onClose();
  };
}

const mapDispatchToProps = {
  setMyStatus,
};

const styles: any = (theme: any) => ({
  root: {
    width: `calc(${theme.sidebarWidth} - ${theme.spacing.unit * 4}px)`,
  },
  item: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
  rowOne: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  status: {
    width: theme.spacing.unit * 4,
  },
  title: {
    // marginLeft: theme.spacing.unit,
  },
  description: {
    marginLeft: theme.spacing.unit * 4,
    opacity: 0.7,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    paddingTop: 0,
  },
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(StatusMenu));
