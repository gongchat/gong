import React, { FC, useEffect, useRef } from 'react';
import { useContext } from '../context';
import { useSnackbar } from 'notistack';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import ISnackbarNotification from '../interfaces/ISnackbarNotification';

const SnackbarNotifications: FC = () => {
  const classes = useStyles();
  const [{ snackbarNotifications }, { removeFromSnackbar }] = useContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const displayed = useRef([] as string[]);

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
    if (snackbarNotifications) {
      snackbarNotifications.forEach(
        (notification: ISnackbarNotification, index: number) => {
          if (!displayed.current.find((id: string) => id === notification.id)) {
            console.log(snackbarNotifications);
            enqueueSnackbar(notification.message, {
              variant: notification.variant,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
              className: classes.notification,
              action,
            } as any);
            removeFromSnackbar(notification.id);
            displayed.current.push(notification.id);
          }
        }
      );
    }
  }, [
    classes.notification,
    snackbarNotifications,
    enqueueSnackbar,
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
