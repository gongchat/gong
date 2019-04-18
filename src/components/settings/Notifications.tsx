import * as React from 'react';
import { useState } from 'react';
import { useContext } from 'src/context';

// material ui
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/styles';

// actions
import { playAudio, SOUNDS } from 'src/actions/notification';

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

  const handleChange = (event: any, action: any) => {
    if (name === 'soundName') {
      playAudio(event.target.value);
    }
    action(event.target.value);
    actions.setSettings({ [event.target.name]: event.target.value });
  };

  return (
    <BasePage title="Notifications">
      <BaseSection title="Sound">
        <FormControl variant="filled">
          <InputLabel htmlFor="soundName">Sound</InputLabel>
          <Select
            value={soundName}
            onChange={(event: any) => handleChange(event, setSoundName)}
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
            onChange={(event: any) =>
              handleChange(event, setPlayAudioOnGroupchat)
            }
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
            onChange={(event: any) => handleChange(event, setPlayAudioOnChat)}
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
            onChange={(event: any) =>
              handleChange(event, setPlayAudioOnMentionMe)
            }
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
              onChange={(event: any) =>
                handleChange(event, setFlashMenuBarOnGroupchat)
              }
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
                onChange={(event: any) =>
                  handleChange(event, setFlashMenuBarOnGroupchatFrequency)
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
              onChange={(event: any) =>
                handleChange(event, setFlashMenuBarOnMentionMe)
              }
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
                onChange={(event: any) =>
                  handleChange(event, setFlashMenuBarOnMentionMeFrequency)
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
              onChange={(event: any) =>
                handleChange(event, setFlashMenuBarOnChat)
              }
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
                onChange={(event: any) =>
                  handleChange(event, setFlashMenuBarOnChatFrequency)
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
            onChange={(event: any) =>
              handleChange(event, setSystemNotificationOnGroupchat)
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
            onChange={(event: any) =>
              handleChange(event, setSystemNotificationOnMentionMe)
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
            onChange={(event: any) =>
              handleChange(event, setSystemNotificationOnChat)
            }
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
