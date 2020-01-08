import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import sanitizeHtml from 'sanitize-html';
import marked from 'marked';

import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IMessage from '../../interfaces/IMessage';
import IMessageUrl from '../../interfaces/IMessageUrl';
import { EMOJIS, ASCII_EMOJI_MAP } from '../../utils/emojis';
import { ALLOWED_TAGS, ALLOWED_ATTRIBUTES } from '../../utils/sanitizeConfig';

interface IProps {
  message: IMessage;
  showTime: boolean;
  onMessageLoad: any;
  renderImages: boolean;
  renderVideos: boolean;
  renderGetYarn: boolean;
}

const Message: FC<IProps> = ({
  message,
  showTime,
  onMessageLoad,
  renderImages,
  renderVideos,
  renderGetYarn,
}: IProps) => {
  const classes = useStyles();

  const numberOfImages = useRef(
    message.urls.filter((url: IMessageUrl) => url.type === 'image').length
  );
  const numberOfLoadedImages = useRef(0);

  const [isMe, setIsMe] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [isBodyLoaded, setIsBodyLoaded] = useState(false);
  const [isImagesLoaded, setIsImagesLoaded] = useState(
    numberOfImages.current === 0
  );
  const { body } = message;

  const onMediaLoad = () => {
    numberOfLoadedImages.current++;
    if (numberOfLoadedImages.current >= numberOfImages.current) {
      setIsImagesLoaded(true);
    }
  };

  useLayoutEffect(() => {
    let formattedMessageBody = body
      ? sanitizeHtml(marked.inlineLexer(body, []), {
          allowedTags: ALLOWED_TAGS,
          allowedAttributes: ALLOWED_ATTRIBUTES,
        })
      : '';

    // replace any string emojis
    const matches = formattedMessageBody.match(/:([^:]*):/g);
    if (matches) {
      matches.forEach(element => {
        const emoji = EMOJIS[element.substring(1, element.length - 1)];
        if (emoji) {
          formattedMessageBody = formattedMessageBody.replace(element, emoji);
        }
      });
    }

    // replace characters with emojis
    ASCII_EMOJI_MAP.forEach(item => {
      formattedMessageBody = formattedMessageBody.replace(
        new RegExp(
          '(?<=^|\\s)' +
            item.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '(?=$|\\s)',
          'g'
        ),
        item.emoji
      );
    });

    setMessageBody(formattedMessageBody);
    setIsMe(body && body.startsWith('/me ') ? true : false);
    setIsBodyLoaded(true);
  }, [body]);

  useLayoutEffect(() => {
    if (isBodyLoaded && isImagesLoaded && onMessageLoad) {
      onMessageLoad();
    }
  }, [isBodyLoaded, isImagesLoaded, onMessageLoad]);

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
              __html: isMe ? `*${messageBody.substring(4)}*` : messageBody,
            }}
          />
        </span>
      </Typography>
      {message.urls && (
        <>
          {renderVideos &&
            message.urls
              .filter((url: IMessageUrl) => url.type === 'video')
              .map((url: IMessageUrl, index: number) => (
                <div key={index} className={classes.video}>
                  <ReactPlayer
                    url={url.url}
                    width={500}
                    height={282}
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
                        width={500}
                        height={370}
                        src={`https://getyarn.io/yarn-clip/embed/${values[2]}?autoplay=false`}
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
              .map((url: IMessageUrl, index: number) => {
                if (url.url.toLowerCase().endsWith('.gifv')) {
                  return (
                    <div key={index} className={classes.gifv}>
                      <video
                        preload="auto"
                        autoPlay={true}
                        loop={true}
                        width={500}
                      >
                        <source
                          src={url.url.replace('.gifv', '.mp4')}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className={classes.image}>
                      <img
                        alt="shared"
                        src={url.url}
                        onLoad={onMediaLoad}
                        onError={onMediaLoad}
                      />
                    </div>
                  );
                }
              })}
        </>
      )}
    </div>
  );
};

const useStyles: any = makeStyles((theme: any): any => ({
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
    paddingRight: theme.spacing(1),
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
    paddingLeft: theme.spacing(1),
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
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  getYarn: {
    flex: '0 1 100%',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    overflowX: 'auto',
    overflowY: 'hidden',
    '& iframe': {
      border: 'none',
    },
  },
  image: {
    position: 'relative',
    margin: theme.spacing(2),
    marginLeft: theme.spacing(8),
    maxWidth: 500,
    overflowX: 'auto',
    overflowY: 'hidden',
    '& img': {
      width: '100%',
    },
  },
  gifv: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(8),
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  me: {
    color: theme.palette.text.secondary,
  },
  copyOnly: {
    position: 'absolute',
    opacity: 0,
  },
}));

export default Message;
