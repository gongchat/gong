import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

// register events from electron
const { ipcRenderer } = window.require('electron');
import IpcRenderer from './actions/ipcRenderer';
IpcRenderer.attachEvents(ipcRenderer);

// https://github.com/electron/electron/issues/7300
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    require: any;
  }
}
