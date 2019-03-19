import * as React from 'react';
import { withRouter } from 'react-router-dom';

// redux & actions
import { connect } from 'react-redux';
import { autoLogin } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

// components
import LoadingIcon from './icons/LoadingIcon';

class Loading extends React.Component<any, any> {
  public state = {
    text: 'Loading please wait...',
    showLogin: false,
  };

  private reconnectTimer: any;

  public componentDidMount() {
    this.props.autoLogin();
  }

  public componentDidUpdate(prevProps: any) {
    if (this.props.connection !== prevProps.connection) {
      if (
        !this.props.connection.isConnecting &&
        this.props.connection.isConnecting !== undefined
      ) {
        if (this.props.connection.isConnected) {
          this.props.history.push('/main');
        } else if (!this.props.connection.hasSavedCredentials) {
          this.props.history.push('/login');
        } else if (!this.props.connection.isAuthenticated) {
          if (
            this.props.connection.error !== 'Cannot authorize your credentials'
          ) {
            this.setState({
              text: 'Unable to find the server, retrying connection',
              showLogin: true,
            });
            if (this.reconnectTimer) {
              clearTimeout(this.reconnectTimer);
              this.setState({ text: 'Server not found, retrying connection' });
            }
            this.reconnectTimer = setTimeout(() => {
              this.setState({ text: 'Looking for the server' });
              this.props.autoLogin();
            }, 10000);
          }
        }
      }
    }
  }

  public render() {
    const { classes, app } = this.props;
    const { text, showLogin } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.filler} />
        <div className={classes.content}>
          <h1 className={classes.title}>GONG</h1>
          <LoadingIcon />
          <p className={classes.message}>{text}</p>
          <p className={classes.version}>v{app.version}</p>
        </div>
        {showLogin && (
          <div className={classes.goToLogin}>
            <div className={classes.filler} />
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleLoginClick}
            >
              Take me to login
            </Button>
            <div className={classes.filler} />
          </div>
        )}
        <div className={classes.filler} />
      </div>
    );
  }

  private handleLoginClick = () => {
    clearTimeout(this.reconnectTimer);
    this.props.history.push('/login');
  };
}

const mapStateToProps = (state: any) => ({
  app: state.gong.app,
  connection: state.gong.connection,
});

const mapDispatchToProps = {
  autoLogin,
};

const styles: any = (theme: any) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '-webkit-app-region': 'drag',
  },
  filler: {
    flexGrow: 1,
    '-webkit-app-region': 'drag',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: '68px',
    marginTop: 0,
    marginBottom: '20px',
  },
  message: {
    color: 'white',
    textAlign: 'center',
    margin: theme.spacing.unit / 3,
  },
  version: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.25,
    margin: theme.spacing.unit / 2,
    fontSize: '0.9rem',
  },
  goToLogin: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Loading)));
