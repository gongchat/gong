import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { sendMessage } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
// import AddIcon from '@material-ui/icons/Add';

// libs
import * as MarkdownIt from 'markdown-it';
const markdownItEmoji = require('markdown-it-emoji'); // tslint:disable-line

// interfaces
import IChannelUser from 'src/interfaces/IChannelUser';
import IMessageSend from 'src/interfaces/IMessageSend';
import IStates from 'src/interfaces/IStates';

// utils
import Emojis, { emojis as emojisObj } from 'src/utils/emojis';

// TODO: Break up texthelpers(autocomplete) into smaller component

class Input extends React.Component<any, any> {
  public state = {
    text: '',
    isFocused: false,
    lastWord: '',
    emojis: Emojis,
    emojisIndex: -1,
    channelUsers: [],
    channelUsersIndex: -1,
    enabled: true,
  };

  private inputRef: React.RefObject<HTMLInputElement>;
  private emojisRef: React.RefObject<HTMLDivElement>;
  private channelUsersRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.inputRef = React.createRef<HTMLInputElement>();
    this.emojisRef = React.createRef<HTMLDivElement>();
    this.channelUsersRef = React.createRef<HTMLDivElement>();
  }

  public componentWillReceiveProps(nextProps: any) {
    this.setState({ enabled: nextProps.connection.isConnected });
  }

  public render() {
    const { classes } = this.props;
    const {
      text,
      isFocused,
      lastWord,
      emojis,
      emojisIndex,
      channelUsers,
      channelUsersIndex,
      enabled,
    } = this.state;
    const markdownIt = new MarkdownIt();
    const emojiIcon: string = markdownIt
      .use(markdownItEmoji)
      .renderInline(':smile:');

    // only show if we know who we are sending to
    if (!this.props.current) {
      return null;
    }

    return (
      <div className={classes.root}>
        {emojisIndex !== -1 && (
          <div className={classes.autocomplete}>
            <Typography className={classes.search}>
              <span className={classes.title}>EMOJI MATCHING</span>
              <span className={classes.term}>{lastWord}</span>
            </Typography>
            <div className={classes.list} ref={this.emojisRef}>
              {emojis &&
                emojis.map((emoji: any, index: number) => (
                  <div
                    key={emoji.key}
                    className={[
                      classes.listItem,
                      emojisIndex === index ? classes.current : '',
                    ].join(' ')}
                    onClick={() => this.handleEmojiOnClick(index)}
                  >
                    <span className={classes.icon}>{emoji.value}</span>
                    <Typography className={classes.key}>
                      :{emoji.key}:
                    </Typography>
                  </div>
                ))}
            </div>
          </div>
        )}
        {channelUsersIndex !== -1 && (
          <div className={classes.autocomplete}>
            <Typography className={classes.search}>
              <span className={classes.title}>USERS MATCHING</span>
              <span className={classes.term}>{lastWord}</span>
            </Typography>
            <div className={classes.list} ref={this.channelUsersRef}>
              {channelUsers &&
                channelUsers.map((user: IChannelUser, index: number) => (
                  <div
                    key={user.nickname}
                    className={[
                      classes.listItem,
                      channelUsersIndex === index ? classes.current : '',
                    ].join(' ')}
                    onClick={() => this.handleChannelUserOnClick(index)}
                  >
                    <Typography className={classes.key}>
                      @{user.nickname}
                    </Typography>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div
          className={[classes.input, isFocused && classes.focused].join(' ')}
        >
          <TextField
            id="chat-textarea"
            label=""
            placeholder="@ for users and : for emojis"
            value={text}
            multiline={true}
            variant="outlined"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            className={classes.textField}
            InputProps={{ className: classes.textareaRoot }}
            rowsMax={8}
            inputRef={this.inputRef}
            disabled={!enabled}
            // inputProps={{ style: { maxHeight: 19 * 24 } }}
            // inputProps={{ style: { minHeight: 19 * 3 } }}
          />
          <div className={classes.inputRightInline}>
            <div
              className={[
                classes.inputRightInlineIcon,
                classes.channelUserIcon,
              ].join(' ')}
              onClick={this.toggleChannelUsers}
            >
              <Typography>@</Typography>
            </div>
            <div
              onClick={this.toggleEmojis}
              className={[classes.inputRightInlineIcon, classes.emojiIcon].join(
                ' '
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: emojiIcon }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private sendMessage = () => {
    this.setState({ text: '', lastWord: 0 });
    const messageSend: IMessageSend = {
      type: this.props.current.type,
      to: this.props.current.jid,
      from: this.props.from,
      body: this.state.text,
    };
    this.props.sendMessage(messageSend);
  };

  //
  // Input
  //
  private handleChange = (event: any) => {
    const text = event.target.value;
    this.setState({ text });

    // TODO: refactor

    // check for emojis
    const emojiCommandIndex = text.lastIndexOf(':');
    const emojiCommandPrevIndex = text
      .substring(0, emojiCommandIndex)
      .lastIndexOf(':');
    if (
      emojiCommandIndex !== -1 &&
      !emojisObj[text.substring(emojiCommandPrevIndex + 1, emojiCommandIndex)]
    ) {
      const emojiWord = text.substring(emojiCommandIndex);
      const term = emojiWord.substring(1);
      const matchingEmojis = Emojis.filter(
        (emoji: any) => emoji.key.startsWith(term) || emoji.key === term
      );
      if (matchingEmojis.length > 0) {
        this.setState({
          lastWord: term,
          channelUsersIndex: -1,
          emojisIndex: 0,
          emojis:
            term.length === 0
              ? Emojis.map((x: any) => ({ x, r: Math.random() }))
                  .sort((a: any, b: any) => a.r - b.r)
                  .map((a: any) => a.x)
                  .slice(0, 20)
              : matchingEmojis,
        });
      } else {
        this.setState({ emojisIndex: -1 });
      }
    } else {
      this.setState({ emojisIndex: -1 });
    }

    // check for users
    if (this.props.current.type === 'groupchat') {
      const channelCommandIndex = text.lastIndexOf('@');
      const channelUserWord = text.substring(channelCommandIndex);
      if (channelCommandIndex !== -1 && channelUserWord) {
        const term = channelUserWord.substring(1);
        const matchingChannelUsers = this.props.current.users.filter(
          (user: IChannelUser) =>
            user.nickname.toLowerCase().startsWith(term.toLowerCase()) ||
            user.nickname.toLowerCase() === term.toLowerCase()
        );
        if (matchingChannelUsers.length > 0) {
          this.setState({
            lastWord: term,
            emojisIndex: -1,
            channelUsersIndex: 0,
            channelUsers: matchingChannelUsers,
          });
        } else {
          this.setState({ channelUsersIndex: -1 });
        }
      } else {
        this.setState({ channelUsersIndex: -1 });
      }
    }
  };

  private handleKeyDown = (event: any) => {
    const key = event.key;

    let isSendMessage = true;
    let indexProp = '';
    let index = -1;
    let maxIndex = -1;
    let newText: string = this.state.text;
    let ref: any = {};

    // TODO: refactor
    if (this.state.emojisIndex !== -1) {
      indexProp = 'emojisIndex';
      index = this.state.emojisIndex;
      maxIndex = this.state.emojis.length - 1;
      if (this.state.emojis[index]) {
        newText = `${newText.substring(
          0,
          newText.length === 0 ? 0 : newText.lastIndexOf(' ') + 1
        )}:${this.state.emojis[index].key}: `;
      }
      ref = this.emojisRef;
      isSendMessage = false;
    } else if (this.state.channelUsersIndex !== -1) {
      indexProp = 'channelUsersIndex';
      index = this.state.channelUsersIndex;
      maxIndex = this.state.channelUsers.length - 1;
      if (this.state.channelUsers[index]) {
        newText = `${newText.substring(
          0,
          newText.length === 0 ? 0 : newText.lastIndexOf('@')
        )}@${(this.state.channelUsers[index] as IChannelUser).nickname} `;
      }
      ref = this.channelUsersRef;
      isSendMessage = false;
    } else if (key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }

    if (!isSendMessage) {
      let itemHeight = 0;
      let scrollTop = 0; // position of the top of the viewable height
      let offsetHeight = 0; // viewable height
      let scrollHeight = 0; // full height of div
      let newIndex = 0;

      if (ref.current) {
        itemHeight = ref.current.children[0]
          ? ref.current.children[0].scrollHeight
          : 0;
        scrollTop = ref.current.scrollTop;
        offsetHeight = ref.current.offsetHeight;
        scrollHeight = ref.current.scrollHeight;
      }

      switch (key) {
        case 'ArrowUp':
          event.preventDefault();
          newIndex = index > 0 ? index - 1 : maxIndex;
          if (ref.current && scrollTop > itemHeight * newIndex) {
            ref.current.scrollTop = itemHeight * newIndex;
          } else if (newIndex === maxIndex) {
            ref.current.scrollTop = scrollHeight;
          }
          this.setState({ [indexProp]: newIndex });
          break;
        case 'ArrowDown':
          event.preventDefault();
          newIndex = index < maxIndex ? index + 1 : 0;
          if (
            ref.current &&
            scrollTop + offsetHeight < itemHeight * (newIndex + 1)
          ) {
            ref.current.scrollTop = itemHeight * (newIndex + 1) - offsetHeight;
          } else if (newIndex === 0) {
            ref.current.scrollTop = 0;
          }
          this.setState({ [indexProp]: newIndex });
          break;
        case 'Enter':
          event.preventDefault();
          this.setState({ [indexProp]: -1, text: newText });
          break;
        case 'Escape':
          event.preventDefault();
          this.setState({ [indexProp]: -1 });
          break;
      }
    }
  };

  private handleFocus = (event: any) => {
    this.setState({ isFocused: true });
  };

  private handleBlur = (event: any) => {
    this.setState({ isFocused: false });
  };

  //
  // Autocomplete
  //
  private handleEmojiOnClick = (index: number) => {
    const { text, emojis } = this.state;
    const emoji: any = emojis[index];

    this.setState({
      emojisIndex: -1,
      lastWord: '',
      text: `${text.substring(
        0,
        text.length === 0
          ? 0
          : text.lastIndexOf(' ') === -1
          ? text.length + 1
          : text.lastIndexOf(' ') + 1
      )}:${emoji.key}: `,
    });

    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  private handleChannelUserOnClick = (index: number) => {
    const { text, channelUsers } = this.state;
    const user: any = channelUsers[index];

    this.setState({
      channelUsersIndex: -1,
      lastWord: '',
      text: `${text.substring(
        0,
        text.length === 0
          ? 0
          : text.lastIndexOf(' ') === -1
          ? test.length
          : text.lastIndexOf(' ') + 1
      )}@${user.nickname} `,
    });

    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  private toggleEmojis = () => {
    const { emojisIndex } = this.state;
    if (emojisIndex >= 0) {
      this.setState({ emojisIndex: -1 });
    } else {
      this.setState({
        channelUsersIndex: -1,
        lastWord: '',
        emojisIndex: 0,
        emojis: Emojis.map((x: any) => ({ x, r: Math.random() }))
          .sort((a: any, b: any) => a.r - b.r)
          .map((a: any) => a.x)
          .slice(0, 20),
      });
    }
  };

  private toggleChannelUsers = () => {
    const { channelUsersIndex } = this.state;
    if (channelUsersIndex >= 0) {
      this.setState({ channelUsersIndex: -1 });
    } else {
      this.setState({
        emojisIndex: -1,
        lastWord: '',
        channelUsersIndex: 0,
        channelUsers: this.props.current.users,
      });
    }
  };
}

const mapStateToProps = (states: IStates) => {
  return {
    connection: states.gong.connection,
    current: states.gong.current,
    from: states.gong.settings.jid,
  };
};

const mapDispatchToProps = {
  sendMessage,
};

const styles: any = (theme: any) => ({
  root: {
    position: 'relative',
    borderTop: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit * 2,
  },
  input: {
    display: 'flex',
    flexWrap: 'nowrap',
    position: 'relative',
    borderColor: theme.palette.backgroundInput,
    transition:
      'padding-left 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,border-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,border-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    '&:hover': {
      // borderColor: 'white',
    },
  },
  focused: {
    // borderColor: 'white',
  },
  add: {
    display: 'flex',
    alignItems: ' flex-end',
    position: 'relative',
    border: '1px solid transparent',
    borderColor: 'inherit',
    borderTopLeftRadius: theme.spacing.unit * 0.5,
    borderBottomLeftRadius: theme.spacing.unit * 0.5,
    '& p': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '54px',
      width: '54px',
    },
  },
  textField: {
    width: '100%',
    borderTop: '1px solid transparent',
    borderLeft: '1px solid transparent',
    borderBottom: '1px solid transparent',
    borderTopLeftRadius: theme.spacing.unit * 0.5,
    borderBottomLeftRadius: theme.spacing.unit * 0.5,
    borderColor: 'inherit !important',
    backgroundColor: theme.palette.backgroundInput,
  },
  textareaRoot: {
    '& textarea': {
      overflowY: 'hidden',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  inputRightInline: {
    display: 'flex',
    alignItems: 'flex-start',
    borderTopRightRadius: theme.spacing.unit * 0.5,
    borderBottomRightRadius: theme.spacing.unit * 0.5,
    border: '1px solid transparent',
    borderLeft: 'none',
    borderColor: 'inherit',
    backgroundColor: theme.palette.backgroundInput,
  },
  inputRightInlineIcon: {
    padding: 0,
    marginLeft: '4px',
    marginRight: '8px',
    fontSize: '19px',
    lineHeight: '19px',
    height: '54px',
    display: 'flex',
    alignItems: 'center',
  },
  channelUserIcon: {
    cursor: 'pointer',
  },
  emojiIcon: {
    cursor: 'pointer',
  },
  // autocomplete styles
  term: {
    marginLeft: theme.spacing.unit,
  },
  current: {
    backgroundColor: theme.palette.action.hover,
  },
  autocomplete: {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    background: theme.palette.background.default,
    padding: theme.spacing.unit,
    position: 'absolute',
    bottom: `calc(100% - ${theme.spacing.unit * 2}px)`,
    left: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  list: {
    marginTop: theme.spacing.unit,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  listItem: {
    cursor: 'pointer',
    display: 'flex',
    flexWrap: 'nowrap',
    padding: theme.spacing.unit / 2,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  icon: {
    marginRight: theme.spacing.unit,
    width: theme.spacing.unit * 2,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
