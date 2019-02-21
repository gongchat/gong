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
    password: '',
    errorMessage: '',
  };

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.connection.isConnected === true) {
      this.props.history.push('/main');
    } else if (nextProps.connection.connectionError) {
      this.setState({ errorMessage: nextProps.connection.connectionError });
    }
  }

  public render() {
    const { classes } = this.props;
    const { domain, username, resource, password, errorMessage } = this.state;

    return (
      <div className={classes.root}>
        <MenuBar showOffline={false} />
        <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
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
    marginTop: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 4,
  },
  form: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit * 8,
    '& div, & button': {
      marginBottom: theme.spacing.unit * 0.5,
      width: '100%',
      maxWidth: '400px',
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
