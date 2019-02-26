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
    playAudioOnGroupchatMessage: this.props.settings
      .playAudioOnGroupchatMessage,
    playAudioOnChatMessage: this.props.settings.playAudioOnChatMessage,
    playAudioOnMentionMe: this.props.settings.playAudioOnMentionMe,
    flashMenuBarOnGroupchatMessage: this.props.settings
      .flashMenuBarOnGroupchatMessage,
    flashMenuBarOnGroupchatMessageFrequency: this.props.settings
      .flashMenuBarOnGroupchatMessageFrequency,
    flashMenuBarOnMentionMe: this.props.settings.flashMenuBarOnMentionMe,
    flashMenuBarOnMentionMeFrequency: this.props.settings
      .flashMenuBarOnMentionMeFrequency,
    flashMenuBarOnChatMessage: this.props.settings.flashMenuBarOnChatMessage,
    flashMenuBarOnChatMessageFrequency: this.props.settings
      .flashMenuBarOnChatMessageFrequency,
  };

  public render() {
    const { classes } = this.props;
    const {
      soundName,
      playAudioOnGroupchatMessage,
      playAudioOnChatMessage,
      playAudioOnMentionMe,
      flashMenuBarOnGroupchatMessage,
      flashMenuBarOnGroupchatMessageFrequency,
      flashMenuBarOnMentionMe,
      flashMenuBarOnMentionMeFrequency,
      flashMenuBarOnChatMessage,
      flashMenuBarOnChatMessageFrequency,
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
            <InputLabel htmlFor="playAudioOnGroupchatMessage">
              On Groupchat Message
            </InputLabel>
            <Select
              value={playAudioOnGroupchatMessage}
              onChange={this.handleChange}
              input={
                <FilledInput
                  name="playAudioOnGroupchatMessage"
                  id="playAudioOnGroupchatMessage"
                />
              }
            >
              <MenuItem value="always">Always</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="never">Never</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="filled">
            <InputLabel htmlFor="playAudioOnChatMessage">
              On Chat Message
            </InputLabel>
            <Select
              value={playAudioOnChatMessage}
              onChange={this.handleChange}
              input={
                <FilledInput
                  name="playAudioOnChatMessage"
                  id="playAudioOnChatMessage"
                />
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
              <InputLabel htmlFor="flashMenuBarOnGroupchatMessage">
                On Groupchat Message
              </InputLabel>
              <Select
                value={flashMenuBarOnGroupchatMessage}
                onChange={this.handleChange}
                input={
                  <FilledInput
                    name="flashMenuBarOnGroupchatMessage"
                    id="flashMenuBarOnGroupchatMessage"
                  />
                }
              >
                <MenuItem value="always">Always</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="never">Never</MenuItem>
              </Select>
            </FormControl>
            {flashMenuBarOnGroupchatMessage !== 'never' && (
              <FormControl variant="filled">
                <InputLabel htmlFor="flashMenuBarOnGroupchatMessageFrequency">
                  Frequency
                </InputLabel>
                <Select
                  value={flashMenuBarOnGroupchatMessageFrequency}
                  onChange={this.handleChange}
                  input={
                    <FilledInput
                      name="flashMenuBarOnGroupchatMessageFrequency"
                      id="flashMenuBarOnGroupchatMessageFrequency"
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
              <InputLabel htmlFor="flashMenuBarOnChatMessage">
                On Chat Message
              </InputLabel>
              <Select
                value={flashMenuBarOnChatMessage}
                onChange={this.handleChange}
                input={
                  <FilledInput
                    name="flashMenuBarOnChatMessage"
                    id="flashMenuBarOnChatMessage"
                  />
                }
              >
                <MenuItem value="always">Always</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="never">Never</MenuItem>
              </Select>
            </FormControl>
            {flashMenuBarOnChatMessage !== 'never' && (
              <FormControl variant="filled">
                <InputLabel htmlFor="flashMenuBarOnChatMessageFrequency">
                  Frequency
                </InputLabel>
                <Select
                  value={flashMenuBarOnChatMessageFrequency}
                  onChange={this.handleChange}
                  input={
                    <FilledInput
                      name="flashMenuBarOnChatMessageFrequency"
                      id="flashMenuBarOnChatMessageFrequency"
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
    this.props.setSettings({
      ...this.state,
      [name]: value,
    });
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
