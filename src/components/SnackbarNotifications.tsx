import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

import { makeStyles } from '@material-ui/styles';

// libs
import { useSnackbar } from 'notistack';

// interfaces
import ISnackbarNotification from 'src/interfaces/ISnackbarNotification';
import { usePrevious } from 'src/utils/usePrevious';

const SnackbarNotifications = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();
  const { enqueueSnackbar } = useSnackbar();

  const prevSnackbarNotifications = usePrevious(context.snackbarNotifications);
  React.useEffect(() => {
    let notExists = false;
    if (context.snackbarNotifications) {
      context.snackbarNotifications.forEach(
        (notification: any, index: number) => {
          if (!notExists) {
            notExists =
              notExists ||
              !prevSnackbarNotifications.filter(
                ({ key }) => context.snackbarNotifications[index].key === key
              ).length;
          }
        }
      );
    }
    if (notExists && context.snackbarNotifications) {
      context.snackbarNotifications.forEach(
        (notification: ISnackbarNotification) => {
          enqueueSnackbar(notification.message, {
            variant: notification.variant,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            className: classes.notification,
          } as any);
          actions.removeFromSnackbar(notification.id);
        }
      );
    }
  }, [context.snackbarNotifications]);

  return null;
};

const useStyles = makeStyles((theme: any) => ({
  notification: {
    [theme.breakpoints.down('md')]: {
      left: 'auto',
    },
    // TODO: Figure out why it is not picking up the correct text color
    '& span': {
      color: theme.palette.text.primary,
    },
  },
}));

export default SnackbarNotifications;
