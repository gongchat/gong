import React from 'react';
import { useContext } from '../context';
import { SnackbarProvider } from 'notistack';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import IpcRenderer from './IpcRenderer';
import Routes from './Routes';
import SnackbarNotifications from './SnackbarNotifications';

const App: React.FC = () => {
  const [{ theme }] = useContext();

  return (
    <ThemeProvider theme={theme}>
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
