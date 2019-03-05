import * as React from 'react';
import { withRouter } from 'react-router-dom';

// redux & actions
import { connect } from 'react-redux';
import {
  logOff,
  setThemeToDefault,
  settingsToggle,
} from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
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

// components
import Account from './Account';
import Font from './Font';
import Layout from './Layout';
import Messages from './Messages';
import Notifications from './Notifications';
import System from './System';
import Theme from './Theme';

// interface
import IStates from 'src/interfaces/IStates';

const TABS = [
  { name: 'Account', icon: <AccountCircleIcon /> },
  { name: 'Theme', icon: <PaletteIcon /> },
  { name: 'Font', icon: <FontDownloadIcon /> },
  { name: 'Layout', icon: <DashboardIcon /> },
  { name: 'Messages', icon: <HorizontalSplitIcon /> },
  { name: 'Notifications', icon: <NotificationsIcon /> },
  { name: 'System', icon: <SettingsApplicationsIcon /> },
  { name: 'divider' },
  { name: 'Reset', icon: <FormatColorResetIcon /> },
  { name: 'divider' },
  { name: 'Log Off', icon: <PowerSettingsNewIcon /> },
];

class Settings extends React.Component<any, any> {
  public state = {
    selectedTab: TABS[0],
  };

  public render() {
    const { classes, showSettings } = this.props;
    const { selectedTab } = this.state;

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
                if (tab.name === 'divider') {
                  return <Divider key={index} />;
                } else {
                  return (
                    <ListItem
                      key={index}
                      button={true}
                      selected={tab.name === selectedTab.name}
                      onClick={() => this.handleClickTab(tab)}
                    >
                      <ListItemIcon className={classes.icon}>
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText>{tab.name}</ListItemText>
                    </ListItem>
                  );
                }
              })}
            </List>
          </div>
          <div className={classes.content}>
            {selectedTab.name === 'Account' && <Account />}
            {selectedTab.name === 'Theme' && <Theme />}
            {selectedTab.name === 'Font' && <Font />}
            {selectedTab.name === 'Layout' && <Layout />}
            {selectedTab.name === 'Messages' && <Messages />}
            {selectedTab.name === 'Notifications' && <Notifications />}
            {selectedTab.name === 'System' && <System />}
            {selectedTab.name === 'Reset' && (
              <div className={classes.section}>
                <Typography>
                  This will reset your colors, font, and font size to the
                  default settings.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.props.setThemeToDefault}
                >
                  Reset all Styles
                </Button>
              </div>
            )}
            {selectedTab.name === 'Log Off' && (
              <div className={classes.section}>
                <Typography>
                  This will log you off of your current account. All data
                  associated this account will be removed.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.handleLogOff}
                >
                  Log Off
                </Button>
              </div>
            )}
            <div className={classes.close}>
              <IconButton onClick={this.handleClickClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  private handleClickClose = () => {
    this.props.settingsToggle();
  };

  private handleClickTab = (tab: any) => {
    this.setState({ selectedTab: tab });
  };

  private handleLogOff = () => {
    this.props.logOff();
    this.props.history.push('/login');
  };
}

const mapStateToProps = (states: IStates) => ({
  showSettings: states.gong.showSettings,
});

const mapDispatchToProps = {
  setThemeToDefault,
  settingsToggle,
  logOff,
};

const styles: any = (theme: any) => ({
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Settings)));
