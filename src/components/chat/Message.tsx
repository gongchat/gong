import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';

// libs
import ReactPlayer from 'react-player';

class Message extends React.Component<any, any> {
  public render() {
    const { classes, message, showTime } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.text}>
          <Typography
            className={[
              classes.timestamp,
              showTime ? classes.timestamp : classes.timestampHide,
            ].join(' ')}
          >
            {message.timestamp.format('h:mm A')}
          </Typography>
          <Typography className={classes.message}>
            <span className={classes.user} style={{ color: message.color }}>
              {message.userNickname}
            </span>
            <span
              className={classes.body}
              dangerouslySetInnerHTML={{ __html: message.body }}
            />
          </Typography>
        </div>
        {message.videoUrls &&
          message.videoUrls.map((url: string, index: number) => (
            <div key={index} className={classes.player}>
              <ReactPlayer url={url} width={256} height={144} controls={true} />
            </div>
          ))}
      </div>
    );
  }
}

const styles: any = (theme: any) => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing.unit / 4,
    paddingBottom: theme.spacing.unit / 4,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    '&:hover p': {
      opacity: '1 !important',
    },
  },
  text: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
    width: '100%',
  },
  timestamp: {
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing.unit,
    fontSize: '0.7rem',
    opacity: 0.5,
    whiteSpace: 'nowrap',
    width: '50px',
    textAlign: 'right',
    flexShrink: 0,
  },
  timestampHide: {
    opacity: 0,
  },
  user: {
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  message: {
    width: `calc(100% - ${theme.spacing.unit + 50}px)`,
  },
  body: {
    paddingLeft: theme.spacing.unit,
    color: theme.palette.text.primary,
    overflowWrap: 'break-word',
    '& .mention': {
      backgroundColor: fade(theme.palette.primary.light, 0.1),
      color: theme.palette.primary.light,
    },
    '& .mention-me': {
      backgroundColor: fade(theme.palette.secondary.light, 0.2),
      color: theme.palette.secondary.light,
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  },
  player: {
    flex: '0 1 100%',
    padding: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 8,
  },
});

export default withStyles(styles)(Message);
