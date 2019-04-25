// TODO: Remove on material-ui@4.0.0
import './bootstrap';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ContextProvider from './context';

import App from './components/App';
import './index.scss';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// https://github.com/electron/electron/issues/7300
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    require: any;
  }
}
