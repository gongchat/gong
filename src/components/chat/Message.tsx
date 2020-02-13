import React, { FC, useLayoutEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import sanitizeHtml from 'sanitize-html';
import marked from 'marked';

import Avatar from '@material-ui/core/Avatar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IChannel from '../../interfaces/IChannel';
import IMessage from '../../interfaces/IMessage';
import IMessageUrl from '../../interfaces/IMessageUrl';
import IRoom from '../../interfaces/IRoom';

import { EMOJIS, ASCII_EMOJI_MAP } from '../../utils/emojis';
import {
  getRegExpWithAt,
  getHtmlWithAt,
  getRegExpWithoutAt,
  getHtmlWithoutAt,
} from '../../utils/mentionUtils';
import { ALLOWED_TAGS, ALLOWED_ATTRIBUTES } from '../../utils/sanitizeConfig';
import { getAbbreviation } from '../../utils/stringUtils';

interface IProps {
  variant?: 'compact' | 'cozy';
  channel?: IChannel;
  message: IMessage;
  highlightWord?: string;
  showAvatar: boolean;
  showTime: boolean;
  onMessageLoad?: any;
  onMessageUnload?: any;
  onMediaLoad?: any;
  renderImages: boolean;
  renderVideos: boolean;
  renderGetYarn: boolean;
}

const Message: FC<IProps> = ({
  variant = 'compact',
  channel,
  message,
  highlightWord = '',
  showAvatar,
  showTime,
  onMessageLoad,
  onMessageUnload,
  onMediaLoad,
  renderImages,
  renderVideos,
  renderGetYarn,
}: IProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const [isMe, setIsMe] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [isBodyLoaded, setIsBodyLoaded] = useState(false);
  const { body, mentions } = message;

  const handleOnMediaLoad = () => {
    if (onMediaLoad) {
      onMediaLoad();
    }
  };

  const makeMarked = (body: string): string => {
    let parsedText = marked(body, { breaks: true, headerIds: false });
    // default messages should be inline
    if (parsedText.startsWith('<p>')) {
      parsedText = parsedText.substring(3, parsedText.length - 5);
    }
    return sanitizeHtml(parsedText, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
      // @ts-ignore: need to wait for @types to update
      disallowedTagsMode: 'escape',
    });
  };

  useLayoutEffect(() => {
    let formattedMessageBody = body;

    if (formattedMessageBody) {
      // mark it DOWN!!!!
      formattedMessageBody = makeMarked(formattedMessageBody);

      // replace users
      if (mentions && mentions.length > 0) {
        mentions.forEach((mention: string) => {
          const checkMentionMe2 =
            message.myNickname !== null &&
            message.myNickname !== undefined &&
            message.myNickname === mention;
          const checkMentionMe1 =
            (message.myNickname === null || message.myNickname === undefined) &&
            !!channel &&
            channel.type === 'groupchat' &&
            (channel as IRoom).myNickname === mention;
          const isMentioningMe =
            message.isMentioningMe && (checkMentionMe2 || checkMentionMe1);
          formattedMessageBody = formattedMessageBody.replace(
            getRegExpWithAt(mention),
            getHtmlWithAt(isMentioningMe, mention)
          );
          formattedMessageBody = formattedMessageBody.replace(
            getRegExpWithoutAt(mention),
            getHtmlWithoutAt(isMentioningMe, mention)
          );
        });
      }

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
    }

    setMessageBody(formattedMessageBody);
    setIsMe(body && body.startsWith('/me ') ? true : false);
    setIsBodyLoaded(true);
  }, [
    body,
    mentions,
    isMe,
    channel,
    message.isMentioningMe,
    message.myNickname,
  ]);

  useLayoutEffect(() => {
    // highlight any words
    if (highlightWord) {
      setMessageBody(formattedBody =>
        formattedBody.replace(
          new RegExp(highlightWord, 'ig'),
          (word: string) => `<span class="highlight">${word}</span>`
        )
      );
    }
  }, [highlightWord]);

  useLayoutEffect(() => {
    if (isBodyLoaded && onMessageLoad) {
      onMessageLoad();
    }
    return () => {
      if (isBodyLoaded && onMessageUnload) {
        onMessageUnload();
      }
    };
  }, [isBodyLoaded, onMessageLoad, onMessageUnload]);

  return (
    <div className={classes.root}>
      {variant === 'compact' ? (
        <Typography
          className={[classes.message, classes.compactMessage].join(' ')}
        >
          <span
            className={[
              'timestamp',
              [classes.timestamp, classes.compactTimestamp].join(' '),
              !showTime ? classes.timestampHide : '',
            ]
              .join(' ')
              .trim()}
          >
            <span className={classes.copyOnly}>[</span>
            {message.timestamp.format('h:mm A')}
            <span className={classes.copyOnly}>]</span>
          </span>
          <span className={[classes.text, classes.compactText].join(' ')}>
            <span className={classes.user} style={{ color: message.color }}>
              {message.userNickname}
              <span className={classes.copyOnly}>: </span>
            </span>
            <span
              className={[
                classes.body,
                classes.compactBody,
                isMe ? classes.me : '',
              ]
                .join(' ')
                .trim()}
              dangerouslySetInnerHTML={{
                __html: isMe ? `*${messageBody.substring(4)}*` : messageBody,
              }}
            />
          </span>
        </Typography>
      ) : (
        <div className={classes.cozy}>
          {showAvatar && (
            <div className={classes.avatar}>
              <Avatar>{getAbbreviation(message.userNickname)}</Avatar>
            </div>
          )}
          <div>
            <Typography>
              <span
                className={[classes.user, classes.cozyUser].join(' ')}
                style={{ color: message.color }}
              >
                {message.userNickname}
              </span>
              <span
                className={[
                  'timestamp',
                  [classes.timestamp, classes.cozyTimestamp].join(' '),
                  showTime ? classes.timestamp : classes.timestampHide,
                ].join(' ')}
              >
                {message.timestamp.calendar()}
              </span>
            </Typography>
            <Typography className={classes.message}>
              <span
                className={[classes.body, isMe ? classes.me : '']
                  .join(' ')
                  .trim()}
                dangerouslySetInnerHTML={{
                  __html: isMe ? `*${messageBody.substring(4)}*` : messageBody,
                }}
              />
            </Typography>
          </div>
        </div>
      )}
      {message.urls && (
        <>
          {renderVideos &&
            message.urls
              .filter((url: IMessageUrl) => url.type === 'video')
              .map((url: IMessageUrl, index: number) => (
                <div
                  key={message.id + '-video-' + index}
                  className={classes.media}
                >
                  <div className={classes.video}>
                    <ReactPlayer
                      url={url.url}
                      width={500}
                      height={282}
                      controls={true}
                    />
                  </div>
                </div>
              ))}
          {renderGetYarn &&
            message.urls
              .filter((url: IMessageUrl) => url.type === 'getyarn')
              .map((url: IMessageUrl, index: number) => {
                const values = url.url.split('/');
                if (values.length >= 3) {
                  return (
                    <div
                      key={message.id + '-getyarn-' + index}
                      className={classes.media}
                    >
                      <div className={classes.getYarn}>
                        <iframe
                          title="get yarn clip"
                          width={500}
                          height={370}
                          src={`https://getyarn.io/yarn-clip/embed/${values[2]}?autoplay=false`}
                        />
                      </div>
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
                    <div
                      key={message.id + '-gifv-' + index}
                      className={classes.media}
                    >
                      <div className={classes.gifv}>
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
                    </div>
                  );
                } else {
                  const isGiphy = url.url.includes('giphy.com');
                  return (
                    <div
                      key={message.id + '-image-' + index}
                      className={classes.media}
                    >
                      <div className={classes.image}>
                        <img
                          alt="shared"
                          src={url.url}
                          onLoad={handleOnMediaLoad}
                          onError={handleOnMediaLoad}
                        />
                        {isGiphy && theme.palette.type === 'dark' && (
                          <img
                            className={classes.giphyLogo}
                            src="/images/Poweredby_100px-Black_VertLogo.png"
                            alt="Giphy attribution"
                          />
                        )}
                        {isGiphy && theme.palette.type === 'light' && (
                          <img
                            className={classes.giphyLogo}
                            src="/images/Poweredby_100px-White_VertLogo.png"
                            alt="Giphy attribution"
                          />
                        )}
                      </div>
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
    '& blockquote': {
      borderLeft: `5px solid ${theme.palette.background.default}`,
      paddingLeft: theme.spacing(2),
    },
    '& pre': {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(),
    },
    '& code': {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(0.25, 0.5),
    },
  },
  cozy: {
    display: 'flex',
  },
  avatar: {
    padding: theme.spacing(0.5, 1, 0, 0),
  },
  message: {
    width: '100%',
    position: 'relative',
  },
  compactMessage: {
    display: 'table',
  },
  timestamp: {
    color: theme.palette.text.secondary,
    opacity: 0.5,
    whiteSpace: 'nowrap',
  },
  compactTimestamp: {
    fontSize: '0.7rem',
    paddingRight: theme.spacing(),
    display: 'table-cell',
    flexShrink: 0,
    textAlign: 'right',
    width: '50px',
  },
  cozyTimestamp: {
    fontSize: '0.8rem',
  },
  timestampHide: {
    opacity: 0,
  },
  user: {
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  cozyUser: {
    paddingRight: theme.spacing(),
  },
  text: {},
  compactText: {
    display: 'table-cell',
  },
  body: {
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
    '& .highlight': {
      backgroundColor: fade(theme.palette.secondary.light, 0.25),
      borderRadius: 3,
    },
  },
  compactBody: {
    paddingLeft: theme.spacing(1),
  },
  media: {},
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
  giphyLogo: {
    width: '75px !important',
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
