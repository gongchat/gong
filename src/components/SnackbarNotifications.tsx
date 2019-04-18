import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

import { makeStyles } from '@material-ui/styles';

// libs
import { useSnackbar } from 'notistack';

// interfaces
import ISnackbarNotification from 'src/interfaces/ISnackbarNotification';

const SnackbarNotifications = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();
  const { enqueueSnackbar } = useSnackbar();

  const [displayed, setDisplayed] = useState([]);

  const storeDisplayed = (id: string) => {
    setDisplayed([...displayed, id] as any);
  };

  React.useEffect(() => {
    let notExists = false;
    if (context.snackbarNotifications) {
      context.snackbarNotifications.forEach(
        (notification: any, index: number) => {
          if (!notExists) {
            notExists =
              notExists ||
              !context.snackbarNotifications.filter(
                ({ key }) => context.snackbarNotifications[index].key === key
              ).length;
          }
        }
      );
    }
    if (context.snackbarNotifications) {
      context.snackbarNotifications.forEach(
        (notification: ISnackbarNotification) => {
          if (
            !displayed.find(
              (e: ISnackbarNotification) => e.id === notification.id
            )
          ) {
            enqueueSnackbar(notification.message, {
              variant: notification.variant,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              className: classes.notification,
            } as any);
            storeDisplayed(notification.id);
            actions.removeSnackbarNotification(notification.id);
          }
        }
      );
    }
  }, [props.snackbarNotifications]);

  return null;
};

// const mapStateToProps = (states: IStates) => ({
//   snackbarNotifications: states.gong.snackbarNotifications,
// });

// const mapDispatchToProps = (dispatch: any) =>
//   bindActionCreators({ removeSnackbarNotification }, dispatch);

const useStyles = makeStyles((theme: any) => ({
  notification: {
    [theme.breakpoints.down('md')]: {
      left: 'auto',
    },
  },
}));

export default SnackbarNotifications;
