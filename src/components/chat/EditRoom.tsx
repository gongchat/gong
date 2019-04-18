import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

// material ui
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

// interfaces
import IRoomJoin from 'src/interfaces/IRoomJoin';

const EditRoom = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const [jid, setJid] = useState(props.channel.jid);
  const [channelName, setChannelName] = useState(props.channel.name);
  const [nickname, setNickname] = useState(props.channel.myNickname);
  const [password, setPassword] = useState(props.channel.password);

  const handleClickEditRoom = () => {
    const channelJoin: IRoomJoin = {
      jid,
      channelName,
      nickname,
      password,
    };
    actions.editRoom(props.channel.jid, channelJoin);
    props.onClose();
  };

  const handleOnChange = (event: any, action: any) => {
    action(event.target.value);
  };

  return (
    <React.Fragment>
      <DialogTitle className={classes.dialogTitle}>
        <span className={classes.title}>
          <span>Edit Room</span>
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </span>
      </DialogTitle>
      <DialogContent>
        <div className={classes.inputs}>
          <TextField
            name="jid"
            onChange={() => handleOnChange(event, setJid)}
            label="JID"
            variant="filled"
            margin="dense"
            value={jid}
          />
          <TextField
            name="channelName"
            onChange={() => handleOnChange(event, setChannelName)}
            label="Channel Name"
            variant="filled"
            margin="dense"
            value={channelName}
          />
          <TextField
            name="nickname"
            onChange={() => handleOnChange(event, setNickname)}
            label="Nickname"
            variant="filled"
            margin="dense"
            value={nickname}
          />
          <TextField
            name="password"
            onChange={() => handleOnChange(event, setPassword)}
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
        <Button onClick={props.onClose}>Back</Button>
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
