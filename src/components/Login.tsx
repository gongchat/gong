import React, { FC, useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { useContext } from '../context';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/styles';

import MenuBar from './MenuBar';

interface IProps {
  path: string;
  noThrow: boolean;
}

const Login: FC<IProps> = () => {
  const classes = useStyles();
  const [{ connection }, { connecting }] = useContext();
  const [goToMain, setGoToMain] = useState(false);
  const [domain, setDomain] = useState('');
  const [username, setUsername] = useState('');
  const [resource, setResource] = useState('');
  const [port, setPort] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setErrorMessage('');
    connecting({ domain, username, password, port, resource });
  };

  useEffect(() => {
    if (connection.isConnected) {
      setGoToMain(true);
    }
  }, [connection.isConnected]);

  useEffect(() => {
    setErrorMessage(connection.connectionError);
  }, [connection.connectionError]);

  if (goToMain) {
    return <Redirect to="/main" />;
  } else {
    return (
      <div className={classes.root}>
        <MenuBar showOffline={false} />
        <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.content}>
            <TextValidator
              name="domain"
              onChange={(event: any) => setDomain(event.target.value)}
              label="Domain"
              value={domain}
              variant="filled"
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
              errorMessages={['domain is required', 'domain is invalid']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="username"
              onChange={(event: any) => setUsername(event.target.value)}
              label="Username"
              value={username}
              variant="filled"
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
              errorMessages={['username is required', 'username is invalid']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="resource"
              onChange={(event: any) => setResource(event.target.value)}
              label="Resource"
              placeholder="Resource (ex. work, home, laptop)"
              value={resource}
              variant="filled"
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']}
              errorMessages={['resource is required', 'resource is invalid']}
              FormHelperTextProps={{ className: classes.helperText }}
              className={classes.input}
            />
            <TextValidator
              name="port"
              onChange={(event: any) => setPort(event.target.value)}
              label="Port"
              value={port}
              variant="filled"
              validators={['matchRegexp:^[0-9]*$']}
              errorMessages={['port is invalid']}
              FormHelperTextProps={{ className: classes.helperText }}
              helperText="If empty will default to 5222"
              className={classes.input}
            />
            <TextValidator
              name="password"
              type="password"
              onChange={(event: any) => setPassword(event.target.value)}
              label="Password"
              value={password}
              variant="filled"
              validators={['required']}
              errorMessages={['password is required']}
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
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
      marginBottom: theme.spacing(0.5),
      width: '100%',
      maxWidth: '400px',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
    '& > *:last-child': {
      marginBottom: theme.spacing(4),
    },
  },
  input: {
    flexShrink: 0,
  },
  helperText: {
    margin: 0,
    marginBottom: theme.spacing(0.5),
  },
  button: {
    flexShrink: 0,
  },
  error: {
    marginTop: theme.spacing(1),
  },
}));

export default Login;
