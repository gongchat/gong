import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import NewReleasesIcon from '@material-ui/icons/NewReleases';

import BasePage from './BasePage';
import BaseSection from './BaseSection';
import { DEFAULT as DEFAULT_SETTINGS } from '../../actions/settings';

const System: FC = () => {
  const classes = useStyles();
  const [
    { settings, app },
    { setAndSaveSettings, checkForUpdates },
  ] = useContext();
  const [minimizeToTrayOnClose, setMinimizeToTrayOnClose] = useState(
    settings.minimizeToTrayOnClose
  );
  const [timeSinceLastUpdateCheck, setTimeSinceLastUpdateCheck] = useState('');

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    setAndSaveSettings({ [event.target.name]: value });
  };

  const reset = () => {
    setAndSaveSettings({
      minimizeToTrayOnClose: DEFAULT_SETTINGS.minimizeToTrayOnClose,
    });
  };

  useEffect(() => {
    setMinimizeToTrayOnClose(settings.minimizeToTrayOnClose);
  }, [settings.minimizeToTrayOnClose]);

  useEffect(() => {
    let interval: any;
    if (app.lastDateTimeUpdatedChecked) {
      setTimeSinceLastUpdateCheck(app.lastDateTimeUpdatedChecked.fromNow());
      interval = setInterval(() => {
        if (app.lastDateTimeUpdatedChecked) {
          setTimeSinceLastUpdateCheck(app.lastDateTimeUpdatedChecked.fromNow());
        } else {
          clearInterval(interval);
        }
      }, 60_000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [app.lastDateTimeUpdatedChecked]);

  return (
    <BasePage title="System">
      <BaseSection title="Updates">
        <div>
          <div className={classes.buttonWrapper}>
            <Button
              variant="outlined"
              onClick={checkForUpdates}
              disabled={app.isCheckingForUpdate}
            >
              Check for Updates
            </Button>
            {app.isCheckingForUpdate && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          {app.hasUpdate !== undefined && (
            <Chip
              className={classes.chip}
              avatar={
                <Avatar>
                  {/* hasUpdate can be undefined, so have to check for false */}
                  {app.hasUpdate === false && <CheckIcon />}
                  {app.hasUpdate && <NewReleasesIcon />}
                </Avatar>
              }
              label={
                app.hasUpdate === false
                  ? 'There are no updates available'
                  : app.hasUpdate
                  ? 'There is a new update available'
                  : ''
              }
            />
          )}
          {app.isAutoUpdateError && (
            <Chip
              className={classes.chip}
              avatar={
                <Avatar>
                  <ErrorIcon />
                </Avatar>
              }
              label={'Unable to update automatically'}
            />
          )}
          {app.lastDateTimeUpdatedChecked && (
            <Chip
              className={classes.chip}
              label={`Last checked ${
                app.lastDateTimeUpdatedChecked ? timeSinceLastUpdateCheck : ''
              }`}
            />
          )}
          {app.isAutoUpdateError && (
            <Typography>
              Please check{' '}
              <Link href="https://github.com/gongchat/gong/releases/latest/">
                GitHub
              </Link>{' '}
              or the{' '}
              <Link href="https://gongchat.github.io/download/">
                Official Site
              </Link>{' '}
              for any updates.
            </Typography>
          )}
        </div>
      </BaseSection>
      {app.operatingSystem === 'win32' && (
        <>
          <BaseSection title="On Close">
            <FormControlLabel
              control={
                <Switch
                  name="minimizeToTrayOnClose"
                  checked={minimizeToTrayOnClose}
                  onChange={(event: any, value: any) =>
                    handleOnChange(event, value, setMinimizeToTrayOnClose)
                  }
                />
              }
              label="Minimize to tray"
            />
          </BaseSection>
          <div>
            <Button color="secondary" onClick={reset} variant="outlined">
              RESET
            </Button>
          </div>
        </>
      )}
    </BasePage>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  buttonWrapper: {
    position: 'relative',
    width: 'fit-content',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  chip: {
    margin: theme.spacing(2, 1, 0, 0),
  },
}));

export default System;
