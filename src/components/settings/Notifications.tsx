import * as React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

// material ui
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';

// actions
import { playAudio, SOUNDS } from '../../actions/notification';

// components
import BasePage from './BasePage';
import BaseSection from './BaseSection';

const NotificationSettings = (props: any) => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const [soundName, setSoundName] = useState(context.settings.soundName);
  const [playAudioOnGroupchat, setPlayAudioOnGroupchat] = useState(
    context.settings.playAudioOnGroupchat
  );
  const [playAudioOnChat, setPlayAudioOnChat] = useState(
    context.settings.playAudioOnChat
  );
  const [playAudioOnMentionMe, setPlayAudioOnMentionMe] = useState(
    context.settings.playAudioOnMentionMe
  );
  const [flashMenuBarOnGroupchat, setFlashMenuBarOnGroupchat] = useState(
    context.settings.flashMenuBarOnGroupchat
  );
  const [
    flashMenuBarOnGroupchatFrequency,
    setFlashMenuBarOnGroupchatFrequency,
  ] = useState(context.settings.flashMenuBarOnGroupchatFrequency);
  const [flashMenuBarOnMentionMe, setFlashMenuBarOnMentionMe] = useState(
    context.settings.flashMenuBarOnMentionMe
  );
  const [
    flashMenuBarOnMentionMeFrequency,
    setFlashMenuBarOnMentionMeFrequency,
  ] = useState(context.settings.flashMenuBarOnMentionMeFrequency);
  const [flashMenuBarOnChat, setFlashMenuBarOnChat] = useState(
    context.settings.flashMenuBarOnChat
  );
  const [
    flashMenuBarOnChatFrequency,
    setFlashMenuBarOnChatFrequency,
  ] = useState(context.settings.flashMenuBarOnChatFrequency);
  const [
    systemNotificationOnGroupchat,
    setSystemNotificationOnGroupchat,
  ] = useState(context.settings.systemNotificationOnGroupchat);
  const [
    systemNotificationOnMentionMe,
    setSystemNotificationOnMentionMe,
  ] = useState(context.settings.systemNotificationOnMentionMe);
  const [systemNotificationOnChat, setSystemNotificationOnChat] = useState(
    context.settings.systemNotificationOnChat
  );

  const handleChange = (e: any, action: any) => {
    // eslint-disable-next-line
    if (name === 'soundName') {
      playAudio(e.target.value);
    }
    action(e.target.value);
    actions.setSettings({ [e.target.name]: e.target.value });
  };

  return (
    <BasePage title="Notifications">
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
      </BaseSection>
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
      <BaseSection title="System Notifications">
        <FormControl variant="filled">
          <InputLabel htmlFor="systemNotificationOnGroupchat">
            On Groupchat
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
            On Mention
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
          <InputLabel htmlFor="systemNotificationOnChat">On Chat</InputLabel>
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
  split: {
    display: 'flex',
    flexWrap: 'nowrap',
    '& > *': {
      width: '50%',
    },
  },
}));

export default NotificationSettings;
