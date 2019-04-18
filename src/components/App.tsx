import * as React from 'react';

import ContextProvider from 'src/context';

// libs
import { SnackbarProvider } from 'notistack';

// components
import IpcRenderer from './IpcRenderer';
import Routes from './Routes';

export const App = () => {
  return (
    <ContextProvider>
      <IpcRenderer />
      <SnackbarProvider maxSnack={3}>
        <Routes />
      </SnackbarProvider>
    </ContextProvider>
  );
};

export default App;
