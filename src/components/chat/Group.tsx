import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setShowDiscover } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

class Group extends React.Component<any, any> {
  public state = {
    isExpanded: true,
  };

  constructor(props: any) {
    super(props);
  }

  public render() {
    const {
      classes,
      canAdd,
      children,
      totalUnreadMessages,
      hasUnreadMentionMe,
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.heading}>
          <div className={classes.headingContent}>
            <Typography
              onClick={this.handleChange}
              className={[classes.expandIcon, isExpanded ? 'flipped' : ''].join(
                ' '
              )}
            >
              <ExpandLessIcon />
            </Typography>
            <Typography className={classes.title} onClick={this.handleChange}>
              {this.props.title}
            </Typography>
            {totalUnreadMessages > 0 && (
              <Badge
                badgeContent={totalUnreadMessages}
                classes={{
                  badge: [
                    classes.badge,
                    hasUnreadMentionMe ? classes.badgeFlash : '',
                  ].join(' '),
                }}
                color="error"
              >
                <span />
              </Badge>
            )}
            {canAdd && (
              <IconButton
                className={classes.iconButton}
                onClick={this.handleClickAdd}
              >
                <AddIcon />
              </IconButton>
            )}
          </div>
        </div>
        <ExpansionPanel className={classes.panel} expanded={isExpanded}>
          <ExpansionPanelDetails className={classes.details}>
            {/* Empty div is here incase the children is null, ExpansionPanelDetails expects something */}
            <div />
            {children}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }

  private handleChange = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  private handleClickAdd = () => {
    this.props.setShowDiscover(true);
  };
}

const mapDispatchToProps = {
  setShowDiscover,
};

const styles: any = (theme: any) => ({
  root: {
    padding: theme.spacing.unit,
  },
  panel: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    marginTop: 0,
    '&:before': {
      display: 'none',
    },
  },
  heading: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 0.5,
    paddingRight: theme.spacing.unit,
    paddingLeft: 0,
    margin: '0',
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
  details: {
    padding: theme.spacing.unit * 0.5,
    flexDirection: 'column',
  },
  iconButton: {
    padding: '0 !important',
    marginLeft: '5px',
  },
  badge: {
    marginRight: theme.spacing.unit,
    borderRadius: '5px',
  },
  badgeFlash: {
    animation: 'flash 1s linear infinite',
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
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Group));
