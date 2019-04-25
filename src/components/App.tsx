import React from 'react';
import { useContext } from '../context';

// material ui
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import { SnackbarProvider } from 'notistack';

// components
import IpcRenderer from './IpcRenderer';
import Routes from './Routes';
import SnackbarNotifications from './SnackbarNotifications';

const App: React.FC = () => {
  const [context] = useContext();

  return (
    <ThemeProvider theme={context.theme}>
      <CssBaseline />
      <IpcRenderer />
      <SnackbarProvider maxSnack={3}>
        <SnackbarNotifications />
      </SnackbarProvider>
      <Routes />
    </ThemeProvider>
  );
};

export default App;
