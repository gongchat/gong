import React, { FC } from 'react';

import { makeStyles } from '@material-ui/styles';

import Input from './Input';
import Messages from './Messages';

const Chat: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.chat}>
        <Messages />
      </div>
      <Input />
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chat: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
}));

export default Chat;
