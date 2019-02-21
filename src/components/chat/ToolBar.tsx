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
  public state = {
    domain: '',
    chatName: '',
    chatType: '',
    chatStatus: '',
  };

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    if (this.props.domain) {
      this.setState({ domain: this.props.domain });
    }
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.domain !== this.state.domain) {
      this.setState({ domain: nextProps.domain });
    }
    if (nextProps.current) {
      if (nextProps.current.type !== this.state.chatType) {
        this.setState({ chatType: nextProps.current.type });
      }

      switch (nextProps.current.type) {
        case 'groupchat':
          this.setState({
            chatName:
              nextProps.current.name.startsWith('#') &&
              nextProps.current.name.length > 1
                ? nextProps.current.name.substring(1)
                : nextProps.current.name,
            chatStatus: nextProps.current.isConnected ? 'online' : 'offline',
          });
          break;
        case 'chat':
          this.setState({
            chatName:
              nextProps.current.vCard && nextProps.current.vCard.fullName
                ? nextProps.current.vCard.fullName
                : nextProps.current.name,
            chatStatus: nextProps.current.status,
          });
          break;
      }
    } else {
      this.setState({ chatName: '', chatType: '', chatStatus: '' });
    }
  }

  public render() {
    const { classes } = this.props;
    const { domain, chatType, chatName, chatStatus } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <Typography>{domain}</Typography>
        </div>
        <div className={classes.right}>
          <Typography>
            <span className={classes.symbol}>
              {chatType === 'groupchat' && '# '}
              {chatType === 'chat' && '@ '}
            </span>
            {chatName}
          </Typography>
          {chatType === 'chat' && <Status status={chatStatus} />}
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
