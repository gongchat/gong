import React from 'react';
import ReactPlayer from 'react-player';

import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IMessage from '../../interfaces/IMessage';
import IMessageUrl from '../../interfaces/IMessageUrl';

interface IProps {
  message: IMessage;
  showTime: boolean;
  onImageLoad: any;
  renderImages: boolean;
  renderVideos: boolean;
  renderGetYarn: boolean;
}

const Message: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  const {
    message,
    showTime,
    onImageLoad,
    renderImages,
    renderVideos,
    renderGetYarn,
  } = props;

  const isMe = message.body.startsWith('/me ');

  return (
    <div className={classes.root}>
      <Typography className={classes.message}>
        <span
          className={[
            'timestamp',
            classes.timestamp,
            showTime ? classes.timestamp : classes.timestampHide,
          ].join(' ')}
        >
          <span className={classes.copyOnly}>[</span>
          {message.timestamp.format('h:mm A')}
          <span className={classes.copyOnly}>]</span>
        </span>
        <span className={classes.text}>
          <span className={classes.user} style={{ color: message.color }}>
            {message.userNickname}
            <span className={classes.copyOnly}>: </span>
          </span>
          <span
            className={[classes.body, isMe && classes.me].join(' ')}
            dangerouslySetInnerHTML={{
              __html: isMe ? `*${message.body.substring(4)}*` : message.body,
            }}
          />
        </span>
      </Typography>
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
          {renderImages &&
            message.urls
              .filter((url: IMessageUrl) => url.type === 'image')
              .map((url: IMessageUrl, index: number) => (
                <div key={index} className={classes.image}>
                  <img alt="shared" src={url.url} onLoad={onImageLoad} />
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
