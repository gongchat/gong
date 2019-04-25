import * as React from 'react';

// material ui
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

// libs
import ReactPlayer from 'react-player';

// interfaces
import IMessageUrl from '../../interfaces/IMessageUrl';

const Message = (props: any) => {
  const classes = useStyles();
  const isMe = props.message.body.startsWith('/me ');

  return (
    <div className={classes.root}>
      <Typography className={classes.message}>
        <span
          className={[
            'timestamp',
            classes.timestamp,
            props.showTime ? classes.timestamp : classes.timestampHide,
          ].join(' ')}
        >
          <span className={classes.copyOnly}>[</span>
          {props.message.timestamp.format('h:mm A')}
          <span className={classes.copyOnly}>]</span>
        </span>
        <span className={classes.text}>
          <span className={classes.user} style={{ color: props.message.color }}>
            {props.message.userNickname}
            <span className={classes.copyOnly}>: </span>
          </span>
          <span
            className={[classes.body, isMe && classes.me].join(' ')}
            dangerouslySetInnerHTML={{
              __html: isMe
                ? `*${props.message.body.substring(4)}*`
                : props.message.body,
            }}
          />
        </span>
      </Typography>
      {props.message.urls && (
        <React.Fragment>
          {props.renderVideos &&
            props.message.urls
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
          {props.renderGetYarn &&
            props.message.urls
              .filter((url: IMessageUrl) => url.type === 'getyarn')
              .map((url: IMessageUrl, index: number) => {
                const values = url.url.split('/');
                if (values.length >= 3) {
                  return (
                    <div key={index} className={classes.getYarn}>
                      <iframe
                        title="get yarn clip"
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
          {props.renderImages &&
            props.message.urls
              .filter((url: IMessageUrl) => url.type === 'image')
              .map((url: IMessageUrl, index: number) => (
                <div key={index} className={classes.image}>
                  <img alt="shared" src={url.url} onLoad={props.onImageLoad} />
                </div>
              ))}
        </React.Fragment>
      )}
    </div>
  );
};

const useStyles = makeStyles(
  (theme: any): any => ({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      '&:hover .timestamp': {
        opacity: '1 !important',
      },
    },
    message: {
      width: '100%',
      position: 'relative',
      display: 'table',
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
      display: 'table-cell',
    },
    timestampHide: {
      opacity: 0,
    },
    user: {
      whiteSpace: 'nowrap',
      fontWeight: 'bold',
    },
    text: {
      display: 'table-cell',
    },
    body: {
      paddingLeft: theme.spacing.unit,
      color: theme.palette.text.primary,
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
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
      '& img': {
        width: '100%',
      },
    },
    me: {
      color: theme.palette.text.secondary,
    },
    copyOnly: {
      position: 'absolute',
      opacity: 0,
    },
  })
);

export default Message;
