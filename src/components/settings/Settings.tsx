import React, { useState } from 'react';
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
import CloseIcon from '@material-ui/icons/Close';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FontDownloadIcon from '@material-ui/icons/FontDownloadOutlined';
import FormatColorResetIcon from '@material-ui/icons/FormatColorReset';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/PaletteOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { makeStyles } from '@material-ui/styles';

import Account from './Account';
import Font from './Font';
import Layout from './Layout';
import Messages from './Messages';
import Notifications from './Notifications';
import System from './System';
import Theme from './Theme';
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
  { name: 'Reset', icon: <FormatColorResetIcon /> },
  null,
  { name: 'Log Off', icon: <PowerSettingsNewIcon /> },
];

const Settings: React.FC = () => {
  const classes = useStyles();
  const [
    { showSettings, app },
    { toggleShowSettings, logOff, setThemeToDefault },
  ] = useContext();
  const [goToLogin, setGoToLogin] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const handleClickClose = () => {
    toggleShowSettings();
  };

  const handleLogOff = () => {
    logOff();
    setGoToLogin(true);
  };

  if (goToLogin) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Dialog
        fullScreen={true}
        open={showSettings}
        className={classes.dialog}
        BackdropProps={{ className: classes.dialog }}
      >
        <DialogContent className={classes.dialogContent}>
          <div className={classes.nav}>
            <List>
              {TABS.map((tab: any, index: number) => {
                if (tab) {
                  if (
                    !selectedTab ||
                    (tab.name === 'System' && app.operatingSystem !== 'win32')
                  ) {
                    return null;
                  } else {
                    return (
                      <ListItem
                        key={index}
                        button={true}
                        selected={tab.name === selectedTab.name}
                        onClick={() => setSelectedTab(tab)}
                      >
                        <ListItemIcon className={classes.icon}>
                          {tab.icon}
                        </ListItemIcon>
                        <ListItemText>{tab.name}</ListItemText>
                      </ListItem>
                    );
                  }
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
          <div className={classes.content}>
            {selectedTab && selectedTab.name === 'Account' && <Account />}
            {selectedTab && selectedTab.name === 'Theme' && <Theme />}
            {selectedTab && selectedTab.name === 'Font' && <Font />}
            {selectedTab && selectedTab.name === 'Layout' && <Layout />}
            {selectedTab && selectedTab.name === 'Messages' && <Messages />}
            {selectedTab && selectedTab.name === 'Notifications' && (
              <Notifications />
            )}
            {selectedTab && selectedTab.name === 'System' && <System />}
            {selectedTab && selectedTab.name === 'Reset' && (
              <div className={classes.section}>
                <Typography>
                  This will reset your colors, font, and font size to the
                  default settings.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setThemeToDefault()}
                >
                  Reset all Styles
                </Button>
              </div>
            )}
            {selectedTab && selectedTab.name === 'Log Off' && (
              <div className={classes.section}>
                <Typography>
                  This will log you off of your current account. All data
                  associated this account will be removed.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogOff}
                >
                  Log Off
                </Button>
              </div>
            )}
            <div className={classes.close}>
              <IconButton onClick={handleClickClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

const useStyles = makeStyles((theme: any) => ({
  dialog: {
    top: '23px',
  },
  dialogContent: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    padding: '0 !important',
  },
  nav: {
    overflowY: 'auto',
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: theme.spacing.unit * 4,
    '& p': {
      padding: theme.spacing.unit,
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
    width: '50px',
    top: theme.spacing.unit * 4,
    left: 585,
    '& button': {
      position: 'fixed',
    },
  },
  noPadding: {
    padding: 0,
  },
  section: {
    padding: theme.spacing.unit * 4,
    maxWidth: '500px',
    '& p': {
      paddingBottom: theme.spacing.unit * 2,
    },
  },
  version: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default Settings;
