import * as React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

// material ui
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// interfaces
import IMessageSend from '../../interfaces/IMessageSend';

// utils
import StringUtil from '../../utils/stringUtils';
import { usePrevious } from '../../utils/usePrevious';

import ListSelectors from './ListSelectors';

const Input = (props: any) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const classes = useStyles();
  const [context, actions] = useContext();

  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [listSelectorIndex, setListSelectorIndex] = useState(-1);

  const sendMessage = () => {
    if (text !== '') {
      if (text.startsWith('/nick')) {
        actions.setRoomNickname({
          jid: context.current.jid,
          currentNickname: context.current.myNickname,
          newNickname: text.substring(6),
        });
      } else {
        let to = context.current.jid;
        if (context.current.type === 'chat' && context.current.sessionJid) {
          to = context.current.sessionJid;
        }
        const messageSend: IMessageSend = {
          id: StringUtil.makeId(7),
          channelName: context.current.jid,
          type: context.current.type,
          to,
          from: context.settings.jid,
          body: text,
        };
        actions.sendMessage(messageSend);
      }
      setText('');
    }
  };

  const handleChange = (event: any) => {
    const newText = event.target.value;
    setText(newText);
  };

  const handleKeyDown = (event: any) => {
    const preventDefaultOn = ['Enter', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown'];
    if (listSelectorIndex !== -1 && preventDefaultOn.includes(event.key)) {
      event.preventDefault();
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleFocus = (event: any) => {
    setIsFocused(true);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    // TODO: Get this to work, need to get lists to show when input is focused again
    // setListSelectorIndex(-1);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleListSelector = (index: number) => {
    if (listSelectorIndex === index) {
      setListSelectorIndex(-1);
    } else {
      setListSelectorIndex(index);
    }
  };

  const prevCurrent = usePrevious(context.current);
  React.useEffect(() => {
    if (
      !prevCurrent ||
      (context.current && prevCurrent.jid !== context.current.jid)
    ) {
      // This must be in useEffect so the inputRef is initialized before calling
      // the block below.
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [context.current]);

  return (
    <React.Fragment>
      {context.current && (
        <div className={classes.root}>
          <ListSelectors
            text={text}
            setText={setText}
            current={context.current}
            selectorIndex={listSelectorIndex}
            setSelectorIndex={setListSelectorIndex}
            focusInput={focusInput}
          />
          <div
            className={[classes.input, isFocused ? classes.focused : ''].join(
              ' '
            )}
          >
            <TextField
              id="chat-textarea"
              label=""
              placeholder="@ for users and : for emojis"
              value={text}
              multiline={true}
              variant="outlined"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={classes.textField}
              InputProps={{ className: classes.textareaRoot }}
              rowsMax={8}
              inputRef={inputRef}
              disabled={
                !context.connection.isConnected ||
                (context.current.connectionError !== undefined &&
                  !context.current.isConnected)
              }
            />
            <div className={classes.inputRightInline}>
              <div
                className={[
                  classes.inputRightInlineIcon,
                  classes.channelUserIcon,
                ].join(' ')}
                onClick={() => toggleListSelector(1)}
              >
                <Typography>@</Typography>
              </div>
              <div
                onClick={() => toggleListSelector(0)}
                className={[
                  classes.inputRightInlineIcon,
                  classes.emojiIcon,
                ].join(' ')}
              >
                <span role="img" aria-label="smile emoji">
                  😄
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    position: 'relative',
    borderTop: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit * 2,
  },
  input: {
    display: 'flex',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  focused: {
    // not sure if i want any styles when focused
  },
  textField: {
    width: '100%',
    borderTopLeftRadius: theme.spacing.unit * 0.5,
    borderBottomLeftRadius: theme.spacing.unit * 0.5,
    borderColor: `${theme.palette.backgroundInput} !important`,
    backgroundColor: theme.palette.backgroundInput,
  },
  textareaRoot: {
    '& fieldset': {
      borderColor: `${theme.palette.backgroundInput} !important`,
    },
  },
  inputRightInline: {
    display: 'flex',
    alignItems: 'flex-start',
    borderTopRightRadius: theme.spacing.unit * 0.5,
    borderBottomRightRadius: theme.spacing.unit * 0.5,
    borderColor: `${theme.palette.backgroundInput} !important`,
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
}));

export default Input;
