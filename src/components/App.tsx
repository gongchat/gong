import * as React from 'react';

// redux
import { Provider } from 'react-redux';
import store from 'src/store';

// libs
import { SnackbarProvider } from 'notistack';

// components
import Router from './Router';

class App extends React.Component<any, any> {
  public render() {
    return (
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <Router />
        </SnackbarProvider>
      </Provider>
    );
  }
}

export default App;
