import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setSettings } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// actions
import Notification, { SOUNDS } from 'src/actions/notification';

// interface
import IStates from 'src/interfaces/IStates';

// components
import BasePage from './BasePage';
import BaseSection from './BaseSection';

class NotificationSettings extends React.Component<any, any> {
  public state = {
    soundName: this.props.settings.soundName,
    playAudioOnGroupchat: this.props.settings.playAudioOnGroupchat,
    playAudioOnChat: this.props.settings.playAudioOnChat,
    playAudioOnMentionMe: this.props.settings.playAudioOnMentionMe,
    flashMenuBarOnGroupchat: this.props.settings.flashMenuBarOnGroupchat,
    flashMenuBarOnGroupchatFrequency: this.props.settings
      .flashMenuBarOnGroupchatFrequency,
    flashMenuBarOnMentionMe: this.props.settings.flashMenuBarOnMentionMe,
    flashMenuBarOnMentionMeFrequency: this.props.settings
      .flashMenuBarOnMentionMeFrequency,
    flashMenuBarOnChat: this.props.settings.flashMenuBarOnChat,
    flashMenuBarOnChatFrequency: this.props.settings
      .flashMenuBarOnChatFrequency,
    systemNotificationOnGroupchat: this.props.settings
      .systemNotificationOnGroupchat,
    systemNotificationOnMentionMe: this.props.settings
      .systemNotificationOnMentionMe,
    systemNotificationOnChat: this.props.settings.systemNotificationOnChat,
  };

  public render() {
    const { classes } = this.props;
    const {
      soundName,
      playAudioOnGroupchat,
      playAudioOnChat,
      playAudioOnMentionMe,
      flashMenuBarOnGroupchat,
      flashMenuBarOnGroupchatFrequency,
      flashMenuBarOnMentionMe,
      flashMenuBarOnMentionMeFrequency,
      flashMenuBarOnChat,
      flashMenuBarOnChatFrequency,
      systemNotificationOnGroupchat,
      systemNotificationOnMentionMe,
      systemNotificationOnChat,
    } = this.state;

    return (
      <BasePage title="Notifications">
        <BaseSection title="Sound">
          <FormControl variant="filled">
            <InputLabel htmlFor="soundName">Sound</InputLabel>
            <Select
              value={soundName}
              onChange={this.handleChange}
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
              input={
                <FilledInput name="playAudioOnChat" id="playAudioOnChat" />
              }
            >
              <MenuItem value="always">Always</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="never">Never</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="filled">
            <InputLabel htmlFor="playAudioOnMentionMe">
              On Mention Me
            </InputLabel>
            <Select
              value={playAudioOnMentionMe}
              onChange={this.handleChange}
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
        <BaseSection title="Display">
          <div className={classes.split}>
            <FormControl variant="filled">
              <InputLabel htmlFor="flashMenuBarOnGroupchat">
                On Groupchat Message
              </InputLabel>
              <Select
                value={flashMenuBarOnGroupchat}
                onChange={this.handleChange}
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
                  onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                  onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                  onChange={this.handleChange}
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
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
  }

  private handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'soundName') {
      Notification.playAudio(value);
    }
    this.setState({ [name]: value });
    this.props.setSettings({ [name]: value });
  };
}

const mapStateToProps = (states: IStates) => ({
  settings: states.gong.settings,
});

const mapDispatchToProps = {
  setSettings,
};

const styles: any = (theme: any) => ({
  split: {
    display: 'flex',
    flexWrap: 'nowrap',
    '& > *': {
      width: '50%',
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NotificationSettings));
