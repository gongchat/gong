import React, { FC, useEffect, useRef } from 'react';
import { useContext } from '../context';
import { useSnackbar } from 'notistack';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';

import CloseIcon from '@material-ui/icons/Close';

import ISnackbarNotification from '../interfaces/ISnackbarNotification';

const SnackbarNotifications: FC = () => {
  const classes = useStyles();
  const [{ snackbarNotifications }, { removeFromSnackbar }] = useContext();
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
    if (snackbarNotifications) {
      snackbarNotifications.forEach(
        (notification: ISnackbarNotification, index: number) => {
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
