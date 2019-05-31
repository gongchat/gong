import React, { FC } from 'react';
import { useContext } from '../../context';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

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
interface IProps {
  open: boolean;
  anchorEl: any;
  onClose: any;
}

const StatusMenu: FC<IProps> = ({ open, anchorEl, onClose }: IProps) => {
  const classes = useStyles();
  const { setMyStatus } = useContext()[1];

  const handleStatusClick = (status: string) => {
    setMyStatus(status);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
            onClick={() => handleStatusClick(status.value)}
            className={classes.item}
          >
            <div className={classes.rowOne}>
              <div className={classes.status}>
                <Status status={status.value} />
              </div>
              <Typography className={classes.title}>{status.title}</Typography>
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
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    width: theme.sidebarWidth - theme.spacing(4),
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
    padding: theme.spacing(1, 2),
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  status: {
    width: theme.spacing(4),
  },
  title: {
    // marginLeft: theme.spacing(1),
  },
  description: {
    marginLeft: theme.spacing(4),
    opacity: 0.7,
    padding: theme.spacing(1, 2),
    paddingTop: 0,
  },
}));

export default StatusMenu;
