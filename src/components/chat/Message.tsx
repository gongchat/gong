import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';

// libs
import ReactPlayer from 'react-player';

// interfaces
import IMessageUrl from 'src/interfaces/IMessageUrl';

class Message extends React.Component<any, any> {
  public render() {
    const {
      classes,
      message,
      showTime,
      renderVideos,
      renderGetYarn,
      renderImages,
    } = this.props;

    const isMe = message.body.startsWith('/me ');

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
              className={[classes.body, isMe && classes.me].join(' ')}
              dangerouslySetInnerHTML={{
                __html: isMe ? `*${message.body.substring(4)}*` : message.body,
              }}
            />
          </Typography>
        </div>
        {message.urls && (
          <React.Fragment>
            {renderVideos &&
              message.urls
                .filter((url: IMessageUrl) => url.type === 'video')
                .map((url: IMessageUrl, index: number) => (
                  <div key={index} className={classes.video}>
                    <ReactPlayer
                      url={url.url}
                      width={300}
                      height={170}
                      controls={true}
                    />
                  </div>
                ))}
            {renderGetYarn &&
              message.urls
                .filter((url: IMessageUrl) => url.type === 'getyarn')
                .map((url: IMessageUrl, index: number) => {
                  const values = url.url.split('/');
                  if (values.length >= 3) {
                    return (
                      <div key={index} className={classes.getYarn}>
                        <iframe
                          width={300}
                          height={185}
                          src={`https://getyarn.io/yarn-clip/embed/${
                            values[2]
                          }?autoplay=false`}
                        />
                      </div>
                    );
                  } else {
                    return '';
                  }
                })}
            {renderImages &&
              message.urls
                .filter((url: IMessageUrl) => url.type === 'image')
                .map((url: IMessageUrl, index: number) => (
                  <div key={index} className={classes.image}>
                    <img src={url.url} />
                  </div>
                ))}
          </React.Fragment>
        )}
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
  video: {
    flex: '0 1 100%',
    padding: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 8,
  },
  getYarn: {
    flex: '0 1 100%',
    padding: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 8,
    overflow: 'hidden',
    '& iframe': {
      border: 'none',
    },
  },
  image: {
    margin: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 8,
    width: 300,
    backgroundColor: theme.palette.background.default,
    '& img': {
      maxWidth: '100%',
    },
  },
  me: {
    color: theme.palette.text.secondary,
  },
});

export default withStyles(styles)(Message);
