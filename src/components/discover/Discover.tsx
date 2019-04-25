import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

// material ui
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
import { makeStyles } from '@material-ui/styles';

// interfaces
import IDiscoverRoom from '../../interfaces/IDiscoverRoom';
import IRoomJoin from '../../interfaces/IRoomJoin';
import ISubdomain from '../../interfaces/ISubdomain';

const Discover = () => {
  const classes = useStyles();
  const [context, actions] = useContext();
  const { profile, subdomains, rooms, showDiscover } = context;
  const { setShowDiscover, discoverItems, addRoomToChannels } = actions;

  const nickname =
    profile.vCard && profile.vCard.nickname
      ? profile.vCard.nickname
      : profile.username;

  const [open, setOpen] = useState(false);
  const [selectedSubdomainJid, setSelectedSubdomainJid] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState({
    jid: '',
    channelName: '',
    nickname: '',
    password: '',
  });

  const handleClose = () => {
    setOpen(false);
    setShowDiscover(false);
  };

  const handleSelectSubdomain = (jid: string) => {
    setSelectedSubdomainJid(jid);
    discoverItems(jid.split('.')[0]);
  };

  const handleClickAddRoom = () => {
    const roomJoin: IRoomJoin = {
      jid: form.jid,
      channelName: form.channelName,
      nickname: form.nickname,
      password: form.password,
    };
    addRoomToChannels(roomJoin);
    setTabIndex(0);
    setForm({ ...form, password: '' });
  };

  const handleSelectRoom = (room: IDiscoverRoom) => {
    if (!room.isAdded) {
      setTabIndex(1);
      setForm({
        jid: room.jid,
        channelName: room.jid.split('@')[0],
        nickname,
        password: '',
      });
    }
  };

  const handleClickBack = () => {
    setTabIndex(0);
  };

  const handleOnChange = (event: any) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const manuallyAddARoom = () => {
    setTabIndex(1);
    setForm({
      jid: '',
      channelName: '',
      nickname,
      password: '',
    });
  };

  React.useEffect(() => {
    if (open !== showDiscover) {
      setOpen(showDiscover);
      setTabIndex(0);
    }
  }, [open, showDiscover]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.dialog}
      BackdropProps={{ className: classes.dialog }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <span className={classes.title}>
          {tabIndex === 0 ? <span>Discover</span> : <span>Join a Room</span>}
          <IconButton onClick={handleClose}>
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
                <ListItem button={true} dense={true} onClick={manuallyAddARoom}>
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
                      onClick={() => handleSelectSubdomain(subdomain.jid)}
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
                      onClick={() => handleSelectRoom(room)}
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
              onChange={handleOnChange}
              label="JID"
              variant="filled"
              margin="dense"
              value={form.jid}
            />
            <TextField
              name="channelName"
              onChange={handleOnChange}
              label="Channel Name"
              variant="filled"
              margin="dense"
              value={form.channelName}
            />
            <TextField
              name="nickname"
              onChange={handleOnChange}
              label="Nickname"
              variant="filled"
              margin="dense"
              value={form.nickname}
            />
            <TextField
              name="password"
              onChange={handleOnChange}
              label="Password"
              variant="filled"
              margin="dense"
              helperText="Leave empty if no password"
              FormHelperTextProps={{ className: classes.helperText }}
              type="password"
              value={form.password}
            />
          </div>
        )}
      </DialogContent>
      {tabIndex === 1 && (
        <DialogActions>
          <React.Fragment>
            <Button onClick={handleClickBack}>Back</Button>
            <Button
              onClick={handleClickAddRoom}
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
};

const useStyles = makeStyles((theme: any) => ({
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
  helperText: {
    marginLeft: 0,
  },
}));

export default Discover;
