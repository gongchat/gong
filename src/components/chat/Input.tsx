import React, { FC, useState, useRef, useEffect } from 'react';
import { useContext } from '../../context';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import ListSelectors from './ListSelectors';
import { emojiListSelectorIndex } from './ListSelectorEmojis';
import { userListSelectorIndex } from './ListSelectorUsers';
import IMessageSend from '../../interfaces/IMessageSend';
import IRoom from '../../interfaces/IRoom';
import IUser from '../../interfaces/IUser';
import StringUtil from '../../utils/stringUtils';
import { usePrevious } from '../../utils/usePrevious';

const Input: FC = () => {
  const classes = useStyles();
  const [
    { current, settings, connection },
    { sendMessage, setRoomNickname, setInputText },
  ] = useContext();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [listSelectorIndex, setListSelectorIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputText = useRef(current ? current.inputText : '');

  const send = () => {
    if (current) {
      if (text !== '') {
        if (current.type === 'groupchat' && text.startsWith('/nick')) {
          const room = current as IRoom;
          setRoomNickname({
            jid: current.jid,
            currentNickname: room.myNickname,
            newNickname: text.substring(6),
          });
        } else {
          const user = current as IUser;
          let to = current.jid;
          if (current.type === 'chat' && user.sessionJid) {
            to = user.sessionJid;
          }
          const messageSend: IMessageSend = {
            id: StringUtil.makeId(7),
            channelName: current.jid,
            type: current.type,
            to,
            from: settings.jid,
            body: text,
          };
          sendMessage(messageSend);
          setText('');
          inputText.current = '';
        }
        setText('');
      }
    }
  };

  const handleChange = (event: any) => {
    const newText = event.target.value;
    setText(newText);
    inputText.current = newText;
  };

  const handleKeyDown = (event: any) => {
    const preventDefaultOn = ['Enter', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown'];
    if (listSelectorIndex > 0 && preventDefaultOn.includes(event.key)) {
      event.preventDefault();
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    } else if (listSelectorIndex === -1) {
      setListSelectorIndex(0);
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
      setListSelectorIndex(0);
    } else {
      setListSelectorIndex(index);
    }
  };

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    // Handle prev channel
    if (
      prevCurrent &&
      current &&
      prevCurrent.jid !== current.jid &&
      prevCurrent.inputText !== inputText.current
    ) {
      setInputText(prevCurrent.jid, inputText.current);
      inputText.current = current ? current.inputText : '';
    }

    // Handle new channel
    if (
      (current && !prevCurrent) ||
      (current && prevCurrent.jid !== current.jid)
    ) {
      setText(current.inputText);
      // This must be in useEffect so the inputRef is initialized before calling
      // the block below.
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [current, prevCurrent, setInputText]);

  return (
    <>
      {current && (
        <div className={classes.root}>
          <ListSelectors
            text={text}
            setText={setText}
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
                !connection.isConnected ||
                (current.type === 'groupchat' &&
                  !(current as IRoom).isConnected)
              }
            />
            <div className={classes.inputRightInline}>
              <div
                className={[
                  classes.inputRightInlineIcon,
                  classes.channelUserIcon,
                ].join(' ')}
                onClick={() => toggleListSelector(userListSelectorIndex + 1)}
              >
                <Typography>@</Typography>
              </div>
              <div
                onClick={() => toggleListSelector(emojiListSelectorIndex + 1)}
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
    </>
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
