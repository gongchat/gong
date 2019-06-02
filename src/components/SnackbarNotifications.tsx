import { FC, useEffect } from 'react';
import { useContext } from '../context';
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/styles';

import ISnackbarNotification from '../interfaces/ISnackbarNotification';
import { usePrevious } from '../utils/usePrevious';

const SnackbarNotifications: FC = () => {
  const classes = useStyles();
  const [{ snackbarNotifications }, { removeFromSnackbar }] = useContext();
  const { enqueueSnackbar } = useSnackbar();
  const prevSnackbarNotifications = usePrevious(snackbarNotifications);

  useEffect(() => {
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
        } as any);
        // TODO: If not wrapped in a setTimeout will remove users from channels in state, need ot figure out why
        setTimeout(() => removeFromSnackbar(notification.id));
      });
    }
  }, [
    classes.notification,
    snackbarNotifications,
    enqueueSnackbar,
    prevSnackbarNotifications,
    removeFromSnackbar,
  ]);

  return null;
};

const useStyles: any = makeStyles((theme: any) => ({
  notification: {
    zIndex: 9999,
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
