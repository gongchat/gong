import * as React from 'react';
import { withRouter } from 'react-router-dom';

// redux & actions
import { connect } from 'react-redux';
import { autoLogin } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';

// components
import LoadingIcon from './icons/LoadingIcon';

class Loading extends React.Component<any, any> {
  public state = {
    text: 'Loading please wait...',
  };

  private reconnectTimer: any;

  public componentDidMount() {
    this.props.autoLogin();
  }

  public componentWillReceiveProps(nextProps: any) {
    if (
      !nextProps.connection.isConnecting &&
      nextProps.connection.isConnecting !== undefined
    ) {
      if (nextProps.connection.isConnected) {
        this.props.history.push('/main');
      } else if (!nextProps.connection.hasSavedCredentials) {
        this.props.history.push('/login');
      } else if (!nextProps.connection.isAuthenticated) {
        if (
          nextProps.connection.error === 'Cannot authorize your credentials'
        ) {
          // this.props.history.push('/login'); // TODO: this might 
        } else {
          this.setState({
            text: 'Unable to find the server, retrying connection',
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

  public render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <div className={['menu-bar', classes.root].join(' ')}>
        <h1 className={classes.title}>GONG</h1>
        <LoadingIcon />
        <p className={classes.message}>{text}</p>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
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
    overflow: 'hidden',
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
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Loading)));
