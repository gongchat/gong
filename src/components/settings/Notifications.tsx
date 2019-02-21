import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setNotificationSettings } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// actions
import { SOUNDS } from 'src/actions/settings';

// interface
import IStates from 'src/interfaces/IStates';

class NotificationSettings extends React.Component<any, any> {
  public state = {
    soundName: this.props.settings.soundName,
    playAudioOnGroupchatMessage: this.props.settings
      .playAudioOnGroupchatMessage,
    playAudioOnChatMessage: this.props.settings.playAudioOnChatMessage,
    playAudioOnMentionMe: this.props.settings.playAudioOnMentionMe,
  };

  public render() {
    const { classes } = this.props;
    const {
      soundName,
      playAudioOnGroupchatMessage,
      playAudioOnChatMessage,
      playAudioOnMentionMe,
    } = this.state;

    return (
      <div className={classes.root}>
        <FormControl variant="filled" className={classes.formControl}>
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
        <FormControl variant="filled" className={classes.formControl}>
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
        <FormControl variant="filled" className={classes.formControl}>
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
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="playAudioOnMentionMe">On Mention Me</InputLabel>
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
      </div>
    );
  }

  private handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
    this.props.setNotificationSettings({
      soundName: name === 'soundName' ? value : this.state.soundName,
      playAudioOnGroupchatMessage:
        name === 'playAudioOnGroupchatMessage'
          ? value
          : this.state.playAudioOnGroupchatMessage,
      playAudioOnChatMessage:
        name === 'playAudioOnChatMessage'
          ? value
          : this.state.playAudioOnChatMessage,
      playAudioOnMentionMe:
        name === 'playAudioOnMentionMe'
          ? value
          : this.state.playAudioOnMentionMe,
    });
  };
}

const mapStateToProps = (states: IStates) => ({
  settings: states.gong.settings,
});

const mapDispatchToProps = {
  setNotificationSettings,
};

const styles: any = (theme: any) => ({
  root: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2,
    minWidth: '200px',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NotificationSettings));
