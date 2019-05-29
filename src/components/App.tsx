import React, { FC, useEffect } from 'react';
import { useContext } from '../context';
import { SnackbarProvider } from 'notistack';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import IpcRenderer from './IpcRenderer';
import Routes from './Routes';
import SnackbarNotifications from './SnackbarNotifications';

const { ipcRenderer } = window.require('electron');

const App: FC = () => {
  const [{ app, theme }] = useContext();

  console.log(theme);

  useEffect(() => {
    if (!app || app.version === '') {
      ipcRenderer.send('app-get-info');
    }
  }, [app]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IpcRenderer />
      <Routes />
      <SnackbarProvider maxSnack={3}>
        <SnackbarNotifications />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
