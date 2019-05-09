import React, { FC, useState } from 'react';
import { useContext } from '../../context';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

import IRoomJoin from '../../interfaces/IRoomJoin';
import IRoom from '../../interfaces/IRoom';

interface IProps {
  channel: IRoom;
  onClose: any;
}

const EditRoom: FC<IProps> = ({ channel, onClose }: IProps) => {
  const classes = useStyles();
  const { editRoom } = useContext()[1];
  const [jid, setJid] = useState(channel.jid);
  const [channelName, setChannelName] = useState(channel.name);
  const [nickname, setNickname] = useState(channel.myNickname);
  const [password, setPassword] = useState(channel.password);

  const handleClickEditRoom = () => {
    const channelJoin: IRoomJoin = { jid, channelName, nickname, password };
    editRoom(channel.jid, channelJoin);
    onClose();
  };

  const handleOnChange = (event: any, action: any) => {
    action(event.target.value);
  };

  return (
    <>
      <DialogTitle className={classes.dialogTitle}>
        <span className={classes.title}>
          <span>Edit Room</span>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </span>
      </DialogTitle>
      <ValidatorForm onSubmit={handleClickEditRoom}>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.inputs}>
            <TextValidator
              name="jid"
              onChange={(event: any) => handleOnChange(event, setJid)}
              label="JID"
              variant="filled"
              margin="dense"
              value={jid}
              validators={['required']}
              errorMessages={['jid is rquired']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="channelName"
              onChange={(event: any) => handleOnChange(event, setChannelName)}
              label="Channel Name"
              variant="filled"
              margin="dense"
              value={channelName}
              validators={['required']}
              errorMessages={['channel name is required']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="nickname"
              onChange={(event: any) => handleOnChange(event, setNickname)}
              label="Nickname"
              variant="filled"
              margin="dense"
              value={nickname}
              validators={['required']}
              errorMessages={['nickname is required']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextField
              name="password"
              onChange={(event: any) => handleOnChange(event, setPassword)}
              label="Password"
              variant="filled"
              margin="dense"
              helperText="Leave empty if no password"
              FormHelperTextProps={{ className: classes.helperText }}
              type="password"
              value={password}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Back</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </ValidatorForm>
    </>
  );
};

const useStyles = makeStyles((theme: any) => ({
  dialogTitle: {
    padding: 0,
    paddingLeft: theme.spacing.unit,
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.unit,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '12pt',
  },
  icon: {
    marginRight: 0,
  },
  dialogContent: {
    paddingTop: '0 !important',
  },
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  input: {
    flexShrink: 0,
  },
  helperText: {
    marginLeft: 0,
  },
}));

export default EditRoom;
