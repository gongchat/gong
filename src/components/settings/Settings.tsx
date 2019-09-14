import React, { FC, useState } from 'react';
import { Redirect } from 'react-router';
import { useContext } from '../../context';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircleOutlined';
import CodeIcon from '@material-ui/icons/Code';
import CloseIcon from '@material-ui/icons/Close';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FontDownloadIcon from '@material-ui/icons/FontDownloadOutlined';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/PaletteOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { makeStyles } from '@material-ui/styles';

import Account from './Account';
import Developer from './Developer';
import Font from './Font';
import Layout from './Layout';
import Messages from './Messages';
import Notifications from './Notifications';
import System from './System';
import Theme from './Theme';
import MenuBar from '../MenuBar';
import GithubIcon from '../icons/GithubIcon';
import GongIcon from '../icons/GongIcon';

const TABS = [
  { name: 'Account', icon: <AccountCircleIcon /> },
  { name: 'Theme', icon: <PaletteIcon /> },
  { name: 'Font', icon: <FontDownloadIcon /> },
  { name: 'Layout', icon: <DashboardIcon /> },
  { name: 'Messages', icon: <HorizontalSplitIcon /> },
  { name: 'Notifications', icon: <NotificationsIcon /> },
  { name: 'System', icon: <SettingsApplicationsIcon /> },
  null,
  { name: 'Developer', icon: <CodeIcon /> },
  null,
  { name: 'Log Off', icon: <PowerSettingsNewIcon /> },
];

const Settings: FC = () => {
  const classes = useStyles();
  const [{ settings, app }, { toggleShowSettings, logOff }] = useContext();
  const { isOpen } = settings;
  const [goToLogin, setGoToLogin] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const handleClickClose = () => {
    toggleShowSettings();
  };

  const handleLogOff = () => {
    logOff();
    setGoToLogin(true);
  };

  const getContent = () => {
    if (selectedTab) {
      switch (selectedTab.name) {
        case 'Account':
          return <Account />;
        case 'Developer':
          return <Developer />;
        case 'Font':
          return <Font />;
        case 'Layout':
          return <Layout />;
        case 'Log Off':
          return (
            <div className={classes.section}>
              <div>
                <Typography gutterBottom>
                  Logging off will remove your custom settings and saved rooms.
                  Your chat logs will not be removed.
                </Typography>
              </div>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogOff}
              >
                Log Off
              </Button>
            </div>
          );
        case 'Messages':
          return <Messages />;
        case 'Notifications':
          return <Notifications />;
        case 'System':
          return <System />;
        case 'Theme':
          return <Theme />;
        default:
          return null;
      }
    }
  };

  if (goToLogin) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Dialog
        fullScreen={true}
        open={isOpen}
        className={classes.dialog}
        BackdropProps={{ className: classes.dialog }}
        PaperProps={{ className: classes.dialog }}
      >
        <DialogContent className={classes.dialogContent}>
          <div className={classes.menubar}>
            <MenuBar showOffline={false} />
          </div>
          <div className={classes.settings}>
            <div className={classes.nav}>
              <List>
                {TABS.map((tab: any, index: number) => {
                  if (tab) {
                    return (
                      <ListItem
                        key={index}
                        button={true}
                        selected={
                          !!(selectedTab && tab.name === selectedTab.name)
                        }
                        onClick={() => setSelectedTab(tab)}
                      >
                        <ListItemIcon className={classes.icon}>
                          {tab.icon}
                        </ListItemIcon>
                        <ListItemText>{tab.name}</ListItemText>
                      </ListItem>
                    );
                  } else {
                    return <Divider key={index} />;
                  }
                })}
                <Divider />
                <ListItem className={classes.links}>
                  <ListItemIcon>
                    <a href="https://gongchat.github.io">
                      <GongIcon />
                    </a>
                  </ListItemIcon>
                  <ListItemIcon>
                    <a href="https://github.com/gongchat/gong">
                      <GithubIcon />
                    </a>
                  </ListItemIcon>
                </ListItem>
                <ListItem className={classes.version}>
                  <Typography variant="caption">v{app.version}</Typography>
                </ListItem>
              </List>
            </div>
            <div className={classes.content}>{getContent()}</div>
            <div className={classes.close}>
              <div className={classes.closeButton}>
                <IconButton onClick={handleClickClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

const useStyles: any = makeStyles((theme: any) => ({
  dialog: {
    background: 'transparent',
    '& > div:first-child': {
      paddingTop: 0,
    },
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  settings: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    padding: '0 !important',
  },
  menubar: {
    opacity: 0,
  },
  nav: {
    overflowY: 'auto',
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: theme.spacing(4),
    '& p': {
      padding: theme.spacing(1),
    },
  },
  icon: {
    marginRight: 0,
  },
  links: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    paddingBottom: 0,
    '& > div': {
      minWidth: 0,
      marginRight: theme.spacing(1),
    },
    '& a': {
      color: theme.palette.text.primary,
    },
  },
  content: {
    flexGrow: 1,
    position: 'relative',
    width: 650,
    display: 'flex',
    flexWrap: 'nowrap',
    backgroundColor: theme.palette.background.paper,
  },
  close: {
    position: 'absolute',
    width: 850,
    margin: 'auto',
  },
  closeButton: {
    width: '50px',
    marginLeft: 'auto',
    marginTop: theme.spacing(1),
    '& button': {
      position: 'fixed',
    },
  },
  noPadding: {
    padding: 0,
  },
  section: {
    padding: theme.spacing(4),
    maxWidth: '500px',
    '& p': {
      paddingBottom: theme.spacing(2),
    },
  },
  version: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default Settings;
