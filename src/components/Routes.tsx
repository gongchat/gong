import * as React from 'react';
import { useContext } from 'src/context';

import { Router } from '@reach/router';

// material ui
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

// components
import Loading from './Loading';
import Login from './Login';
import Main from './Main';
import SnackbarNotifications from './SnackbarNotifications';

const Routes = () => {
  const [context, actions] = useContext();

  return (
    <ThemeProvider theme={context.theme}>
      <CssBaseline />
      <SnackbarNotifications />
      <Router style={{ height: '100%' }}>
        <Loading path="/" noThrow={true} />
        <Login path="login" noThrow={true} />
        <Main path="main" noThrow={true} />
      </Router>
    </ThemeProvider>
  );
};

export default Routes;
