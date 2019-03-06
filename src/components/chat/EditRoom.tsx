import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { editRoom } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CloseIcon from '@material-ui/icons/Close';

// interfaces
import IRoomJoin from 'src/interfaces/IRoomJoin';

class EditRoom extends React.Component<any, any> {
  public state = {
    jid: this.props.channel.jid,
    channelName: this.props.channel.name,
    nickname: this.props.channel.myNickname,
    password: this.props.channel.password,
  };

  public render() {
    const { classes } = this.props;
    const { jid, channelName, nickname, password } = this.state;

    return (
      <React.Fragment>
        <DialogTitle className={classes.dialogTitle}>
          <span className={classes.title}>
            <span>Edit Room</span>
            <IconButton onClick={this.props.onClose}>
              <CloseIcon />
            </IconButton>
          </span>
        </DialogTitle>
        <DialogContent>
          <div className={classes.inputs}>
            <TextField
              name="jid"
              onChange={this.handleOnChange}
              label="JID"
              variant="filled"
              margin="dense"
              value={jid}
            />
            <TextField
              name="channelName"
              onChange={this.handleOnChange}
              label="Channel Name"
              variant="filled"
              margin="dense"
              value={channelName}
            />
            <TextField
              name="nickname"
              onChange={this.handleOnChange}
              label="Nickname"
              variant="filled"
              margin="dense"
              value={nickname}
            />
            <TextField
              name="password"
              onChange={this.handleOnChange}
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
          <Button onClick={this.props.onClose}>Back</Button>
          <Button
            onClick={this.handleClickEditRoom}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }

  private handleClickEditRoom = () => {
    const form = { ...this.state };
    const channelJoin: IRoomJoin = {
      jid: form.jid,
      channelName: form.channelName,
      nickname: form.nickname,
      password: form.password,
    };
    this.props.editRoom(this.props.channel.jid, channelJoin);
    this.props.onClose();
  };

  private handleOnChange = (event: any) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
}

const mapDispatchToProps = {
  editRoom,
};

const styles: any = (theme: any) => ({
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
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(EditRoom));
