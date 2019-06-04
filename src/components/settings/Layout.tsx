import React, { FC, useEffect, useRef, useState } from 'react';
import { useContext } from '../../context';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/lab/Slider';
import { makeStyles } from '@material-ui/styles';

import BasePage from './BasePage';
import BaseSection from './BaseSection';
import SliderMarkers from './SliderMarkers';
import { DEFAULT as DEFAULT_THEME } from '../../actions/theme';

const MIN_SIDEBAR_WIDTH = 150;
const MAX_SIDEBAR_WIDTH = 250;
const DEFAULT_SIDEBAR_WIDTH = 225;

const MIN_SPACING = 2;
const MAX_SPACING = 10;
const DEFAULT_SPACING = 8;

const Layout: FC = () => {
  const classes = useStyles();
  const [{ theme }, { setTheme }] = useContext();
  const [spacing, setSpacing] = useState(theme.spacing(1));
  const [sidebarWidth, setSidebarWidth] = useState(theme.sidebarWidth);
  const [sidebarLeftShowAvatar, setSidebarLeftShowAvatar] = useState(
    theme.sidebarLeftShowAvatar
  );
  const [sidebarRightShowAvatar, setSidebarRightShowAvatar] = useState(
    theme.sidebarRightShowAvatar
  );
  const [
    sortChannelsByMostRecentUnread,
    setSortChannelsByMostRecentUnread,
  ] = useState(theme.sortChannelsByMostRecentUnread);

  const spacingTimer = useRef<any>();
  const sidebarWidthTimer = useRef<any>();

  const handleKeyDown = (event: any) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    const code = event.keyCode;
    let regex = new RegExp('');

    switch (event.target.name) {
      case 'spacing':
      case 'sidebarWidth':
        if (
          code === 8 ||
          (code >= 35 && code <= 46) ||
          (code >= 96 || code <= 105)
        ) {
          return;
        }
        regex = new RegExp('^[0-9]+$');
        break;
      default:
        break;
    }

    if (!regex.test(key)) {
      event.preventDefault();
      return;
    }
  };

  const updateSpacing = (value: any) => {
    setSpacing(value);
    if (spacingTimer) {
      clearTimeout(spacingTimer.current);
    }
    spacingTimer.current = setTimeout(() => {
      value =
        value < MIN_SPACING
          ? MIN_SPACING
          : value > MAX_SPACING
          ? MAX_SPACING
          : value;
      setTheme([{ themeKey: 'theme.spacing.unit', value }]);
      setSpacing(value);
    }, 1000);
  };

  const updateSidebarWidth = (value: any) => {
    setSidebarWidth(value);
    if (sidebarWidthTimer) {
      clearTimeout(sidebarWidthTimer.current);
    }
    sidebarWidthTimer.current = setTimeout(() => {
      value =
        value < MIN_SIDEBAR_WIDTH
          ? MIN_SIDEBAR_WIDTH
          : value > MAX_SIDEBAR_WIDTH
          ? MAX_SIDEBAR_WIDTH
          : value;
      setTheme([{ themeKey: 'sidebarWidth', value }]);
      setSidebarWidth(value);
    }, 1000);
  };

  const handleSwitchChange = (event: any, action: any) => {
    action(event.target.checked);
    setTheme([{ themeKey: event.target.name, value: event.target.checked }]);
  };

  const reset = () => {
    setTheme([
      { themeKey: 'theme.spacing.unit', value: 8 },
      { themeKey: 'sidebarWidth', value: DEFAULT_THEME.sidebarWidth },
      {
        themeKey: 'sortChannelsByMostRecentUnread',
        value: DEFAULT_THEME.sortChannelsByMostRecentUnread,
      },
      {
        themeKey: 'sidebarLeftShowAvatar',
        value: DEFAULT_THEME.sidebarLeftShowAvatar,
      },
      {
        themeKey: 'sidebarRightShowAvatar',
        value: DEFAULT_THEME.sidebarRightShowAvatar,
      },
    ]);
  };

  useEffect(() => {
    setSpacing(theme.spacing.unit);
  }, [theme.spacing.unit]);

  useEffect(() => {
    setSidebarWidth(theme.sidebarWidth);
  }, [theme.sidebarWidth]);

  useEffect(() => {
    setSortChannelsByMostRecentUnread(theme.sortChannelsByMostRecentUnread);
  }, [theme.sortChannelsByMostRecentUnread]);

  useEffect(() => {
    setSidebarLeftShowAvatar(theme.sidebarLeftShowAvatar);
  }, [theme.sidebarLeftShowAvatar]);

  useEffect(() => {
    setSidebarRightShowAvatar(theme.sidebarRightShowAvatar);
  }, [theme.sidebarRightShowAvatar]);

  return (
    <BasePage title="Layout">
      <BaseSection title="Spacing">
        <div className={classes.slider}>
          <Slider
            value={spacing === '' ? 0 : parseInt(spacing, 10)}
            min={MIN_SPACING}
            max={MAX_SPACING}
            step={1}
            onChange={(event: any, value: any) => updateSpacing(value)}
          />
          <SliderMarkers
            minSize={MIN_SPACING}
            maxSize={MAX_SPACING}
            defaultSize={DEFAULT_SPACING}
          />
        </div>
        <div>
          <TextField
            name="spacing"
            label="Spacing"
            value={spacing}
            onChange={(event: any) => updateSpacing(event.target.value)}
            onKeyDown={handleKeyDown}
            type="number"
            margin="normal"
            variant="filled"
            inputProps={{
              min: MIN_SPACING,
              max: MAX_SPACING,
            }}
          />
        </div>
      </BaseSection>
      <BaseSection title="Sidebar Width">
        <div className={classes.slider}>
          <Slider
            value={sidebarWidth === '' ? 0 : parseInt(sidebarWidth, 10)}
            min={MIN_SIDEBAR_WIDTH}
            max={MAX_SIDEBAR_WIDTH}
            step={1}
            onChange={(event: any, value: any) => updateSidebarWidth(value)}
          />
          <SliderMarkers
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            defaultSize={DEFAULT_SIDEBAR_WIDTH}
          />
        </div>
        <div>
          <TextField
            name="sidebarWidth"
            label="Sidebar Width"
            value={sidebarWidth}
            onChange={(event: any) => updateSidebarWidth(event.target.value)}
            onKeyDown={handleKeyDown}
            type="number"
            margin="normal"
            variant="filled"
            inputProps={{
              min: MIN_SIDEBAR_WIDTH,
              max: MAX_SIDEBAR_WIDTH,
            }}
          />
        </div>
      </BaseSection>
      <BaseSection title="Channels">
        <FormControlLabel
          control={
            <Switch
              name="sortChannelsByMostRecentUnread"
              checked={sortChannelsByMostRecentUnread}
              onChange={(event: any) =>
                handleSwitchChange(event, setSortChannelsByMostRecentUnread)
              }
            />
          }
          label="Sort channels with unread messages first"
        />
      </BaseSection>
      <BaseSection title="Avatars">
        <FormControlLabel
          control={
            <Switch
              name="sidebarLeftShowAvatar"
              checked={sidebarLeftShowAvatar}
              onChange={(event: any) =>
                handleSwitchChange(event, setSidebarLeftShowAvatar)
              }
            />
          }
          label="Show avatars in the left sidebar"
        />
        <FormControlLabel
          control={
            <Switch
              name="sidebarRightShowAvatar"
              checked={sidebarRightShowAvatar}
              onChange={(event: any) =>
                handleSwitchChange(event, setSidebarRightShowAvatar)
              }
            />
          }
          label="Show avatars in the right sidebar"
        />
      </BaseSection>
      <div>
        <Button color="secondary" onClick={reset} variant="outlined">
          RESET
        </Button>
      </div>
    </BasePage>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  slider: { position: 'relative' },
}));

export default Layout;
