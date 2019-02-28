import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

// interfaces
import IStates from 'src/interfaces/IStates';

// components
import Status from './Status';

class ToolBar extends React.Component<any, any> {
  public render() {
    const { classes, domain, current } = this.props;
    let chatName = '';
    let chatStatus = '';

    if (current) {
      switch (current.type) {
        case 'groupchat':
          chatName =
            current.name.startsWith('#') && current.name.length > 1
              ? current.name.substring(1)
              : current.name;
          chatStatus = current.isConnected ? 'online' : 'offline';
          break;
        case 'chat':
          chatName =
            current.vCard && current.vCard.fullName
              ? current.vCard.fullName
              : current.name;
          chatStatus = current.status;
          break;
      }
    }

    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <Typography>{domain}</Typography>
        </div>
        <div className={classes.right}>
          <Typography>
            <span className={classes.symbol}>
              {current && current.type === 'groupchat' && '# '}
              {current && current.type === 'chat' && '@ '}
            </span>
            {chatName}
          </Typography>
          {current && current.connectionError && (
            <Typography color="error">({current.connectionError})</Typography>
          )}
          {current && current.type === 'chat' && <Status status={chatStatus} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (states: IStates) => ({
  domain: states.gong.settings.domain,
  current: states.gong.current,
});

const styles: any = (theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    backgroundColor: theme.palette.background.default,
  },
  left: {
    width: theme.sidebarWidth,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit * 2,
    flexShrink: 0,
    '& p': {
      fontWeight: 'bold',
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  right: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    '& p': {
      paddingRight: theme.spacing.unit,
    },
  },
  symbol: {
    opacity: 0.5,
  },
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ToolBar));
