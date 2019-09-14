import React, { FC, useEffect, useRef } from 'react';
import { useContext } from '../context';
import { useSnackbar } from 'notistack';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';

import CloseIcon from '@material-ui/icons/Close';

import ISnackbarNotification from '../interfaces/ISnackbarNotification';

const SnackbarNotifications: FC = () => {
  const classes = useStyles();
  const [{ notifications }, { removeFromSnackbar }] = useContext();
  const { snackbar } = notifications;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const displayed = useRef<string[]>([]);

  useEffect(() => {
    const action = (key: any) => (
      <IconButton
        size="small"
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    );
    if (snackbar) {
      snackbar.forEach((notification: ISnackbarNotification) => {
        if (!displayed.current.find((id: string) => id === notification.id)) {
          enqueueSnackbar(notification.message, {
            variant: notification.variant,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            className: classes.notification,
            action,
          } as any);
          removeFromSnackbar(notification.id);
          displayed.current.push(notification.id);
        }
      });
    }
  }, [
    classes.notification,
    notifications.snackbar,
    enqueueSnackbar,
    removeFromSnackbar,
    closeSnackbar,
    snackbar,
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
