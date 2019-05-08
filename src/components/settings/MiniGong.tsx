import React, { FC } from 'react';

import { makeStyles } from '@material-ui/styles';

const MiniGong: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.titleBar} />
      <div className={classes.menuBar}>
        <div className={classes.menuBarLeft} />
        <div className={classes.menuBarRight} />
      </div>
      <div className={classes.chat}>
        <div className={classes.sidebarLeft}>
          <div className={classes.sidebarLeftTop} />
          <div className={classes.sidebarLeftBottom} />
        </div>
        <div className={classes.middle}>
          <div className={classes.messages}>
            <div className={classes.message}>
              <div className={classes.text} />
              <div className={classes.textShort} />
              <div className={classes.mentionOther} />
              <div className={classes.mentionOther} />
              <div className={classes.mentionMe} />
              <div className={classes.mentionOther} />
              <div className={classes.text} />
              <div className={classes.textShort} />
              <div className={classes.text} />
              <div className={classes.textShort} />
              <div className={classes.text} />
              <div className={classes.textShort} />
              <div className={classes.textShort} />
              <div className={classes.text} />
            </div>
          </div>
          <div className={classes.inputContainer}>
            <div className={classes.input} />
          </div>
        </div>
        <div className={classes.sidebarRight} />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: 190 - theme.spacing.unit * 3, // same as Theme.tsx left maxWidth
    height: '125px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 300ms ease',
    border: `1px solid ${theme.palette.primary.light}`,
  },
  titleBar: {
    backgroundColor: theme.palette.backgroundAccent,
    height: '10px',
  },
  menuBar: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  menuBarLeft: {
    width: '20%',
    maxWidth: '90px',
    height: '10px',
    backgroundColor: theme.palette.background.default,
    borderBottom: '1px solid',
    borderBottomColor: 'rgba(125, 125, 125, 0.4)',
  },
  menuBarRight: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid',
    borderBottomColor: 'rgba(125, 125, 125, 0.4)',
  },
  chat: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexGrow: 1,
  },
  sidebarLeft: {
    width: '20%',
    maxWidth: '90px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    backgroundColor: theme.palette.background.default,
  },
  sidebarLeftTop: {
    flexGrow: 1,
  },
  sidebarLeftBottom: {
    height: '10px',
    backgroundColor: theme.palette.backgroundAccent,
  },
  middle: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
  },
  messages: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'flex-end',
  },
  message: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: '5px',
  },
  mentionMe: {
    height: '2px',
    width: '5px',
    backgroundColor: theme.palette.secondary.main,
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  mentionOther: {
    height: '2px',
    width: '5px',
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  text: {
    height: '2px',
    width: '10px',
    backgroundColor: theme.palette.text.primary,
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  textShort: {
    height: '2px',
    width: '5px',
    backgroundColor: theme.palette.text.primary,
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  inputContainer: {
    borderTop: '1px solid',
    borderTopColor: 'rgba(125, 125, 125, 0.4)',
    height: '15px',
    padding: '3px',
    display: 'flex',
  },
  input: {
    borderRadius: '2px',
    backgroundColor: theme.palette.backgroundInput,
    flexGrow: 1,
  },
  sidebarRight: {
    flexShrink: 0,
    width: 'calc(20% * 0.9)',
    maxWidth: '90px * 0.9',
    backgroundColor: theme.palette.background.default,
  },
}));

export default MiniGong;
