// TODO: Remove on material-ui@4.0.0
import './bootstrap';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ContextProvider from 'src/context';

import App from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

// https://github.com/electron/electron/issues/7300
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    require: any;
  }
}
