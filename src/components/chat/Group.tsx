import React, { FC, useState } from 'react';
import { useContext } from '../../context';

import Badge from '@material-ui/core/Badge';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import AddIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

interface IProps {
  title: string;
  totalUnreadMessages: number;
  hasUnreadMentionMe: boolean;
  canAdd: boolean;
  children: any;
}

const Group: FC<IProps> = ({
  title,
  totalUnreadMessages,
  hasUnreadMentionMe,
  canAdd,
  children,
}: IProps) => {
  const classes = useStyles();
  const { setShowDiscover } = useContext()[1];
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickAdd = () => {
    setShowDiscover(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.heading}>
        <div className={classes.headingContent}>
          <Typography
            onClick={handleChange}
            className={[classes.expandIcon, isExpanded ? 'flipped' : ''].join(
              ' '
            )}
          >
            <ExpandLessIcon />
          </Typography>
          <Tooltip
            title={title}
            interactive={true}
            arrow={true}
            enterDelay={1000}
          >
            <Typography className={classes.title} onClick={handleChange}>
              {title}
            </Typography>
          </Tooltip>
          {totalUnreadMessages > 0 && (
            <Badge
              badgeContent={totalUnreadMessages}
              classes={{
                badge: [
                  classes.badge,
                  hasUnreadMentionMe ? classes.badgeFlash : '',
                ]
                  .join(' ')
                  .trim(),
              }}
              color="error"
            >
              <span />
            </Badge>
          )}
          {canAdd && (
            <IconButton className={classes.iconButton} onClick={handleClickAdd}>
              <AddIcon />
            </IconButton>
          )}
        </div>
      </div>
      <ExpansionPanel className={classes.panel} expanded={isExpanded}>
        <ExpansionPanelSummary className={classes.summary} />
        <ExpansionPanelDetails className={classes.details}>
          {/* Empty div is here incase the children is null, ExpansionPanelDetails expects something */}
          <div />
          {children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(1),
  },
  panel: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    marginTop: '0 !important',
    '&:before': {
      display: 'none',
    },
  },
  heading: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: 0,
    margin: 0,
  },
  headingContent: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '100%',
  },
  expandIcon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '3px',
    cursor: 'pointer',
    '& svg': {
      minHeight: '0 !important',
      padding: '0 !important',
      width: '15px',
      height: '15px',
    },
    '&.flipped': {
      transform: 'rotate(180deg)',
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    marginRight: '25px',
  },
  summary: {
    display: 'none',
  },
  details: {
    padding: theme.spacing(0.5),
    flexDirection: 'column',
  },
  iconButton: {
    padding: '0 !important',
    marginLeft: '5px',
  },
  badge: {
    width: '20px',
    marginRight: 8 + theme.spacing(0.5),
    borderRadius: '5px',
  },
  badgeFlash: {
    animation: '$flash 1s linear infinite',
  },
  '@keyframes flash': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.1,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

export default Group;
