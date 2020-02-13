import React, { FC, useState } from 'react';
import { useContext } from '../../context';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Status from './Status';
import TextField from '@material-ui/core/TextField';

const STATUSES = [
  { value: 'online', title: 'Online' },
  null,
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
  const [{ profile }, { setMyStatus, setMyStatusText }] = useContext();
  const [statusText, setStatusText] = useState(profile.statusText);
  const [customStatusOpen, setCustomStatusOpen] = useState(false);

  const handleStatusClick = (status: string) => {
    setMyStatus(status);
    onClose();
  };

  const openCustomStatus = () => {
    setCustomStatusOpen(true);
  };

  const closeCustomStatus = () => {
    setCustomStatusOpen(false);
  };

  const setCustomStatus = () => {
    setMyStatusText(statusText);
    setCustomStatusOpen(false);
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
        {STATUSES.map((status: any, index: number) =>
          status ? (
            <div
              key={index}
              onClick={() => handleStatusClick(status.value)}
              className={classes.item}
            >
              <div
                className={[
                  classes.rowOne,
                  status.description ? classes.noBottomPadding : '',
                ]
                  .join(' ')
                  .trim()}
              >
                <div className={classes.status}>
                  <Status status={status.value} />
                </div>
                <Typography className={classes.title}>
                  {status.title}
                </Typography>
              </div>
              {status.description && (
                <Typography className={classes.description} variant="caption">
                  <small>{status.description}</small>
                </Typography>
              )}
            </div>
          ) : (
            <Divider key={`${index}-divider`} />
          )
        )}
        <Divider />
        <div className={classes.item} onClick={openCustomStatus}>
          <div className={classes.rowOne}>
            <div className={classes.status}>
              <span role="img" aria-label="Set a custom status">
                😄
              </span>
            </div>
            <Typography className={classes.title}>Set my status</Typography>
          </div>
        </div>
        <Dialog open={customStatusOpen} onClose={closeCustomStatus}>
          <DialogTitle>Set a custom status</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              value={statusText}
              onChange={(event: any) => setStatusText(event.target.value)}
              margin="dense"
              label="Custom Status"
              type="text"
              fullWidth={true}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCustomStatus}>Cancel</Button>
            <Button
              onClick={setCustomStatus}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
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
  noBottomPadding: {
    paddingBottom: 0,
  },
}));

export default StatusMenu;
