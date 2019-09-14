import React, { FC, useState } from 'react';
import { useContext } from '../../context';

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

import IDiscoverRoom from '../../interfaces/IDiscoverRoom';
import IRoomJoin from '../../interfaces/IRoomJoin';
import ISubdomain from '../../interfaces/ISubdomain';

const Discover: FC = () => {
  const classes = useStyles();
  const [
    { profile, discover },
    { setShowDiscover, discoverItems, addRoomToChannels },
  ] = useContext();
  const {
    isSubdomainsLoaded,
    subdomains,
    isRoomsLoaded,
    rooms,
    isOpen,
  } = discover;
  const nickname =
    profile.vCard && profile.vCard.nickname
      ? profile.vCard.nickname
      : profile.username;
  const [selectedSubdomainJid, setSelectedSubdomainJid] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState({
    jid: '',
    channelName: '',
    nickname: '',
    password: '',
  });

  const handleClose = () => {
    setShowDiscover(false);
    setSelectedSubdomainJid('');
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

  const RoomListContent = () => {
    if (selectedSubdomainJid !== '' && !isRoomsLoaded) {
      return (
        <ListItem>
          <ListItemText>Looking for rooms...</ListItemText>
        </ListItem>
      );
    }

    if (selectedSubdomainJid !== '' && isRoomsLoaded && rooms.length === 0) {
      return (
        <ListItem>
          <ListItemText>No rooms found</ListItemText>
        </ListItem>
      );
    }

    if (rooms.length > 0) {
      return rooms.map((room: any) => (
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
      ));
    }

    return <div />;
  };

  return (
    <Dialog
      open={isOpen}
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
          <>
            <div className={classes.list}>
              <List className={classes.subdomains}>
                <ListItem button={true} dense={true} onClick={manuallyAddARoom}>
                  <ListItemText>Manually Add a Room</ListItemText>
                </ListItem>
                {!isSubdomainsLoaded && (
                  <ListItem>
                    <ListItemText>Looking for subdomains...</ListItemText>
                  </ListItem>
                )}
                {isSubdomainsLoaded && subdomains.length === 0 && (
                  <ListItem>
                    <ListItemText>No subdomains found</ListItemText>
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
              <List className={classes.rooms}>{RoomListContent()}</List>
            </div>
          </>
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
          <>
            <Button onClick={handleClickBack}>Back</Button>
            <Button
              onClick={handleClickAddRoom}
              variant="contained"
              color="primary"
            >
              Connect
            </Button>
          </>
        </DialogActions>
      )}
    </Dialog>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  dialog: {
    top: '23px',
  },
  dialogTitle: {
    padding: 0,
    paddingLeft: theme.spacing(1),
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
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
    minWidth: 0,
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  helperText: {
    marginLeft: 0,
  },
}));

export default Discover;
