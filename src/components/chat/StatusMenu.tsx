import React from 'react';
import { useContext } from '../../context';

// material ui
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

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

const StatusMenu = (props: any) => {
  const classes = useStyles();
  const actions = useContext()[1];

  const handleStatusClick = (status: string) => {
    actions.setMyStatus(status);
    props.onClose();
  };

  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
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

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: theme.sidebarWidth - theme.spacing.unit * 4,
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
}));

export default StatusMenu;
