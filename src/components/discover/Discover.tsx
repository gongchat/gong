import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import {
  addRoomToChannels,
  getSubdomainItems,
  removeChannel,
  setShowDiscover,
} from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

// interfaces
import IDiscoverRoom from 'src/interfaces/IDiscoverRoom';
import IRoomJoin from 'src/interfaces/IRoomJoin';
import IStates from 'src/interfaces/IStates';
import ISubdomain from 'src/interfaces/ISubdomain';

class Rooms extends React.Component<any, any> {
  public state = {
    open: false,
    selectedSubdomainJid: '',
    tabIndex: 0,
    form: {
      jid: '',
      channelName: '',
      nickname: '',
      password: '',
    },
  };

  public componentDidUpdate() {
    if (this.state.open !== this.props.showDiscover) {
      this.setState({ open: this.props.showDiscover });
    }
  }

  public render() {
    const { classes, subdomains, rooms } = this.props;
    const { open, selectedSubdomainJid, tabIndex, form } = this.state;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        className={classes.dialog}
        BackdropProps={{ className: classes.dialog }}
      >
        <DialogTitle className={classes.dialogTitle}>
          <span className={classes.title}>
            {tabIndex === 0 ? <span>Discover</span> : <span>Join a Room</span>}
            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </span>
        </DialogTitle>
        <DialogContent
          className={[tabIndex === 0 ? classes.discovery : ''].join(' ')}
        >
          {tabIndex === 0 && (
            <React.Fragment>
              <div className={classes.list}>
                <List className={classes.subdomains}>
                  {/* 
                  // TODO: This will show loading forever if there are no items to
                  discover. Need to implement a away to check if it comes back
                  empty 
                */}
                  <ListItem
                    button={true}
                    dense={true}
                    onClick={this.manuallyAddARoom}
                  >
                    <ListItemText>Manually Add a Room</ListItemText>
                  </ListItem>
                  {subdomains.length === 0 && (
                    <ListItem>
                      <ListItemText>Looking for subdomains...</ListItemText>
                    </ListItem>
                  )}
                  {subdomains.length > 0 &&
                    subdomains.map((subdomain: ISubdomain) => (
                      <ListItem
                        key={subdomain.jid}
                        button={true}
                        selected={selectedSubdomainJid === subdomain.jid}
                        onClick={() =>
                          this.handleSelectSubdomain(subdomain.jid)
                        }
                        dense={true}
                      >
                        <ListItemText>{subdomain.jid}</ListItemText>
                      </ListItem>
                    ))}
                </List>
              </div>
              <div className={classes.list}>
                <List className={classes.rooms}>
                  {/* 
                  // TODO: Same as above, this will show loading forever if 
                  there are no items to discover. Need to implement a away to 
                  check if it comes back empty 
                */}
                  {subdomains.length > 0 &&
                    selectedSubdomainJid !== '' &&
                    rooms.length === 0 && (
                      <ListItem>
                        <ListItemText>Looking for rooms...</ListItemText>
                      </ListItem>
                    )}
                  {rooms.length > 0 &&
                    rooms.map((room: any) => (
                      <ListItem
                        key={room.jid}
                        button={true}
                        dense={true}
                        onClick={() => this.handleSelectRoom(room)}
                      >
                        <ListItemText>{room.name}</ListItemText>
                        <ListItemIcon className={classes.icon}>
                          {room.isAdded ? <DeleteIcon /> : <AddIcon />}
                        </ListItemIcon>
                      </ListItem>
                    ))}
                </List>
              </div>
            </React.Fragment>
          )}
          {tabIndex === 1 && (
            <div className={classes.inputs}>
              <TextField
                name="jid"
                onChange={this.handleOnChange}
                label="JID"
                variant="filled"
                margin="dense"
                value={form.jid}
              />
              <TextField
                name="channelName"
                onChange={this.handleOnChange}
                label="Channel Name"
                variant="filled"
                margin="dense"
                value={form.channelName}
              />
              <TextField
                name="nickname"
                onChange={this.handleOnChange}
                label="Nickname"
                variant="filled"
                margin="dense"
                value={form.nickname}
              />
              <TextField
                name="password"
                onChange={this.handleOnChange}
                label="Password"
                variant="filled"
                margin="dense"
                helperText="Leave empty if no password"
                type="password"
                value={form.password}
              />
            </div>
          )}
        </DialogContent>
        {tabIndex === 1 && (
          <DialogActions>
            <React.Fragment>
              <Button onClick={this.handleClickBack}>Back</Button>
              <Button
                onClick={this.handleClickAddRoom}
                variant="contained"
                color="primary"
              >
                Connect
              </Button>
            </React.Fragment>
          </DialogActions>
        )}
      </Dialog>
    );
  }

  private handleClose = () => {
    this.setState({ open: false, tabIndex: 0 });
    this.props.setShowDiscover(false);
  };

  private handleSelectSubdomain = (jid: string) => {
    this.setState({ selectedSubdomainJid: jid });
    this.props.getSubdomainItems(jid.split('.')[0]);
  };

  private handleClickAddRoom = () => {
    const form = this.state.form;
    const channelJoin: IRoomJoin = {
      jid: form.jid,
      channelName: form.channelName,
      nickname: form.nickname,
      password: form.password,
    };
    this.props.addRoomToChannels(channelJoin);
    this.setState({ tabIndex: 0, form: { ...form, password: '' } });
  };

  private handleSelectRoom = (room: IDiscoverRoom) => {
    if (room.isAdded) {
      // delete the room
    } else {
      this.setState({
        tabIndex: 1,
        form: {
          jid: room.jid,
          channelName: room.jid.split('@')[0],
          nickname: this.props.nickname,
          password: '',
        },
      });
    }
  };

  private handleClickBack = () => {
    this.setState({ tabIndex: 0 });
  };

  private handleOnChange = (event: any) => {
    this.setState({
      form: { ...this.state.form, [event.target.name]: event.target.value },
    });
  };

  private manuallyAddARoom = () => {
    this.setState({
      tabIndex: 1,
      form: {
        jid: '',
        channelName: '',
        nickname: this.props.nickname,
        password: '',
      },
    });
  };
}

const mapStateToProps = (states: IStates) => ({
  showDiscover: states.gong.showDiscover,
  subdomains: states.gong.subdomains,
  rooms: states.gong.rooms,
  channels: states.gong.channels,
  nickname:
    states.gong.profile.vCard && states.gong.profile.vCard.nickname
      ? states.gong.profile.vCard.nickname
      : states.gong.profile.username,
});

const mapDispatchToProps = {
  addRoomToChannels,
  getSubdomainItems,
  removeRoomFromChannels: removeChannel,
  setShowDiscover,
};

const styles: any = (theme: any) => ({
  dialog: {
    top: '23px',
  },
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
  discovery: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  list: {
    overflowY: 'auto',
  },
  subdomains: {
    minWidth: '250px',
  },
  rooms: {
    minWidth: '250px',
  },
  icon: {
    marginRight: 0,
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Rooms));
