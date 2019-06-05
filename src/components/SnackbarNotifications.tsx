import React, { FC, useEffect } from 'react';
import { useContext } from '../context';
import { useSnackbar } from 'notistack';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import ISnackbarNotification from '../interfaces/ISnackbarNotification';
import { usePrevious } from '../utils/usePrevious';

const SnackbarNotifications: FC = () => {
  const classes = useStyles();
  const [{ snackbarNotifications }, { removeFromSnackbar }] = useContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const prevSnackbarNotifications = usePrevious(snackbarNotifications);

  useEffect(() => {
    const action = (key: any) => (
      <Button
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        Dismiss
      </Button>
    );

    let notExists = false;

    if (snackbarNotifications) {
      snackbarNotifications.forEach((notification: any, index: number) => {
        if (!notExists) {
          notExists =
            notExists ||
            !prevSnackbarNotifications.filter(
              ({ id }) => snackbarNotifications[index].id === id
            ).length;
        }
      });
    }

    if (notExists && snackbarNotifications) {
      snackbarNotifications.forEach((notification: ISnackbarNotification) => {
        enqueueSnackbar(notification.message, {
          variant: notification.variant,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          className: classes.notification,
          action,
        } as any);
        removeFromSnackbar(notification.id);
      });
    }
  }, [
    classes.notification,
    snackbarNotifications,
    enqueueSnackbar,
    prevSnackbarNotifications,
    removeFromSnackbar,
    closeSnackbar,
  ]);

  return null;
};

const useStyles: any = makeStyles((theme: any) => ({
  notification: {
    [theme.breakpoints.down('md')]: {
      left: 'auto',
    },
  },
}));

export default SnackbarNotifications;
