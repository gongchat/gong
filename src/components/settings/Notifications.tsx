import React, { FC, useState } from 'react';
import { useContext } from '../../context';

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/lab/Slider';
import { makeStyles } from '@material-ui/styles';

import BasePage from './BasePage';
import BaseSection from './BaseSection';
import SliderMarkers from './SliderMarkers';
import { playAudio, SOUNDS } from '../../actions/notification';

const MIN_SIZE = 0;
const MAX_SIZE = 10;
const DEFAULT_SIZE = 5;

let volumeTimer: any;

const NotificationSettings: FC = () => {
  const classes = useStyles();
  const [{ settings }, { setAndSaveSettings }] = useContext();

  // Play Audio
  const [soundName, setSoundName] = useState(settings.soundName);
  const [volume, setVolume] = useState(settings.soundVolume);
  const [playAudioOnGroupchat, setPlayAudioOnGroupchat] = useState(
    settings.playAudioOnGroupchat
  );
  const [playAudioOnChat, setPlayAudioOnChat] = useState(
    settings.playAudioOnChat
  );
  const [playAudioOnMentionMe, setPlayAudioOnMentionMe] = useState(
    settings.playAudioOnMentionMe
  );
  // Flash Frame
  const [flashFrameOnGroupchat, setFlashFrameOnGroupchat] = useState(
    settings.flashFrameOnGroupchat
  );
  const [flashFrameOnMentionMe, setFlashFrameOnMentionMe] = useState(
    settings.flashFrameOnMentionMe
  );
  const [flashFrameOnChat, setFlashFrameOnChat] = useState(
    settings.flashFrameOnChat
  );
  // Flash Menu Bar
  const [flashMenuBarOnGroupchat, setFlashMenuBarOnGroupchat] = useState(
    settings.flashMenuBarOnGroupchat
  );
  const [
    flashMenuBarOnGroupchatFrequency,
    setFlashMenuBarOnGroupchatFrequency,
  ] = useState(settings.flashMenuBarOnGroupchatFrequency);
  const [flashMenuBarOnMentionMe, setFlashMenuBarOnMentionMe] = useState(
    settings.flashMenuBarOnMentionMe
  );
  const [
    flashMenuBarOnMentionMeFrequency,
    setFlashMenuBarOnMentionMeFrequency,
  ] = useState(settings.flashMenuBarOnMentionMeFrequency);
  const [flashMenuBarOnChat, setFlashMenuBarOnChat] = useState(
    settings.flashMenuBarOnChat
  );
  const [
    flashMenuBarOnChatFrequency,
    setFlashMenuBarOnChatFrequency,
  ] = useState(settings.flashMenuBarOnChatFrequency);
  // System Notifications
  const [
    systemNotificationOnGroupchat,
    setSystemNotificationOnGroupchat,
  ] = useState(settings.systemNotificationOnGroupchat);
  const [
    systemNotificationOnMentionMe,
    setSystemNotificationOnMentionMe,
  ] = useState(settings.systemNotificationOnMentionMe);
  const [systemNotificationOnChat, setSystemNotificationOnChat] = useState(
    settings.systemNotificationOnChat
  );

  const handleChange = (e: any, action: any) => {
    if (e.target.name === 'soundName') {
      playAudio(e.target.value, settings.soundVolume);
    }
    action(e.target.value);
    setAndSaveSettings({ [e.target.name]: e.target.value });
  };

  const updateVolume = (value: any) => {
    setVolume(value);
    playAudio(soundName, value);
    if (volumeTimer) {
      clearTimeout(volumeTimer);
    }
    volumeTimer = setTimeout(() => {
      value = value < MIN_SIZE ? MIN_SIZE : value > MAX_SIZE ? MAX_SIZE : value;
      setAndSaveSettings({ soundVolume: value });
      // need to set again in case size is out of bounds
      setVolume(value);
    }, 1000);
  };

  return (
    <BasePage title="Notifications">
      {/* Sound */}
      <BaseSection title="Sound">
        <FormControl variant="filled">
          <InputLabel htmlFor="soundName">Sound</InputLabel>
          <Select
            value={soundName}
            onChange={(e: any) => handleChange(e, setSoundName)}
            input={<FilledInput name="soundName" id="soundName" />}
          >
            {SOUNDS.map((sound: any) => (
              <MenuItem key={sound.name} value={sound.name}>
                {sound.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={classes.slider}>
          <Slider
            value={volume}
            min={MIN_SIZE}
            max={MAX_SIZE}
            step={1}
            onChange={(event: any, value: any) => updateVolume(value)}
          />
          <SliderMarkers
            minSize={MIN_SIZE}
            maxSize={MAX_SIZE}
            defaultSize={DEFAULT_SIZE}
          />
        </div>
        <FormControl variant="filled">
          <InputLabel htmlFor="playAudioOnGroupchat">
            On Groupchat Message
          </InputLabel>
          <Select
            value={playAudioOnGroupchat}
            onChange={(e: any) => handleChange(e, setPlayAudioOnGroupchat)}
            input={
              <FilledInput
                name="playAudioOnGroupchat"
                id="playAudioOnGroupchat"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="playAudioOnMentionMe">On Mention Me</InputLabel>
          <Select
            value={playAudioOnMentionMe}
            onChange={(e: any) => handleChange(e, setPlayAudioOnMentionMe)}
            input={
              <FilledInput
                name="playAudioOnMentionMe"
                id="playAudioOnMentionMe"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="playAudioOnChat">On Chat Message</InputLabel>
          <Select
            value={playAudioOnChat}
            onChange={(e: any) => handleChange(e, setPlayAudioOnChat)}
            input={<FilledInput name="playAudioOnChat" id="playAudioOnChat" />}
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
      </BaseSection>
      {/* Flash Frame */}
      <BaseSection title="Flash Frame">
        <FormControl variant="filled">
          <InputLabel htmlFor="flashFrameOnGroupchat">
            On Groupchat Message
          </InputLabel>
          <Select
            value={flashFrameOnGroupchat}
            onChange={(e: any) => handleChange(e, setFlashFrameOnGroupchat)}
            input={
              <FilledInput
                name="flashFrameOnGroupchat"
                id="flashFrameOnGroupchat"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="flashFrameOnMentionMe">
            On Mention Message
          </InputLabel>
          <Select
            value={flashFrameOnMentionMe}
            onChange={(e: any) => handleChange(e, setFlashFrameOnMentionMe)}
            input={
              <FilledInput
                name="flashFrameOnMentionMe"
                id="flashFrameOnMentionMe"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="flashFrameOnChat">On Chat Message</InputLabel>
          <Select
            value={flashFrameOnChat}
            onChange={(e: any) => handleChange(e, setFlashFrameOnChat)}
            input={
              <FilledInput name="flashFrameOnChat" id="flashFrameOnChat" />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
      </BaseSection>
      {/* Flash Menu Bar */}
      <BaseSection title="Flash Menu Bar">
        <div className={classes.split}>
          <FormControl variant="filled">
            <InputLabel htmlFor="flashMenuBarOnGroupchat">
              On Groupchat Message
            </InputLabel>
            <Select
              value={flashMenuBarOnGroupchat}
              onChange={(e: any) => handleChange(e, setFlashMenuBarOnGroupchat)}
              input={
                <FilledInput
                  name="flashMenuBarOnGroupchat"
                  id="flashMenuBarOnGroupchat"
                />
              }
            >
              <MenuItem value="always">Always</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="never">Never</MenuItem>
            </Select>
          </FormControl>
          {flashMenuBarOnGroupchat !== 'never' && (
            <FormControl variant="filled">
              <InputLabel htmlFor="flashMenuBarOnGroupchatFrequency">
                Frequency
              </InputLabel>
              <Select
                value={flashMenuBarOnGroupchatFrequency}
                onChange={(e: any) =>
                  handleChange(e, setFlashMenuBarOnGroupchatFrequency)
                }
                input={
                  <FilledInput
                    name="flashMenuBarOnGroupchatFrequency"
                    id="flashMenuBarOnGroupchatFrequency"
                  />
                }
              >
                <MenuItem value="once">Once</MenuItem>
                <MenuItem value="repeat">Repeat</MenuItem>
              </Select>
            </FormControl>
          )}
        </div>
        <div className={classes.split}>
          <FormControl variant="filled">
            <InputLabel htmlFor="flashMenuBarOnMentionMe">
              On Mention
            </InputLabel>
            <Select
              value={flashMenuBarOnMentionMe}
              onChange={(e: any) => handleChange(e, setFlashMenuBarOnMentionMe)}
              input={
                <FilledInput
                  name="flashMenuBarOnMentionMe"
                  id="flashMenuBarOnMentionMe"
                />
              }
            >
              <MenuItem value="always">Always</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="never">Never</MenuItem>
            </Select>
          </FormControl>
          {flashMenuBarOnMentionMe !== 'never' && (
            <FormControl variant="filled">
              <InputLabel htmlFor="flashMenuBarOnMentionMeFrequency">
                Frequency
              </InputLabel>
              <Select
                value={flashMenuBarOnMentionMeFrequency}
                onChange={(e: any) =>
                  handleChange(e, setFlashMenuBarOnMentionMeFrequency)
                }
                input={
                  <FilledInput
                    name="flashMenuBarOnMentionMeFrequency"
                    id="flashMenuBarOnMentionMeFrequency"
                  />
                }
              >
                <MenuItem value="once">Once</MenuItem>
                <MenuItem value="repeat">Repeat</MenuItem>
              </Select>
            </FormControl>
          )}
        </div>
        <div className={classes.split}>
          <FormControl variant="filled">
            <InputLabel htmlFor="flashMenuBarOnChat">
              On Chat Message
            </InputLabel>
            <Select
              value={flashMenuBarOnChat}
              onChange={(e: any) => handleChange(e, setFlashMenuBarOnChat)}
              input={
                <FilledInput
                  name="flashMenuBarOnChat"
                  id="flashMenuBarOnChat"
                />
              }
            >
              <MenuItem value="always">Always</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="never">Never</MenuItem>
            </Select>
          </FormControl>
          {flashMenuBarOnChat !== 'never' && (
            <FormControl variant="filled">
              <InputLabel htmlFor="flashMenuBarOnChatFrequency">
                Frequency
              </InputLabel>
              <Select
                value={flashMenuBarOnChatFrequency}
                onChange={(e: any) =>
                  handleChange(e, setFlashMenuBarOnChatFrequency)
                }
                input={
                  <FilledInput
                    name="flashMenuBarOnChatFrequency"
                    id="flashMenuBarOnChatFrequency"
                  />
                }
              >
                <MenuItem value="once">Once</MenuItem>
                <MenuItem value="repeat">Repeat</MenuItem>
              </Select>
            </FormControl>
          )}
        </div>
      </BaseSection>
      {/* System Notifications */}
      <BaseSection title="System Notifications">
        <FormControl variant="filled">
          <InputLabel htmlFor="systemNotificationOnGroupchat">
            On Groupchat Message
          </InputLabel>
          <Select
            value={systemNotificationOnGroupchat}
            onChange={(e: any) =>
              handleChange(e, setSystemNotificationOnGroupchat)
            }
            input={
              <FilledInput
                name="systemNotificationOnGroupchat"
                id="systemNotificationOnGroupchat"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="systemNotificationOnMentionMe">
            On Mention Message
          </InputLabel>
          <Select
            value={systemNotificationOnMentionMe}
            onChange={(e: any) =>
              handleChange(e, setSystemNotificationOnMentionMe)
            }
            input={
              <FilledInput
                name="systemNotificationOnMentionMe"
                id="systemNotificationOnMentionMe"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="systemNotificationOnChat">
            On Chat Message
          </InputLabel>
          <Select
            value={systemNotificationOnChat}
            onChange={(e: any) => handleChange(e, setSystemNotificationOnChat)}
            input={
              <FilledInput
                name="systemNotificationOnChat"
                id="systemNotificationOnChat"
              />
            }
          >
            <MenuItem value="always">Always</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="never">Never</MenuItem>
          </Select>
        </FormControl>
      </BaseSection>
    </BasePage>
  );
};

const useStyles = makeStyles((theme: any) => ({
  slider: {
    position: 'relative',
    paddingBottom: theme.spacing.unit * 2,
  },
  split: {
    display: 'flex',
    flexWrap: 'nowrap',
    '& > *': {
      width: '50%',
    },
  },
}));

export default NotificationSettings;
