import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

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

const EditRoom: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const actions = useContext()[1];

  const { channel, onClose } = props;
  const { editRoom } = actions;

  const [jid, setJid] = useState(channel.jid);
  const [channelName, setChannelName] = useState(channel.name);
  const [nickname, setNickname] = useState(channel.myNickname);
  const [password, setPassword] = useState(channel.password);

  const handleClickEditRoom = () => {
    const channelJoin: IRoomJoin = { jid, channelName, nickname, password };
    editRoom(channel.jid, channelJoin);
    onClose();
  };

  const handleOnChange = (e: any, action: any) => {
    action(e.target.value);
  };

  return (
    <React.Fragment>
      <DialogTitle className={classes.dialogTitle}>
        <span className={classes.title}>
          <span>Edit Room</span>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </span>
      </DialogTitle>
      <DialogContent>
        <div className={classes.inputs}>
          <TextField
            name="jid"
            onChange={(e: any) => handleOnChange(e, setJid)}
            label="JID"
            variant="filled"
            margin="dense"
            value={jid}
          />
          <TextField
            name="channelName"
            onChange={(e: any) => handleOnChange(e, setChannelName)}
            label="Channel Name"
            variant="filled"
            margin="dense"
            value={channelName}
          />
          <TextField
            name="nickname"
            onChange={(e: any) => handleOnChange(e, setNickname)}
            label="Nickname"
            variant="filled"
            margin="dense"
            value={nickname}
          />
          <TextField
            name="password"
            onChange={(e: any) => handleOnChange(e, setPassword)}
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
        <Button
          onClick={handleClickEditRoom}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </React.Fragment>
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
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  helperText: {
    marginLeft: 0,
  },
}));

export default EditRoom;
