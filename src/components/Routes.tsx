import * as React from 'react';

import { Router } from '@reach/router';

// components
import Loading from './Loading';
import Login from './Login';
import Main from './Main';

const Routes = () => {
  return (
    <Router style={{ height: '100%' }}>
      <Loading path="/" noThrow={true} />
      <Login path="login" noThrow={true} />
      <Main path="main" noThrow={true} />
    </Router>
  );
};

export default Routes;
