import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';

// components
import Input from './Input';
import Messages from './Messages';

class Chat extends React.Component<any, any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.chat}>
          <Messages />
        </div>
        <Input />
      </div>
    );
  }
}

const styles: any = (theme: any) => ({
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
});

export default withStyles(styles)(Chat);
