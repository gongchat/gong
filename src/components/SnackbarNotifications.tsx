import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeSnackbarNotification } from 'src/actions/dispatcher';

import { withStyles } from '@material-ui/core';

// libs
import { withSnackbar } from 'notistack';

// interfaces
import ISnackbarNotification from 'src/interfaces/ISnackbarNotification';
import IStates from 'src/interfaces/IStates';

class SnackbarNotifications extends React.Component<any, any> {
  private displayed: any[] = [];

  public shouldComponentUpdate(nextProps: any) {
    const { snackbarNotifications: currentSnackbarNotifications } = this.props;
    let notExists = false;
    if (nextProps.snackbarNotifications) {
      nextProps.snackbarNotifications.forEach(
        (notification: any, index: number) => {
          if (!notExists) {
            notExists =
              notExists ||
              !currentSnackbarNotifications.filter(
                ({ key }) => nextProps.snackbarNotifications[index].key === key
              ).length;
          }
        }
      );
    }
    return notExists;
  }

  public componentDidUpdate() {
    const { snackbarNotifications, classes } = this.props;

    if (snackbarNotifications) {
      snackbarNotifications.forEach((notification: ISnackbarNotification) => {
        if (
          !this.displayed.find(
            (e: ISnackbarNotification) => e.id === notification.id
          )
        ) {
          this.props.enqueueSnackbar(notification.message, {
            variant: notification.variant,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            className: classes.notification,
          });
          this.storeDisplayed(notification.id);
          this.props.removeSnackbarNotification(notification.id);
        }
      });
    }
  }

  public render() {
    return null;
  }

  private storeDisplayed = (id: string) => {
    this.displayed = [...this.displayed, id];
  };
}

const mapStateToProps = (states: IStates) => ({
  snackbarNotifications: states.gong.snackbarNotifications,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ removeSnackbarNotification }, dispatch);

const styles: any = (theme: any) => ({
  notification: {
    [theme.breakpoints.down('md')]: {
      left: 'auto',
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(SnackbarNotifications)));
