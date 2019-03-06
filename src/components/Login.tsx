import * as React from 'react';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

// redux & actions
import { connect } from 'react-redux';
import { login } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

// components
import MenuBar from './MenuBar';

class Login extends React.Component<any, any> {
  public state = {
    domain: '',
    username: '',
    resource: '',
    port: '',
    password: '',
    errorMessage: '',
  };

  public componentDidUpdate(prevProps: any) {
    if (this.props.connection.isConnected) {
      this.props.history.push('/main');
    } else if (
      this.props.connection.connectionError !==
      prevProps.connection.connectionError
    ) {
      this.setState({ errorMessage: this.props.connection.connectionError });
    }
  }

  public render() {
    const { classes } = this.props;
    const {
      domain,
      username,
      resource,
      port,
      password,
      errorMessage,
    } = this.state;

    return (
      <div className={classes.root}>
        <MenuBar showOffline={false} />
        <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
          <div className={classes.content}>
            <Typography className={classes.title}>Welcome to Gong</Typography>
            <TextValidator
              name="domain"
              onChange={this.handleOnChange}
              label="Domain"
              value={domain}
              variant="filled"
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
              errorMessages={[
                'Please input a domain',
                'Please enter a valid domain',
              ]}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="username"
              onChange={this.handleOnChange}
              label="Username"
              value={username}
              variant="filled"
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
              errorMessages={[
                'Please input a username',
                'Please enter a valid username',
              ]}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="resource"
              onChange={this.handleOnChange}
              label="Resource"
              value={resource}
              variant="filled"
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
              errorMessages={[
                'Please input a resource',
                'Please enter a valid resource',
              ]}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="port"
              onChange={this.handleOnChange}
              label="Port"
              value={port}
              variant="filled"
              validators={['matchRegexp:^[0-9]*$']}
              errorMessages={['Please enter a valid port']}
              FormHelperTextProps={{ className: classes.helperText }}
              helperText="If empty will default to 5222"
              className={classes.input}
            />
            <TextValidator
              name="password"
              type="password"
              onChange={this.handleOnChange}
              label="Password"
              value={password}
              variant="filled"
              validators={['required']}
              errorMessages={['Please input a password']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Login
            </Button>
            {errorMessage && errorMessage !== '' && (
              <div>
                <Chip
                  label={errorMessage}
                  color="secondary"
                  className={classes.error}
                />
              </div>
            )}
          </div>
        </ValidatorForm>
      </div>
    );
  }

  private handleOnChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  private handleSubmit = (event: any) => {
    event.preventDefault();
    this.setState({ errorMessage: '' });
    this.props.login({
      domain: this.state.domain,
      username: this.state.username,
      password: this.state.password,
      port: this.state.port,
      resource: this.state.resource,
    });
  };
}

const mapStateToProps = (state: any) => {
  return {
    connection: state.gong.connection,
  };
};

const mapDispatchToProps = {
  login,
};

const styles: any = (theme: any) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
  form: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 0,
    flex: 1,
    '& div, & button': {
      marginBottom: theme.spacing.unit * 0.5,
      width: '100%',
      maxWidth: '400px',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:last-child': {
      marginBottom: theme.spacing.unit * 4,
    },
  },
  input: {
    flexShrink: 0,
  },
  helperText: {
    margin: 0,
    marginBottom: theme.spacing.unit / 2,
  },
  button: {
    flexShrink: 0,
  },
  error: {
    marginTop: theme.spacing.unit,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login));
